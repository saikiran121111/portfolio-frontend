import { API_VERSION, apiUrl, paths } from "@/config/api.config";
import { getAdminApiSecret } from "./adminConfig";

function buildHeaders(extraHeaders?: HeadersInit): HeadersInit {
  return {
    Version: API_VERSION.toString(),
    "x-admin-api-key": getAdminApiSecret(),
    ...extraHeaders,
  };
}

export async function fetchBackendAdminProfile() {
  return fetch(apiUrl(paths.portfolio.adminProfile()), {
    cache: "no-store",
    headers: buildHeaders(),
  });
}

export async function updateBackendAdminProfile(body: string) {
  return fetch(apiUrl(paths.portfolio.adminProfile()), {
    method: "PUT",
    cache: "no-store",
    headers: buildHeaders({
      "Content-Type": "application/json",
    }),
    body,
  });
}
