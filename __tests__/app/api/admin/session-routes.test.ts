import { NextRequest } from "next/server";
import { POST as logout } from "@/app/api/admin/logout/route";
import { GET as getSession } from "@/app/api/admin/session/route";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSession,
} from "@/lib/adminSession";

describe("admin session routes", () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "s".repeat(48);
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it("reports signed sessions without public caching", async () => {
    const session = createAdminSession("admin@example.com");
    const request = new NextRequest("https://portfolio.example/api/admin/session", {
      headers: { cookie: `${ADMIN_SESSION_COOKIE_NAME}=${session.token}` },
    });

    const response = await getSession(request);

    expect(await response.json()).toEqual({
      authenticated: true,
      expiresAt: session.expiresAt,
    });
    expect(response.headers.get("Cache-Control")).toBe("private, no-store, max-age=0");
  });

  it("rejects cross-origin logout and expires the cookie for same-origin logout", async () => {
    const foreign = await logout(new NextRequest(
      "https://portfolio.example/api/admin/logout",
      { method: "POST", headers: { origin: "https://attacker.example" } },
    ));
    expect(foreign.status).toBe(403);

    const response = await logout(new NextRequest(
      "https://portfolio.example/api/admin/logout",
      { method: "POST", headers: { origin: "https://portfolio.example" } },
    ));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
