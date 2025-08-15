import { PortfolioName } from "@/components/portfolio/PortfolioName";
import BottomHeadline from "@/components/portfolio/bottomHeadline/BottomHeadline";
import Logo from "@/components/portfolio/logo/Logo";

// Server Component by default (App Router)
export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl px-4 h-dvh xl:overflow-visible relative">
      <PortfolioName portfolioText="Portfolio" xsOffsetX={1} xsOffsetY={-20} offsetX={5} offsetY={-27} tabletOffsetX={-1} tabletOffsetY={-33} desktopOffsetX={-13} desktopOffsetY={-5} xlOffsetX={-13} xlOffsetY={-5} />

      {/* Clickable logo overlay (pointer-events enabled only on the logo) */}
      <div className="fixed inset-0 pointer-events-none">
        <Logo
          className="text-white hover:text-cyan-400"
          size={45}
          xsOffsetX={-2}
          xsOffsetY={30}
          offsetX={-2}
          offsetY={75}
          tabletOffsetX={-4}
          tabletOffsetY={70}
          desktopOffsetX={-6}
          desktopOffsetY={75}
          xlOffsetY={75}
          v="top"
          h="left"
          // Clamp to 50px from the screen's left edge
          minLeftPx={30}
          xlMinLeftPx={100}
          desktopMinLeftPx={100}
          tabletMinLeftPx={30}
          xsMinLeftPx={8}

        />
      </div>

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
