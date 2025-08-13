import { fetchUserPortfolio } from "@/services/portfolio.service";

interface PortfolioNameProps {
  className?: string;
}

export async function PortfolioName({ className }: PortfolioNameProps) {
  const { name } = await fetchUserPortfolio();
  return (
    <h1
      className=
        "text-2xl font-bold tracking-tight md:text-4xl desktop:text-5xl md:leading-tight mt-[402px] sm:mt-0"
    >
      {name}
    </h1>
  );
}
