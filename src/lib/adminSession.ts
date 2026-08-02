import { createHmac, timingSafeEqual } from "crypto";
import { getAdminSessionSecret } from "./adminConfig";

export const ADMIN_SESSION_COOKIE_NAME = "portfolio_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface IAdminSessionPayload {
  email: string;
  exp: number;
}

export interface IVerifiedAdminSession {
  email: string;
  expiresAt: string;
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getAdminSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function encodePayload(payload: IAdminSessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(encodedPayload: string): IAdminSessionPayload | null {
  try {
    const raw = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as Partial<IAdminSessionPayload>;

    if (
      typeof parsed.email !== "string" ||
      typeof parsed.exp !== "number" ||
      !Number.isFinite(parsed.exp)
    ) {
      return null;
    }

    return {
      email: parsed.email,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function createAdminSession(email: string) {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS;
  const payload = encodePayload({ email, exp });
  const signature = signPayload(payload);

  return {
    token: `${payload}.${signature}`,
    expiresAt: new Date(exp * 1000).toISOString(),
  };
}

export function verifyAdminSession(
  token: string | undefined | null,
): IVerifiedAdminSession | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  const decoded = decodePayload(payload);
  if (!decoded || decoded.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return {
    email: decoded.email,
    expiresAt: new Date(decoded.exp * 1000).toISOString(),
  };
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

export function credentialsMatch(left: string, right: string): boolean {
  return safeCompare(left, right);
}
