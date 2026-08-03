import "server-only";

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; response: NextResponse };

const rateLimitBuckets = new Map<string, RateLimitBucket>();
const MAX_RATE_LIMIT_BUCKETS = 1_024;

function requestError(message: string, status: number): JsonBodyResult {
  return {
    ok: false,
    response: privateJson({ error: message }, { status }),
  };
}

export function privateJson(
  body: unknown,
  init: ResponseInit = {},
): NextResponse {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Pragma", "no-cache");
  headers.set("Vary", "Cookie");

  return NextResponse.json(body, { ...init, headers });
}

export function requireSameOrigin(request: NextRequest): NextResponse | null {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return privateJson({ error: "Forbidden" }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return privateJson({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (new URL(origin).origin !== request.nextUrl.origin) {
      return privateJson({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return privateJson({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export async function readBoundedJson(
  request: NextRequest,
  maximumBytes: number,
): Promise<JsonBodyResult> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return requestError("Content-Type must be application/json", 415);
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (!/^\d+$/.test(declaredLength) || !Number.isSafeInteger(parsedLength)) {
      return requestError("Invalid Content-Length", 400);
    }
    if (parsedLength > maximumBytes) {
      return requestError("Request body is too large", 413);
    }
  }

  if (!request.body) {
    return requestError("Request body must contain valid JSON", 400);
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;
  let rawBody: string;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      receivedBytes += value.byteLength;
      if (receivedBytes > maximumBytes) {
        await reader.cancel().catch(() => undefined);
        return requestError("Request body is too large", 413);
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    rawBody = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return requestError("Request body must contain valid JSON", 400);
  } finally {
    reader.releaseLock();
  }

  try {
    return { ok: true, value: JSON.parse(rawBody) as unknown };
  } catch {
    return requestError("Request body must contain valid JSON", 400);
  }
}

export function clientIdentifier(request: NextRequest): string {
  if (process.env.VERCEL !== "1") return "untrusted-proxy";

  const forwarded = request.headers.get("x-vercel-forwarded-for") || "unknown";
  return forwarded.split(",", 1)[0].trim().slice(0, 128) || "unknown";
}

export function consumeRateLimit(
  namespace: string,
  identifier: string,
  limit: number,
  windowMilliseconds: number,
  now = Date.now(),
): RateLimitResult {
  const key = createHash("sha256")
    .update(`${namespace}:${identifier}`)
    .digest("base64url");
  const current = rateLimitBuckets.get(key);

  if (current && current.resetAt > now) {
    current.count += 1;
    return {
      allowed: current.count <= limit,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000),
      ),
    };
  }

  if (current) rateLimitBuckets.delete(key);
  if (rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
    const oldestKey = rateLimitBuckets.keys().next().value as string | undefined;
    if (oldestKey) rateLimitBuckets.delete(oldestKey);
  }

  const bucket = { count: 1, resetAt: now + windowMilliseconds };

  rateLimitBuckets.set(key, bucket);

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export function clearRateLimit(namespace: string, identifier: string): void {
  const key = createHash("sha256")
    .update(`${namespace}:${identifier}`)
    .digest("base64url");
  rateLimitBuckets.delete(key);
}

export function resetRateLimitsForTests(): void {
  if (process.env.NODE_ENV === "test") rateLimitBuckets.clear();
}

export function rateLimitBucketCountForTests(): number {
  return process.env.NODE_ENV === "test" ? rateLimitBuckets.size : 0;
}
