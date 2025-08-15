"use client";

import { useEffect, useState } from "react";
import { fetchUserPortfolio } from "@/services/portfolio.service";

export default function Copyright() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await fetchUserPortfolio({ cache: "no-store" });
        if (mounted) setText(p.copyrights ?? "");
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="fixed left-4 bottom-4 z-20 text-[10px] md:text-xs text-white/60 tracking-wide select-none pointer-events-none"
      aria-label="Site copyright"
    >
      {text ? `© ${new Date().getFullYear()} ${text}` : ""}
    </div>
  );
}
