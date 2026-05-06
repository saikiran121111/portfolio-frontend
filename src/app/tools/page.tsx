import type { Metadata } from "next";
import Logo from "@/components/portfolio/logo/Logo";
import { fetchUserPortfolio } from "@/services/portfolio.service";
import SecurityScansViewClient from "@/components/portfolio/tool/SecurityScansViewClient";
import ToolsShowcase from "@/components/portfolio/tool/ToolsShowcase";
import TechStackShowcase from "@/components/portfolio/tool/TechStackShowcase";
import ToolsGuardWrapper from "./ToolsGuardWrapper";

export const metadata: Metadata = {
  title: "Tools",
  description: "Explore the tech stack, tools, and security reports",
};

export default async function ToolsPage() {
  const data = await fetchUserPortfolio({ cache: "no-store" });
  const reports = data.scanReports ?? [];
  const tools = data.toolDocs ?? [];

  return (
    <ToolsGuardWrapper>
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
          />
        </div>

        <div className="container mx-auto max-w-6xl px-4 pb-10 pt-[calc(var(--safe-top)+5.35rem)] space-y-8 sm:space-y-10 sm:py-10">
          {/* Tech Stack Architecture showcase */}
          <TechStackShowcase portfolio={data} />

          {/* Tools showcase */}
          <ToolsShowcase tools={tools} />

          {/* Security reports (client-rendered; receives SSR data to avoid duplicate) */}
          <SecurityScansViewClient initialReports={reports} />
        </div>
      </div>
    </ToolsGuardWrapper>
  );
}

