import { NextRequest } from "next/server";
import { getAdminLoginEmail, getAdminLoginPassword } from "@/lib/adminConfig";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSession,
  credentialsMatch,
  getAdminSessionCookieOptions,
} from "@/lib/adminSession";
import {
  clearRateLimit,
  clientIdentifier,
  consumeRateLimit,
  privateJson,
  readBoundedJson,
  requireSameOrigin,
} from "@/lib/adminRequestSecurity";

export const runtime = "nodejs";

const LOGIN_BODY_MAX_BYTES = 4 * 1024;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_GLOBAL_LIMIT = 120;

function rateLimitResponse(retryAfterSeconds: number) {
  const response = privateJson(
    { error: "Too many sign-in attempts. Try again later." },
    { status: 429 },
  );
  response.headers.set("Retry-After", retryAfterSeconds.toString());
  return response;
}

export async function POST(request: NextRequest) {
  const originFailure = requireSameOrigin(request);
  if (originFailure) return originFailure;

  try {
    const globalLimit = consumeRateLimit(
      "admin-login-global",
      "primary",
      LOGIN_GLOBAL_LIMIT,
      LOGIN_RATE_WINDOW_MS,
    );
    if (!globalLimit.allowed) {
      return rateLimitResponse(globalLimit.retryAfterSeconds);
    }

    const clientKey = clientIdentifier(request);
    const clientLimit = consumeRateLimit(
      "admin-login-client",
      clientKey,
      8,
      LOGIN_RATE_WINDOW_MS,
    );
    if (!clientLimit.allowed) {
      return rateLimitResponse(clientLimit.retryAfterSeconds);
    }

    const parsedBody = await readBoundedJson(request, LOGIN_BODY_MAX_BYTES);
    if (!parsedBody.ok) return parsedBody.response;

    const body = parsedBody.value as
      | { email?: string; password?: string }
      | null;

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    const accountLimit = consumeRateLimit(
      "admin-login-account",
      "primary",
      30,
      LOGIN_RATE_WINDOW_MS,
    );

    if (!accountLimit.allowed) {
      return rateLimitResponse(accountLimit.retryAfterSeconds);
    }

    if (!email || !password) {
      return privateJson(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const expectedEmail = getAdminLoginEmail();
    const expectedPassword = getAdminLoginPassword();
    const emailMatches = credentialsMatch(email, expectedEmail);
    const passwordMatches = credentialsMatch(password, expectedPassword);

    if (!emailMatches || !passwordMatches) {
      return privateJson(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    clearRateLimit("admin-login-client", clientKey);
    clearRateLimit("admin-login-account", "primary");

    const session = createAdminSession(expectedEmail);
    const response = privateJson({
      authenticated: true,
      expiresAt: session.expiresAt,
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      session.token,
      getAdminSessionCookieOptions(),
    );

    return response;
  } catch {
    console.error("[admin/login] Sign-in failed");
    return privateJson({ error: "Unable to sign in" }, { status: 500 });
  }
}
