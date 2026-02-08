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

        <div className="container mx-auto max-w-6xl py-10 px-4 space-y-10">
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

