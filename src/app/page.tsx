import { PortfolioName } from "@/components/portfolio/PortfolioName";

// Server Component by default (App Router)
export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl px-4 h-dvh overflow-hidden">
      <PortfolioName offsetX={5} offsetY={-27} tabletOffsetX={-1} tabletOffsetY={-33} desktopOffsetX={-13} desktopOffsetY={-3} xlOffsetX={-13} xlOffsetY={-5} />
    </div>
  );
}
