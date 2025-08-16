import Logo from "@/components/portfolio/logo/Logo";
import ReportsSection from "@/components/portfolio/profile/sections/ReportsSection";
import { fetchUserPortfolio } from "@/services/portfolio.service";
import SecurityScansViewClient from "@/components/portfolio/tool/SecurityScansViewClient";

export default async function ToolsPage() {
  const data = await fetchUserPortfolio({ cache: "no-store" });
  const reports = data.scanReports ?? [];

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

      <div className="container mx-auto max-w-6xl py-10 px-4">
        {/* Security reports (client-rendered) */}
        <SecurityScansViewClient />

        {/* Fallback SSR render for reports if available */}
        {reports.length > 0 ? (
          <ReportsSection reports={reports} />
        ) : (
          <div className="container mx-auto max-w-4xl px-4 py-10">
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-white/70">
              No security or quality reports available.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
