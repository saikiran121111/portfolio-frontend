import { fetchUserPortfolio } from "@/services/portfolio.service";

interface PortfolioNameProps {
  className?: string;
}

export async function PortfolioName({ className }: PortfolioNameProps) {
  const { name } = await fetchUserPortfolio();
  return (
    <h1 className={className ? className : "text-3xl font-bold"}>
      {name}
    </h1>
  );
}
