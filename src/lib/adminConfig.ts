function getDevOrThrow(
  value: string | undefined,
  envKey: string,
  fallback?: string,
): string {
  if (value) {
    return value;
  }

  if (process.env.NODE_ENV !== "production" && fallback) {
    return fallback;
  }

  throw new Error(`${envKey} is not configured`);
}

export function getAdminLoginEmail(): string {
  return getDevOrThrow(
    process.env.ADMIN_LOGIN_EMAIL,
    "ADMIN_LOGIN_EMAIL",
    "admin@example.com",
  );
}

export function getAdminLoginPassword(): string {
  return getDevOrThrow(
    process.env.ADMIN_LOGIN_PASSWORD,
    "ADMIN_LOGIN_PASSWORD",
    "admin123456",
  );
}

export function getAdminSessionSecret(): string {
  return getDevOrThrow(
    process.env.ADMIN_SESSION_SECRET,
    "ADMIN_SESSION_SECRET",
    "dev-admin-session-secret-change-me",
  );
}

export function getAdminApiSecret(): string {
  return getDevOrThrow(
    process.env.ADMIN_API_SECRET,
    "ADMIN_API_SECRET",
    "dev-admin-api-secret-change-me",
  );
}
