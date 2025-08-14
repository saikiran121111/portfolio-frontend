import { PortfolioName } from "@/components/portfolio/PortfolioName";
import BottomHeadline from "@/components/portfolio/bottomHeadline/BottomHeadline";

// Server Component by default (App Router)
export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl px-4 h-dvh overflow-hidden relative">
      <PortfolioName portfolioText="Portfolio" xsOffsetX={1} xsOffsetY={-20} offsetX={5} offsetY={-27} tabletOffsetX={-1} tabletOffsetY={-33} desktopOffsetX={-13} desktopOffsetY={-5} xlOffsetX={-13} xlOffsetY={-5} />
      <div className="absolute inset-0 pointer-events-none">
        <BottomHeadline
          xsOffsetX={3}
          xsOffsetY={7}
          offsetX={6}
          offsetY={15}
          tabletOffsetX={-1}
          tabletOffsetY={18}
          desktopOffsetX={-2}
          desktopOffsetY={55}
          xlOffsetX={-2}
          xlOffsetY={55}
        />
      </div>
    </div>
  );
}
