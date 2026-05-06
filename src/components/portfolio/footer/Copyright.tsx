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
      className="fixed left-0 bottom-0 z-20 max-w-[calc(100vw-6.75rem)] rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[0.68rem] leading-relaxed tracking-[0.02em] text-white/70 backdrop-blur-md select-none pointer-events-none sm:left-4 sm:bottom-4 sm:max-w-none sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[10px] md:text-xs"
      style={{
        left: "max(1rem, calc(var(--safe-left) + 0.75rem))",
        bottom: "max(1rem, calc(var(--safe-bottom) + 0.75rem))",
        maxWidth: "calc(100vw - 7rem - var(--safe-left) - var(--safe-right))",
      }}
      aria-label="Site copyright"
    >
      {text ? `\u00A9 ${new Date().getFullYear()} ${text}` : ""}
    </div>
  );
}
