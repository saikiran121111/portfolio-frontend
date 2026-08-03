import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/login/route";
import { resetRateLimitsForTests } from "@/lib/adminRequestSecurity";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "strong-admin-password";

function loginRequest(
  body: unknown,
  options: { origin?: string; contentType?: string; ip?: string } = {},
) {
  return new NextRequest("https://portfolio.example/api/admin/login", {
    method: "POST",
    headers: {
      origin: options.origin ?? "https://portfolio.example",
      "content-type": options.contentType ?? "application/json",
      "x-vercel-forwarded-for": options.ip ?? "198.51.100.10",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("admin login route", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    resetRateLimitsForTests();
    process.env = {
      ...originalEnv,
      ADMIN_LOGIN_EMAIL: ADMIN_EMAIL,
      ADMIN_LOGIN_PASSWORD: ADMIN_PASSWORD,
      ADMIN_SESSION_SECRET: "s".repeat(48),
      VERCEL: "1",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("rejects cross-origin and non-JSON requests", async () => {
    const crossOrigin = await POST(loginRequest(
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      { origin: "https://attacker.example" },
    ));
    const wrongType = await POST(loginRequest(
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      { contentType: "text/plain", ip: "198.51.100.11" },
    ));

    expect(crossOrigin.status).toBe(403);
    expect(wrongType.status).toBe(415);
  });

  it("returns a strict session cookie after valid credentials", async () => {
    const response = await POST(loginRequest({
      email: ADMIN_EMAIL.toUpperCase(),
      password: ADMIN_PASSWORD,
    }));
    const cookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ authenticated: true }));
    expect(cookie).toContain("portfolio_admin_session=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=strict");
    expect(cookie).toContain("Path=/api/admin");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store, max-age=0");
  });

  it("returns generic errors for invalid credentials and missing configuration", async () => {
    const invalid = await POST(loginRequest({
      email: ADMIN_EMAIL,
      password: "wrong-password",
    }));
    expect(invalid.status).toBe(401);
    expect(await invalid.json()).toEqual({ error: "Invalid credentials" });

    delete process.env.ADMIN_LOGIN_PASSWORD;
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const unconfigured = await POST(loginRequest(
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      { ip: "198.51.100.12" },
    ));
    errorSpy.mockRestore();

    expect(unconfigured.status).toBe(500);
    expect(await unconfigured.json()).toEqual({ error: "Unable to sign in" });
  });

  it("rejects oversized bodies and throttles repeated failures", async () => {
    const oversized = await POST(loginRequest({ padding: "x".repeat(5_000) }, {
      ip: "198.51.100.13",
    }));
    expect(oversized.status).toBe(413);

    let response: Response | undefined;
    for (let attempt = 0; attempt < 9; attempt += 1) {
      response = await POST(loginRequest(
        { email: ADMIN_EMAIL, password: "wrong-password" },
        { ip: "198.51.100.14" },
      ));
    }

    expect(response?.status).toBe(429);
    expect(response?.headers.get("Retry-After")).toBeTruthy();
  });

  it("throttles malformed traffic before reading more request bodies", async () => {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 9; attempt += 1) {
      response = await POST(loginRequest("not-json", {
        contentType: "text/plain",
        ip: "198.51.100.15",
      }));
    }

    expect(response?.status).toBe(429);
  });

  it("applies one bounded account limit across attacker-controlled emails", async () => {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 31; attempt += 1) {
      response = await POST(loginRequest(
        { email: `attacker-${attempt}@example.com`, password: "wrong-password" },
        { ip: `198.51.100.${attempt + 30}` },
      ));
    }

    expect(response?.status).toBe(429);
  });
});
