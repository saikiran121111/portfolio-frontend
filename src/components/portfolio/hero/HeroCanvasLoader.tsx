"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroSignalCanvas = dynamic(() => import("./HeroSignalCanvas"), {
  ssr: false,
});

export default function HeroCanvasLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || window.innerWidth <= 560) return;

    const timeout = window.setTimeout(() => setReady(true), 180);
    return () => window.clearTimeout(timeout);
  }, []);

  return ready ? <HeroSignalCanvas /> : null;
}
