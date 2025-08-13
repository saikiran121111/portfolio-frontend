import { PortfolioName } from "@/components/portfolio/PortfolioName";

// Server Component by default (App Router)
export default function PortfolioPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 flex flex-col gap-10">
      <PortfolioName />
    </div>
  );
}
