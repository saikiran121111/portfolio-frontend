import { NextRequest, NextResponse } from "next/server";
import { getAdminLoginEmail, getAdminLoginPassword } from "@/lib/adminConfig";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSession,
  credentialsMatch,
  getAdminSessionCookieOptions,
} from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string; password?: string }
      | null;

    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const expectedEmail = getAdminLoginEmail();
    const expectedPassword = getAdminLoginPassword();

    if (
      !credentialsMatch(email, expectedEmail) ||
      !credentialsMatch(password, expectedPassword)
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const session = createAdminSession(expectedEmail);
    const response = NextResponse.json({
      authenticated: true,
      expiresAt: session.expiresAt,
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      session.token,
      getAdminSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
