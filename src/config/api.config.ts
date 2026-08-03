import "server-only";

export const API_VERSION = 2;

const API_PREFIX = "/api";

export const paths = {
  portfolio: {
    user: () => `${API_PREFIX}/portfolio/user`,
    adminProfile: () => `${API_PREFIX}/portfolio/admin/profile`,
  },
};

function apiDomain(): string {
  const configuredDomain = process.env.API_BASE_URL?.trim();
  if (!configuredDomain) {
    throw new Error("Backend API is not configured");
  }

  let parsed: URL;
  try {
    parsed = new URL(configuredDomain);
  } catch {
    throw new Error("Backend API configuration is invalid");
  }

  const validProtocol =
    parsed.protocol === "https:" ||
    (process.env.NODE_ENV !== "production" && parsed.protocol === "http:");
  if (
    !validProtocol ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error("Backend API configuration is invalid");
  }

  return parsed.origin;
}

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error("Backend API path must be absolute");
  }

  return new URL(path, apiDomain()).toString();
}
