import "server-only";

function requiredValue(envKey: string, minimumLength = 1): string {
  const value = process.env[envKey]?.trim();
  if (!value || value.length < minimumLength) {
    throw new Error(`${envKey} is not securely configured`);
  }
  return value;
}

export function getAdminLoginEmail(): string {
  const email = requiredValue("ADMIN_LOGIN_EMAIL");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_LOGIN_EMAIL is not securely configured");
  }
  return email.toLowerCase();
}

export function getAdminLoginPassword(): string {
  return requiredValue("ADMIN_LOGIN_PASSWORD", 12);
}

export function getAdminSessionSecret(): string {
  return requiredValue("ADMIN_SESSION_SECRET", 32);
}

export function getAdminApiSecret(): string {
  return requiredValue("ADMIN_API_SECRET", 16);
}

export function getCronSecret(): string {
  return requiredValue("CRON_SECRET", 16);
}
