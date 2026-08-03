import {
  getAdminApiSecret,
  getAdminLoginEmail,
  getAdminLoginPassword,
  getAdminSessionSecret,
  getCronSecret,
} from "@/lib/adminConfig";

describe("admin configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    for (const key of [
      "ADMIN_LOGIN_EMAIL",
      "ADMIN_LOGIN_PASSWORD",
      "ADMIN_SESSION_SECRET",
      "ADMIN_API_SECRET",
      "CRON_SECRET",
    ]) delete process.env[key];
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("has no predictable development fallbacks", () => {
    expect(() => getAdminLoginEmail()).toThrow(/not securely configured/);
    expect(() => getAdminLoginPassword()).toThrow(/not securely configured/);
    expect(() => getAdminSessionSecret()).toThrow(/not securely configured/);
    expect(() => getAdminApiSecret()).toThrow(/not securely configured/);
    expect(() => getCronSecret()).toThrow(/not securely configured/);
  });

  it("accepts strong server-only values", () => {
    process.env.ADMIN_LOGIN_EMAIL = "ADMIN@example.com";
    process.env.ADMIN_LOGIN_PASSWORD = "long-admin-password";
    process.env.ADMIN_SESSION_SECRET = "s".repeat(48);
    process.env.ADMIN_API_SECRET = "a".repeat(32);
    process.env.CRON_SECRET = "c".repeat(32);

    expect(getAdminLoginEmail()).toBe("admin@example.com");
    expect(getAdminLoginPassword()).toBe("long-admin-password");
    expect(getAdminSessionSecret()).toHaveLength(48);
    expect(getAdminApiSecret()).toHaveLength(32);
    expect(getCronSecret()).toHaveLength(32);
  });
});
