"use client";

import { useEffect, useState } from "react";
import ReportsSection from "@/components/portfolio/profile/sections/ReportsSection";
import type { IscanReports } from "@/interfaces/user.interface";
import { fetchUserPortfolio } from "@/services/portfolio.service";

export default function SecurityScansView() {
  const [reports, setReports] = useState<IscanReports[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
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
  }, []);

  if (error) return null;
  if (!reports?.length) return null;
  return <ReportsSection reports={reports} />;
}
