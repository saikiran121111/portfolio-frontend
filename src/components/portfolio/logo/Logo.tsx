import Link from "next/link";
import type { CSSProperties } from "react";

interface LogoProps {
  className?: string; // applied to the <svg> for color/hover control
  size?: number; // px. default 96
  // positioning like other components
  v?: "top" | "center" | "bottom";
  h?: "left" | "center" | "right";
  // offsets (px)
  xsOffsetX?: number; // ≤346px
  xsOffsetY?: number; // ≤346px
  offsetX?: number;
  offsetY?: number;
  tabletOffsetX?: number; // md ≥ 768
  tabletOffsetY?: number;
  desktopOffsetX?: number; // lg ≥ 1024
  desktopOffsetY?: number;
  xlOffsetX?: number; // xl ≥ 1280
  xlOffsetY?: number;
  /** Base minimum left gap in px (when h === "left"). Default 50 */
  minLeftPx?: number;
  /** Breakpoint-specific minimum left gaps in px */
  xsMinLeftPx?: number; // ≤346px
  tabletMinLeftPx?: number; // md ≥ 768
  desktopMinLeftPx?: number; // lg ≥ 1024
  xlMinLeftPx?: number; // xl ≥ 1280
  /** Apply the intro fade/slide gate. Default true (homepage). Set false on other routes. */
  introGate?: boolean;
}

// Typed CSS custom properties used by this component
type LVars = Record<
  | "--logo-x-xs"
  | "--logo-y-xs"
  | "--logo-x"
  | "--logo-y"
  | "--logo-x-md"
  | "--logo-y-md"
  | "--logo-x-lg"
  | "--logo-y-lg"
  | "--logo-x-xl"
  | "--logo-y-xl"
  | "--min-left-xs"
  | "--min-left"
  | "--min-left-md"
  | "--min-left-lg"
  | "--min-left-xl",
  string
>;

export function Logo({
  className,
  size = 96,
  v = "center",
  h = "center",
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
  minLeftPx = 50,
  xsMinLeftPx,
  tabletMinLeftPx,
  desktopMinLeftPx,
  xlMinLeftPx,
  introGate = true,
}: LogoProps) {
  const alignY = v === "top" ? "items-start" : v === "bottom" ? "items-end" : "items-center";
  const alignX = h === "left" ? "justify-start" : h === "right" ? "justify-end" : "justify-center";

  const styleVars: CSSProperties & LVars = {
    "--logo-x-xs": `${xsOffsetX ?? offsetX}px`,
    "--logo-y-xs": `${xsOffsetY ?? offsetY}px`,
    "--logo-x": `${offsetX}px`,
    "--logo-y": `${offsetY}px`,
    "--logo-x-md": `${tabletOffsetX ?? offsetX}px`,
    "--logo-y-md": `${tabletOffsetY ?? offsetY}px`,
    "--logo-x-lg": `${desktopOffsetX ?? tabletOffsetX ?? offsetX}px`,
    "--logo-y-lg": `${desktopOffsetY ?? tabletOffsetY ?? offsetY}px`,
    "--logo-x-xl": `${xlOffsetX ?? desktopOffsetX ?? tabletOffsetX ?? offsetX}px`,
    "--logo-y-xl": `${xlOffsetY ?? desktopOffsetY ?? tabletOffsetY ?? offsetY}px`,
    // per-breakpoint min-lefts with sensible fallback chains
    "--min-left-xs": `${xsMinLeftPx ?? minLeftPx}px`,
    "--min-left": `${minLeftPx}px`,
    "--min-left-md": `${tabletMinLeftPx ?? minLeftPx}px`,
    "--min-left-lg": `${desktopMinLeftPx ?? tabletMinLeftPx ?? minLeftPx}px`,
    "--min-left-xl": `${xlMinLeftPx ?? desktopMinLeftPx ?? tabletMinLeftPx ?? minLeftPx}px`,
  };

  // Clamp negative X only when left-aligned by adding the min-left gap and preventing negative shifts
  const clampLeft = h === "left";

  const translateXClasses = clampLeft
    ? "max-[346px]:!translate-x-[calc(var(--min-left-xs)+max(0px,var(--logo-x-xs)))] translate-x-[calc(var(--min-left)+max(0px,var(--logo-x)))] md:translate-x-[calc(var(--min-left-md)+max(0px,var(--logo-x-md)))] lg:translate-x-[calc(var(--min-left-lg)+max(0px,var(--logo-x-lg)))] xl:translate-x-[calc(var(--min-left-xl)+max(0px,var(--logo-x-xl)))]"
    : "max-[346px]:!translate-x-[var(--logo-x-xs)] translate-x-[var(--logo-x)] md:translate-x-[var(--logo-x-md)] lg:translate-x-[var(--logo-x-lg)] xl:translate-x-[var(--logo-x-xl)]";

  return (
    <div className={`${introGate ? "intro-gate" : ""} flex h-full w-full ${alignY} ${alignX}`.trim()}>
      <Link href="/" className="pointer-events-auto">
        <div
          className={`logo-transform ${translateXClasses} max-[346px]:!translate-y-[var(--logo-y-xs)] translate-y-[var(--logo-y)] md:translate-y-[var(--logo-y-md)] lg:translate-y-[var(--logo-y-lg)] xl:translate-y-[var(--logo-y-xl)]`}
          style={styleVars}
        >
          <div className="relative group cursor-pointer logo-glitch-container">
            {/* Main logo with enhanced glow */}
            <svg
              className={`sk-logo text-white group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300 relative z-10 ${className ?? ""}`.trim()}
              style={{ width: size, height: size }}
              viewBox="0 0 500 500"
              aria-label="SK logo"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="currentColor" d="M140 50c40-40 150-40 190 0-50 0-90 10-115 30-40 30-40 90 40 110 120 30 160 90 90 150-50 40-150 50-200 0 60 10 110-10 130-40 30-50-10-80-60-100-90-40-110-110-35-150z" />
              <path fill="currentColor" d="M330 20 l15 20 l15 -20 v50 l-5 5 v300 l5 5 v50 l-15 -20 l-15 20 v-50 l5 -5 v-300 l-5 -5 z" />
              <path fill="currentColor" d="M355 260 l145 -180 h60 l-150 200 160 220h-65L355 270z" />
            </svg>
            
            {/* Red glitch layer - offset left */}
            <svg
              className="absolute inset-0 text-red-500 opacity-0 group-hover:opacity-80 transition-opacity duration-150 glitch-red pointer-events-none mix-blend-screen"
              style={{ width: size, height: size }}
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="currentColor" d="M140 50c40-40 150-40 190 0-50 0-90 10-115 30-40 30-40 90 40 110 120 30 160 90 90 150-50 40-150 50-200 0 60 10 110-10 130-40 30-50-10-80-60-100-90-40-110-110-35-150z" />
              <path fill="currentColor" d="M330 20 l15 20 l15 -20 v50 l-5 5 v300 l5 5 v50 l-15 -20 l-15 20 v-50 l5 -5 v-300 l-5 -5 z" />
              <path fill="currentColor" d="M355 260 l145 -180 h60 l-150 200 160 220h-65L355 270z" />
            </svg>
            
            {/* Blue glitch layer - offset right */}
            <svg
              className="absolute inset-0 text-blue-500 opacity-0 group-hover:opacity-60 transition-opacity duration-200 glitch-blue pointer-events-none mix-blend-screen"
              style={{ width: size, height: size }}
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="currentColor" d="M140 50c40-40 150-40 190 0-50 0-90 10-115 30-40 30-40 90 40 110 120 30 160 90 90 150-50 40-150 50-200 0 60 10 110-10 130-40 30-50-10-80-60-100-90-40-110-110-35-150z" />
              <path fill="currentColor" d="M330 20 l15 20 l15 -20 v50 l-5 5 v300 l5 5 v50 l-15 -20 l-15 20 v-50 l5 -5 v-300 l-5 -5 z" />
              <path fill="currentColor" d="M355 260 l145 -180 h60 l-150 200 160 220h-65L355 270z" />
            </svg>
            
            {/* Green accent layer for extra glitch */}
            <svg
              className="absolute inset-0 text-green-400 opacity-0 group-hover:opacity-30 transition-opacity duration-100 glitch-green pointer-events-none mix-blend-overlay"
              style={{ width: size, height: size }}
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="currentColor" d="M140 50c40-40 150-40 190 0-50 0-90 10-115 30-40 30-40 90 40 110 120 30 160 90 90 150-50 40-150 50-200 0 60 10 110-10 130-40 30-50-10-80-60-100-90-40-110-110-35-150z" />
              <path fill="currentColor" d="M330 20 l15 20 l15 -20 v50 l-5 5 v300 l5 5 v50 l-15 -20 l-15 20 v-50 l5 -5 v-300 l-5 -5 z" />
              <path fill="currentColor" d="M355 260 l145 -180 h60 l-150 200 160 220h-65L355 270z" />
            </svg>
            
            {/* Scanline effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none scanlines"></div>
            
            {/* Static noise overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-100 pointer-events-none noise-overlay"></div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Logo;
