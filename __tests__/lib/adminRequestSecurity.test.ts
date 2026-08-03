import { NextRequest } from "next/server";
import {
  clientIdentifier,
  consumeRateLimit,
  privateJson,
  rateLimitBucketCountForTests,
  readBoundedJson,
  requireSameOrigin,
  resetRateLimitsForTests,
} from "@/lib/adminRequestSecurity";

function request(
  headers: Record<string, string> = {},
  body?: string,
): NextRequest {
  return new NextRequest("https://portfolio.example/api/admin/login", {
    method: "POST",
    headers,
    body,
  });
}

describe("admin request security", () => {
  beforeEach(() => resetRateLimitsForTests());

  it("allows same-origin mutations and rejects missing or foreign origins", async () => {
    expect(requireSameOrigin(request({ origin: "https://portfolio.example" }))).toBeNull();

    const missing = requireSameOrigin(request());
    const foreign = requireSameOrigin(request({
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
    }));

    expect(missing?.status).toBe(403);
    expect(foreign?.status).toBe(403);
    expect(await foreign?.json()).toEqual({ error: "Forbidden" });
  });

  it("accepts bounded JSON and rejects wrong media types or oversized bodies", async () => {
    const valid = await readBoundedJson(
      request({ "content-type": "application/json" }, '{"ok":true}'),
      100,
    );
    expect(valid).toEqual({ ok: true, value: { ok: true } });

    const wrongType = await readBoundedJson(
      request({ "content-type": "text/plain" }, "{}"),
      100,
    );
    expect(wrongType.ok).toBe(false);
    if (!wrongType.ok) expect(wrongType.response.status).toBe(415);

    const oversized = await readBoundedJson(
      request(
        { "content-type": "application/json", "content-length": "101" },
        "{}",
      ),
      100,
    );
    expect(oversized.ok).toBe(false);
    if (!oversized.ok) expect(oversized.response.status).toBe(413);
  });

  it("stops reading a streamed body as soon as the byte limit is exceeded", async () => {
    let pulls = 0;
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new Uint8Array(64));
        if (pulls === 1_000) controller.close();
      },
      cancel() {
        cancelled = true;
      },
    });
    const streamedRequest = {
      headers: new Headers({ "content-type": "application/json" }),
      body,
    } as unknown as NextRequest;

    const result = await readBoundedJson(streamedRequest, 100);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(413);
    expect(cancelled).toBe(true);
    expect(pulls).toBeLessThan(1_000);
  });

  it("limits repeated attempts without storing raw identifiers", () => {
    expect(consumeRateLimit("login", "198.51.100.2", 2, 60_000, 1_000).allowed).toBe(true);
    expect(consumeRateLimit("login", "198.51.100.2", 2, 60_000, 1_001).allowed).toBe(true);
    const blocked = consumeRateLimit("login", "198.51.100.2", 2, 60_000, 1_002);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keeps the in-memory fallback bounded under high-cardinality traffic", () => {
    for (let index = 0; index < 2_000; index += 1) {
      consumeRateLimit("login", `client-${index}`, 2, 60_000, 1_000);
    }

    expect(rateLimitBucketCountForTests()).toBeLessThanOrEqual(1_024);
  });

  it("trusts Vercel's protected client header only on Vercel", () => {
    const previousVercel = process.env.VERCEL;
    process.env.VERCEL = "1";
    expect(clientIdentifier(request({
      "x-vercel-forwarded-for": "198.51.100.20, 203.0.113.5",
    }))).toBe("198.51.100.20");

    delete process.env.VERCEL;
    expect(clientIdentifier(request({
      "x-real-ip": "198.51.100.21",
      "x-forwarded-for": "198.51.100.22",
    }))).toBe("untrusted-proxy");

    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
  });

  it("marks sensitive JSON responses private and uncacheable", () => {
    const response = privateJson({ authenticated: false });
    expect(response.headers.get("Cache-Control")).toBe("private, no-store, max-age=0");
    expect(response.headers.get("Pragma")).toBe("no-cache");
    expect(response.headers.get("Vary")).toBe("Cookie");
  });
});
