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
  | "--logo-y-xl",
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
  };

  return (
    <div className={`intro-gate flex h-full w-full px-4 ${alignY} ${alignX}`}>
      <Link href="/" className="pointer-events-auto">
        <div
          className="logo-transform max-[346px]:!translate-x-[var(--logo-x-xs)] max-[346px]:!translate-y-[var(--logo-y-xs)] translate-x-[var(--logo-x)] translate-y-[var(--logo-y)] md:translate-x-[var(--logo-x-md)] md:translate-y-[var(--logo-y-md)] lg:translate-x-[var(--logo-x-lg)] lg:translate-y-[var(--logo-y-lg)] xl:translate-x-[var(--logo-x-xl)] xl:translate-y-[var(--logo-y-xl)]"
          style={styleVars}
        >
          <svg
            className={`sk-logo text-white hover:text-cyan-400 transition-colors ease-out duration-200 hover:-translate-y-px hover:[filter:drop-shadow(0_0_8px_currentColor)] ${className ?? ""}`.trim()}
            style={{ width: size, height: size }}
            viewBox="0 0 500 500"
            aria-label="SK logo"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Filled S and sword-based K, using currentColor */}
            <path fill="currentColor" d="M140 50c40-40 150-40 190 0-50 0-90 10-115 30-40 30-40 90 40 110 120 30 160 90 90 150-50 40-150 50-200 0 60 10 110-10 130-40 30-50-10-80-60-100-90-40-110-110-35-150z" />
            <path fill="currentColor" d="M330 20 l15 20 l15 -20 v50 l-5 5 v300 l5 5 v50 l-15 -20 l-15 20 v-50 l5 -5 v-300 l-5 -5 z" />
            <path fill="currentColor" d="M355 260 l145 -180 h60 l-150 200 160 220h-65L355 270z" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

export default Logo;
