"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { fetchUserPortfolio } from "@/services/portfolio.service";

interface BottomHeadlineProps {
  className?: string;
  // positioning similar to PortfolioName
  v?: "top" | "center" | "bottom";
  h?: "left" | "center" | "right";
  // offsets (px)
  // new extra-small breakpoint (≤346px)
  xsOffsetX?: number; // ≤ 346px
  xsOffsetY?: number; // ≤ 346px
  offsetX?: number;
  offsetY?: number;
  tabletOffsetX?: number; // md ≥ 768px
  tabletOffsetY?: number;
  desktopOffsetX?: number; // lg ≥ 1024px
  desktopOffsetY?: number;
  xlOffsetX?: number; // xl ≥ 1280px
  xlOffsetY?: number;
  // text/animation
  items?: string[]; // if not provided, pulls from API bottomHeadline
  typingSpeed?: number; // ms per character
  deleteSpeed?: number; // ms per character
  displayDuration?: number; // ms to keep full text before deleting
  loop?: boolean;
  showCursor?: boolean;
}

// Strongly-typed CSS custom properties used by this component
type BHVars = Record<
  | "--bh-x-xs"
  | "--bh-y-xs"
  | "--bh-x"
  | "--bh-y"
  | "--bh-x-md"
  | "--bh-y-md"
  | "--bh-x-lg"
  | "--bh-y-lg"
  | "--bh-x-xl"
  | "--bh-y-xl",
  string
>;

export default function BottomHeadline({
  className,
  v = "center",
  h = "center",
  // new ≤346px offsets
  xsOffsetX,
  xsOffsetY,
  offsetX = 0,
  offsetY = 0,
  tabletOffsetX,
  tabletOffsetY,
  desktopOffsetX,
  desktopOffsetY,
  xlOffsetX,
  xlOffsetY,
  items,
  typingSpeed = 80,
  deleteSpeed = 40,
  displayDuration = 3000,
  loop = true,
  showCursor = true,
}: BottomHeadlineProps) {
  const [apiItems, setApiItems] = useState<string[] | null>(null);
  const sourceItems = items ?? apiItems ?? [];

  // Fetch from API if items not provided
  useEffect(() => {
    if (items) return;
    let mounted = true;
    (async () => {
      try {
        const p = await fetchUserPortfolio({ cache: "no-store" });
        if (!mounted) return;
        const arr = p.bottomHeadline; // use typed IPortfolio instead of any cast
        setApiItems(Array.isArray(arr) ? arr.filter(Boolean) : []);
      } catch {
        setApiItems([]);
      }
    })();
    return () => { mounted = false; };
  }, [items]);

  const alignY = v === "top" ? "items-start" : v === "bottom" ? "items-end" : "items-center";
  const alignX = h === "left" ? "justify-start" : h === "right" ? "justify-end" : "justify-center";

  // Typing state
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const timeoutRef = useRef<number | null>(null);

  // Clear any pending timeout on unmount
  useEffect(() => {
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, []);

  const currentText = sourceItems.length ? sourceItems[index % sourceItems.length] : "";
  const displayed = useMemo(() => currentText.slice(0, subIndex), [currentText, subIndex]);

  // Drive the typing/deleting lifecycle
  useEffect(() => {
    if (!sourceItems.length) return;

    // Always clear before scheduling a new one
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    if (phase === "typing") {
      if (subIndex < currentText.length) {
        timeoutRef.current = window.setTimeout(() => setSubIndex(s => s + 1), typingSpeed);
      } else {
        // finished typing: enter pause, schedule deletion in separate phase
        setPhase("pausing");
      }
    } else if (phase === "pausing") {
      timeoutRef.current = window.setTimeout(() => setPhase("deleting"), displayDuration);
    } else if (phase === "deleting") {
      if (subIndex > 0) {
        timeoutRef.current = window.setTimeout(() => setSubIndex(s => s - 1), deleteSpeed);
      } else {
        const next = index + 1;
        if (!loop && next >= sourceItems.length) return; // stop
        setIndex(next % sourceItems.length);
        setPhase("typing");
      }
    }

    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, [sourceItems, currentText, subIndex, phase, typingSpeed, deleteSpeed, displayDuration, index, loop]);

  // Build typed CSS variables for offsets per breakpoint
  const styleVars: CSSProperties & BHVars = {
    "--bh-x-xs": `${(xsOffsetX ?? offsetX)}px`,
    "--bh-y-xs": `${(xsOffsetY ?? offsetY)}px`,
    "--bh-x": `${offsetX}px`,
    "--bh-y": `${offsetY}px`,
    "--bh-x-md": `${(tabletOffsetX ?? offsetX)}px`,
    "--bh-y-md": `${(tabletOffsetY ?? offsetY)}px`,
    "--bh-x-lg": `${(desktopOffsetX ?? tabletOffsetX ?? offsetX)}px`,
    "--bh-y-lg": `${(desktopOffsetY ?? tabletOffsetY ?? offsetY)}px`,
    "--bh-x-xl": `${(xlOffsetX ?? desktopOffsetX ?? tabletOffsetX ?? offsetX)}px`,
    "--bh-y-xl": `${(xlOffsetY ?? desktopOffsetY ?? tabletOffsetY ?? offsetY)}px`,
  };

  return (
    <div className={`intro-gate flex h-full w-full px-4 ${alignY} ${alignX}`}>
      <div
        className="bh-transform max-[346px]:!translate-x-[var(--bh-x-xs)] max-[346px]:!translate-y-[var(--bh-y-xs)] translate-x-[var(--bh-x)] translate-y-[var(--bh-y)] md:translate-x-[var(--bh-x-md)] md:translate-y-[var(--bh-y-md)] lg:translate-x-[var(--bh-x-lg)] lg:translate-y-[var(--bh-y-lg)] xl:translate-x-[var(--bh-x-xl)] xl:translate-y-[var(--bh-y-xl)]"
        style={styleVars}
      >
        <p className={`text-center text-sm md:text-base lg:text-lg xl:text-xl ${className ?? ""}`.trim()}>
          {displayed}
          {showCursor && <span className="ml-0.5 inline-block w-[1px] bg-current align-middle animate-pulse" style={{ height: "1em" }} />}
        </p>
      </div>
    </div>
  );
}
