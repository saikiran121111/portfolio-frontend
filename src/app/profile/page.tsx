import Logo from "@/components/portfolio/logo/Logo";
import ProfileViewClient from "@/components/portfolio/profile/ProfileViewClient";

// Server Component by default (App Router)
export default function PortfolioPage() {
  return (
    <div className="relative min-h-dvh">
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
          introGate={false}
        />
      </div>

      <div className="container mx-auto max-w-6xl py-10 px-4 flex flex-col gap-10">
        <ProfileViewClient />
      </div>
    </div>
  );
}
