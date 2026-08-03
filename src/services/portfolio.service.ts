import "server-only";

import { apiUrl, paths, API_VERSION } from "@/config/api.config";
import { PortfolioDto } from "@/dto/portfolio.dto";
import { IPortfolio } from "@/interfaces/portfolio.interface";
import { mapPortfolio } from "@/mappers/portfolio.mapper";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

export async function fetchUserPortfolio(options?: RequestInit): Promise<IPortfolio> {
  const headers = new Headers(options?.headers);
  headers.set("Version", API_VERSION.toString());

  const res = await fetchWithTimeout(apiUrl(paths.portfolio.user()), {
    ...options,
    headers,
    credentials: "omit",
    redirect: "error",
  }, 15_000);

  if (!res.ok) {
    throw new Error(`Failed to fetch user portfolio: ${res.status}`);
  }

  const data: PortfolioDto = await res.json();
  return mapPortfolio(data);
}
