import "server-only";

export function getResumeSourceUrl(): string {
  const configuredUrl = process.env.RESUME_SOURCE_URL?.trim();
  if (!configuredUrl) {
    throw new Error("Resume source is not configured");
  }

  try {
    const parsed = new URL(configuredUrl);
    if (
      parsed.protocol !== "https:" ||
      parsed.username ||
      parsed.password ||
      parsed.hash
    ) {
      throw new Error();
    }
    return parsed.toString();
  } catch {
    throw new Error("Resume source configuration is invalid");
  }
}
