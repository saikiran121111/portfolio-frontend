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
  const sourceItems = useMemo(() => items ?? apiItems ?? [], [items, apiItems]);
  const longestItem = useMemo(
    () =>
      sourceItems.reduce(
        (longest, item) => (item.length > longest.length ? item : longest),
        "",
      ),
    [sourceItems],
  );

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
  const [phase, setPhase] = useState<"entering" | "holding" | "exiting">("entering");
  const timeoutRef = useRef<number | null>(null);

  // Clear any pending timeout on unmount
  useEffect(() => {
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, []);

  const currentText = sourceItems.length ? sourceItems[index % sourceItems.length] : "";
  const enterDuration = Math.max(420, Math.min(960, currentText.length * typingSpeed * 0.8));
  const exitDuration = Math.max(220, Math.min(620, currentText.length * deleteSpeed * 0.7));

  // Drive the rotating text lifecycle with fixed layout footprint.
  useEffect(() => {
    if (!sourceItems.length) return;

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    if (phase === "entering") {
      timeoutRef.current = window.setTimeout(() => setPhase("holding"), enterDuration);
    } else if (phase === "holding") {
      timeoutRef.current = window.setTimeout(() => setPhase("exiting"), displayDuration);
    } else if (phase === "exiting") {
      timeoutRef.current = window.setTimeout(() => {
        const next = index + 1;
        if (!loop && next >= sourceItems.length) {
          setPhase("holding");
          return;
        }
        setIndex(next % sourceItems.length);
        setPhase("entering");
      }, exitDuration);
    }

    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, [
    sourceItems,
    currentText.length,
    phase,
    displayDuration,
    enterDuration,
    exitDuration,
    index,
    loop,
  ]);

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
        <div className={`bottom-headline-shell relative inline-grid max-w-full text-center text-sm md:text-base lg:text-lg xl:text-xl ${className ?? ""}`.trim()}>
          <span aria-hidden className="invisible block whitespace-pre-line">
            {longestItem || "\u00A0"}
          </span>
          <span
            key={`${index}-${phase}`}
            className={`bottom-headline-live pointer-events-none absolute inset-0 block whitespace-pre-line ${
              phase === "entering"
                ? "bottom-headline-enter"
                : phase === "exiting"
                  ? "bottom-headline-exit"
                  : "bottom-headline-hold"
            }`}
          >
            {currentText}
            {showCursor && (
              <span
                className="bottom-headline-cursor ml-1 inline-block align-middle"
                style={{ height: "1em" }}
              />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
