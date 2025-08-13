import { apiUrl, paths, API_VERSION } from "@/config/api.config";
import { PortfolioDto } from "@/dto/portfolio.dto";
import { IPortfolio } from "@/interfaces/portfolio.interface";
import { mapPortfolio } from "@/mappers/portfolio.mapper";

export async function fetchUserPortfolio(options?: RequestInit): Promise<IPortfolio> {
  const res = await fetch(apiUrl(paths.portfolio.user()), {
    headers: {
      ...(options?.headers || {}),
      Version: API_VERSION.toString(),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user portfolio: ${res.status}`);
  }

  const data: PortfolioDto = await res.json();
  return mapPortfolio(data);
}
