import {
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSession,
  credentialsMatch,
  getAdminSessionCookieOptions,
  verifyAdminSession,
} from "@/lib/adminSession";

describe("admin sessions", () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "s".repeat(48);
    jest.useFakeTimers().setSystemTime(new Date("2026-08-03T00:00:00Z"));
  });

  afterEach(() => jest.useRealTimers());

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it("creates and verifies signed, time-bounded tokens", () => {
    const session = createAdminSession("Admin@Example.com");
    expect(verifyAdminSession(session.token)).toEqual({
      email: "admin@example.com",
      expiresAt: session.expiresAt,
    });
  });

  it("rejects tampered and expired tokens", () => {
    const session = createAdminSession("admin@example.com");
    const tampered = `${session.token.slice(0, -1)}x`;
    expect(verifyAdminSession(tampered)).toBeNull();

    jest.advanceTimersByTime((ADMIN_SESSION_MAX_AGE_SECONDS + 1) * 1000);
    expect(verifyAdminSession(session.token)).toBeNull();
  });

  it("uses a narrow, HttpOnly, strict cookie", () => {
    expect(getAdminSessionCookieOptions()).toEqual(expect.objectContaining({
      httpOnly: true,
      sameSite: "strict",
      path: "/api/admin",
      priority: "high",
    }));
  });

  it("compares credentials safely", () => {
    expect(credentialsMatch("same-value", "same-value")).toBe(true);
    expect(credentialsMatch("wrong", "same-value")).toBe(false);
  });
});
