import type {
  IAdminPortfolioEditor,
  IAdminSessionResponse,
} from "@/interfaces/admin.interface";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | (T & { error?: string; message?: string })
    | null;

  if (!response.ok) {
    const errorMessage =
      payload?.error ||
      payload?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return payload as T;
}

export async function getAdminSession(): Promise<IAdminSessionResponse> {
  const response = await fetch("/api/admin/session", {
    cache: "no-store",
  });

  return parseJsonResponse<IAdminSessionResponse>(response);
}

export async function loginAdmin(credentials: {
  email: string;
  password: string;
}): Promise<IAdminSessionResponse> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return parseJsonResponse<IAdminSessionResponse>(response);
}

export async function logoutAdmin(): Promise<void> {
  const response = await fetch("/api/admin/logout", {
    method: "POST",
  });

  await parseJsonResponse<{ ok: true }>(response);
}

export async function fetchAdminPortfolio(): Promise<IAdminPortfolioEditor> {
  const response = await fetch("/api/admin/profile", {
    cache: "no-store",
  });

  return parseJsonResponse<IAdminPortfolioEditor>(response);
}

export async function saveAdminPortfolio(
  payload: IAdminPortfolioEditor,
): Promise<IAdminPortfolioEditor> {
  const response = await fetch("/api/admin/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<IAdminPortfolioEditor>(response);
}
