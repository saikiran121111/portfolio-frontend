import { NextRequest } from "next/server";
import { apiUrl } from "@/config/api.config";
import { getCronSecret } from "@/lib/adminConfig";
import { privateJson } from "@/lib/adminRequestSecurity";
import { credentialsMatch } from "@/lib/adminSession";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

export const runtime = "nodejs";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2_000;
const FETCH_TIMEOUT_MS = 8_000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingBackend(url: string): Promise<{ status: number; ok: boolean }> {
  try {
    const response = await fetchWithTimeout(url, {
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
    }, FETCH_TIMEOUT_MS);
    return { status: response.status, ok: response.ok };
  } catch {
    return { status: 0, ok: false };
  }
}

export async function GET(request: NextRequest) {
  let cronSecret: string;
  let healthUrl: string;
  try {
    cronSecret = getCronSecret();
    healthUrl = apiUrl("/health");
  } catch {
    return privateJson({ error: "Service unavailable" }, { status: 503 });
  }

  const authorization = request.headers.get("authorization") ?? "";
  const presentedSecret = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  if (!credentialsMatch(presentedSecret, cronSecret)) {
    return privateJson({ error: "Unauthorized" }, { status: 401 });
  }

  const attempts: { attempt: number; status: number; timestamp: string }[] = [];

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const result = await pingBackend(healthUrl);
    attempts.push({
      attempt,
      status: result.status,
      timestamp: new Date().toISOString(),
    });

    if (result.ok) {
      return privateJson({
        status: "ok",
        message: `Backend is awake (took ${attempt} attempt${attempt > 1 ? "s" : ""})`,
        backendStatus: result.status,
        attempts,
        timestamp: new Date().toISOString(),
      });
    }

    if (attempt < MAX_RETRIES) await delay(RETRY_DELAY_MS);
  }

  console.error("[wake-up] Backend health check failed");
  return privateJson(
    {
      status: "error",
      message: `Backend did not respond after ${MAX_RETRIES} attempts`,
      attempts,
      timestamp: new Date().toISOString(),
    },
    { status: 503 },
  );
}
