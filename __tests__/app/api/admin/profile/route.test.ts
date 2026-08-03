import { NextRequest } from "next/server";
import { GET, PUT } from "@/app/api/admin/profile/route";
import {
  fetchBackendAdminProfile,
  updateBackendAdminProfile,
} from "@/lib/adminApi";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSession,
} from "@/lib/adminSession";

jest.mock("@/lib/adminApi", () => ({
  fetchBackendAdminProfile: jest.fn(),
  updateBackendAdminProfile: jest.fn(),
}));

function authenticatedRequest(body: string, origin = "https://portfolio.example") {
  const session = createAdminSession("admin@example.com");
  return new NextRequest("https://portfolio.example/api/admin/profile", {
    method: "PUT",
    headers: {
      cookie: `${ADMIN_SESSION_COOKIE_NAME}=${session.token}`,
      origin,
      "content-type": "application/json",
    },
    body,
  });
}

describe("admin profile route security", () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_SESSION_SECRET = "s".repeat(48);
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it("rejects anonymous reads before contacting backend", async () => {
    const response = await GET(new NextRequest(
      "https://portfolio.example/api/admin/profile",
    ));

    expect(response.status).toBe(401);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store, max-age=0");
    expect(fetchBackendAdminProfile).not.toHaveBeenCalled();
  });

  it("rejects cross-origin, malformed, and oversized writes before backend access", async () => {
    const foreign = await PUT(authenticatedRequest("{}", "https://attacker.example"));
    const malformed = await PUT(authenticatedRequest("not-json"));
    const oversized = await PUT(authenticatedRequest(JSON.stringify({
      padding: "x".repeat(513 * 1024),
    })));

    expect(foreign.status).toBe(403);
    expect(malformed.status).toBe(400);
    expect(oversized.status).toBe(413);
    expect(fetchBackendAdminProfile).not.toHaveBeenCalled();
    expect(updateBackendAdminProfile).not.toHaveBeenCalled();
  });
});
