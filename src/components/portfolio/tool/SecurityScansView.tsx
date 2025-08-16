"use client";

import { useEffect, useState } from "react";
import ReportsSection from "@/components/portfolio/profile/sections/ReportsSection";
import type { IscanReports } from "@/interfaces/user.interface";
import { fetchUserPortfolio } from "@/services/portfolio.service";

export default function SecurityScansView({ initialReports }: { initialReports?: IscanReports[] }) {
  const [reports, setReports] = useState<IscanReports[] | null>(initialReports ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // If we already have SSR-provided reports, don't refetch.
    if (initialReports && initialReports.length >= 0) return () => { mounted = false; };

    (async () => {
      try {
        const data = await fetchUserPortfolio({ cache: "no-store" });
        if (!mounted) return;
        setReports(data.scanReports ?? []);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load reports");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialReports]);

  if (error) return null;
  if (!reports?.length) return null;
  return <ReportsSection reports={reports} />;
}
