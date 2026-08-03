import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getAdminSessionSecret } from "./adminConfig";

export const ADMIN_SESSION_COOKIE_NAME = "portfolio_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface IAdminSessionPayload {
  version: 1;
  email: string;
  issuedAt: number;
  expiresAt: number;
  sessionId: string;
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
      parsed.version !== 1 ||
      typeof parsed.email !== "string" ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.expiresAt !== "number" ||
      typeof parsed.sessionId !== "string" ||
      !Number.isFinite(parsed.issuedAt) ||
      !Number.isFinite(parsed.expiresAt) ||
      !/^[A-Za-z0-9_-]{20,}$/.test(parsed.sessionId)
    ) {
      return null;
    }

    return parsed as IAdminSessionPayload;
  } catch {
    return null;
  }
}

export function createAdminSession(email: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + ADMIN_SESSION_MAX_AGE_SECONDS;
  const payload = encodePayload({
    version: 1,
    email: email.toLowerCase(),
    issuedAt,
    expiresAt,
    sessionId: randomBytes(18).toString("base64url"),
  });
  const signature = signPayload(payload);

  return {
    token: `${payload}.${signature}`,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
  };
}

export function verifyAdminSession(
  token: string | undefined | null,
): IVerifiedAdminSession | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  if (!safeCompare(signature, expectedSignature)) return null;

  const decoded = decodePayload(payload);
  if (!decoded) return null;

  const now = Math.floor(Date.now() / 1000);
  if (
    decoded.expiresAt <= now ||
    decoded.issuedAt > now + 60 ||
    decoded.expiresAt - decoded.issuedAt !== ADMIN_SESSION_MAX_AGE_SECONDS
  ) {
    return null;
  }

  return {
    email: decoded.email,
    expiresAt: new Date(decoded.expiresAt * 1000).toISOString(),
  };
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/api/admin",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    priority: "high" as const,
  };
}

export function credentialsMatch(left: string, right: string): boolean {
  return safeCompare(left, right);
}
