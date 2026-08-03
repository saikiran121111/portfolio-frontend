import { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSession,
} from "@/lib/adminSession";
import { privateJson } from "@/lib/adminRequestSecurity";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = verifyAdminSession(token);

  return privateJson({
    authenticated: Boolean(session),
    expiresAt: session?.expiresAt ?? null,
  });
}
