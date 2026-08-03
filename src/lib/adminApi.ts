import "server-only";

import { API_VERSION, apiUrl, paths } from "@/config/api.config";
import { getAdminApiSecret } from "./adminConfig";
import { fetchWithTimeout } from "./fetchWithTimeout";

const ADMIN_REQUEST_TIMEOUT_MS = 15_000;

function buildHeaders(extraHeaders?: HeadersInit): HeadersInit {
  return {
    ...extraHeaders,
    Version: API_VERSION.toString(),
    "x-admin-api-key": getAdminApiSecret(),
  };
}

export async function fetchBackendAdminProfile() {
  return fetchWithTimeout(apiUrl(paths.portfolio.adminProfile()), {
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    headers: buildHeaders(),
  }, ADMIN_REQUEST_TIMEOUT_MS);
}

export async function updateBackendAdminProfile(body: string) {
  return fetchWithTimeout(apiUrl(paths.portfolio.adminProfile()), {
    method: "PUT",
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    headers: buildHeaders({
      "Content-Type": "application/json",
    }),
    body,
  }, ADMIN_REQUEST_TIMEOUT_MS);
}
