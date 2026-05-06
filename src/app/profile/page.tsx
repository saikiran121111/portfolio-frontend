import type { Metadata } from "next";
import Logo from "@/components/portfolio/logo/Logo";
import ProfileViewClient from "@/components/portfolio/profile/ProfileViewClient";
import ProfileGuardWrapper from "./ProfileGuardWrapper";

export const metadata: Metadata = {
  title: "Profile",
  description: "View Sai Kiran's professional profile - Experience, skills, and achievements",
};
// Server Component by default (App Router)
export default function PortfolioPage() {
  return (
    <ProfileGuardWrapper>
      <div className="relative min-h-dvh">
        {/* Clickable logo overlay (pointer-events enabled only on the logo) */}
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Logo
            className="text-white hover:text-cyan-400"
            size={45}
            xsSize={34}
            tabletSize={42}
            desktopSize={45}
            xsOffsetX={-2}
            xsOffsetY={10}
            offsetX={-2}
            offsetY={16}
            tabletOffsetX={-4}
            tabletOffsetY={28}
            desktopOffsetX={-6}
            desktopOffsetY={42}
            xlOffsetY={42}
            v="top"
            h="left"
            // Clamp to 50px from the screen's left edge
            minLeftPx={22}
            xlMinLeftPx={100}
            desktopMinLeftPx={100}
            tabletMinLeftPx={30}
            xsMinLeftPx={10}
            introGate={false}
            mobileShell={false}
          />
        </div>

        <div className="px-4 pt-[calc(var(--safe-top)+5.35rem)] pb-8 sm:px-0 sm:py-10">
          <ProfileViewClient />
        </div>
      </div>
    </ProfileGuardWrapper>
  );
}

