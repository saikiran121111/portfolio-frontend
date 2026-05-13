"use client";

import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";

interface LogoProps {
  className?: string; // applied to the <svg> for color/hover control
  size?: number; // px. default 112
  xsSize?: number; // ≤346px
  tabletSize?: number; // md ≥ 768
  desktopSize?: number; // lg ≥ 1024
  xlSize?: number; // xl ≥ 1280
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
  /** Enable entrance animation. Default true. */
  animate?: boolean;
  /** Enable the mobile glass shell around the logo. Default true (homepage). */
  mobileShell?: boolean;
  /** Render the dark logo background from the source artwork. Default false. */
  showBackground?: boolean;
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
  | "--logo-size-xs"
  | "--logo-size"
  | "--logo-size-md"
  | "--logo-size-lg"
  | "--logo-size-xl"
  | "--min-left-xs"
  | "--min-left"
  | "--min-left-md"
  | "--min-left-lg"
  | "--min-left-xl",
  string
>;

const LOGO_VIEW_BOX = "43 27 389 389";

export function Logo({
  className,
  size = 112,
  xsSize,
  tabletSize,
  desktopSize,
  xlSize,
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
  animate = true,
  mobileShell = true,
  showBackground = false,
}: LogoProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const pathname = usePathname();
  const { triggerTransition, state } = usePageTransition();

  useEffect(() => {
    // Trigger animation on mount with a small delay for smooth entry
    if (animate) {
      const timer = setTimeout(() => setShouldAnimate(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  // Handle logo click with page transition animation (only when not on homepage)
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" && state === "idle") {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      triggerTransition("/", { x, y });
    }
    // On homepage, let normal Link behavior work
  };

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
    "--logo-size-xs": `${xsSize ?? size}px`,
    "--logo-size": `${size}px`,
    "--logo-size-md": `${tabletSize ?? size}px`,
    "--logo-size-lg": `${desktopSize ?? tabletSize ?? size}px`,
    "--logo-size-xl": `${xlSize ?? desktopSize ?? tabletSize ?? size}px`,
    // per-breakpoint min-lefts with sensible fallback chains
    "--min-left-xs": `${xsMinLeftPx ?? minLeftPx}px`,
    "--min-left": `${minLeftPx}px`,
    "--min-left-md": `${tabletMinLeftPx ?? minLeftPx}px`,
    "--min-left-lg": `${desktopMinLeftPx ?? tabletMinLeftPx ?? minLeftPx}px`,
    "--min-left-xl": `${xlMinLeftPx ?? desktopMinLeftPx ?? tabletMinLeftPx ?? minLeftPx}px`,
  };

  // Clamp negative X only when left-aligned by adding the min-left gap and preventing negative shifts
  const clampLeft = h === "left";
  const safeAreaPadding: CSSProperties = {
    paddingTop: v === "top" ? "var(--safe-top)" : undefined,
    paddingRight: h === "right" ? "var(--safe-right)" : undefined,
    paddingBottom: v === "bottom" ? "var(--safe-bottom)" : undefined,
    paddingLeft: h === "left" ? "var(--safe-left)" : undefined,
  };

  const translateXClasses = clampLeft
    ? "max-[346px]:!translate-x-[calc(var(--min-left-xs)+max(0px,var(--logo-x-xs)))] translate-x-[calc(var(--min-left)+max(0px,var(--logo-x)))] md:translate-x-[calc(var(--min-left-md)+max(0px,var(--logo-x-md)))] lg:translate-x-[calc(var(--min-left-lg)+max(0px,var(--logo-x-lg)))] xl:translate-x-[calc(var(--min-left-xl)+max(0px,var(--logo-x-xl)))]"
    : "max-[346px]:!translate-x-[var(--logo-x-xs)] translate-x-[var(--logo-x)] md:translate-x-[var(--logo-x-md)] lg:translate-x-[var(--logo-x-lg)] xl:translate-x-[var(--logo-x-xl)]";

  const animationClass = shouldAnimate ? "sk-logo-animate" : "";
  const sizeClasses = "max-[346px]:!h-[var(--logo-size-xs)] max-[346px]:!w-[var(--logo-size-xs)] h-[var(--logo-size)] w-[var(--logo-size)] md:h-[var(--logo-size-md)] md:w-[var(--logo-size-md)] lg:h-[var(--logo-size-lg)] lg:w-[var(--logo-size-lg)] xl:h-[var(--logo-size-xl)] xl:w-[var(--logo-size-xl)]";
  const renderLogoPaths = ({
    includeBackground = false,
    sFill = "#FFFFFF",
    kFill = "#C29451",
  } = {}) => (
    <>
      {includeBackground && <rect width="512" height="427" fill="#11191C" />}
      <path
        fill={sFill}
        d="M 51 63 L 153 184 L 213 189 L 212 236 L 171 212 L 235 367 L 235 164 L 168 164 L 127 112 L 210 118 L 213 144 L 235 145 L 235 98 Z"
      />
      <g transform="translate(-8 0)">
        <path
          fill={kFill}
          d="M 430 67 L 277 142 L 271 96 L 252 98 L 251 367 L 272 304 L 273 198 L 307 218 L 318 203 L 283 171 Z"
        />
      </g>
    </>
  );

  return (
    <div
      className={`${introGate ? "intro-gate" : ""} flex h-full w-full ${alignY} ${alignX}`.trim()}
      style={safeAreaPadding}
    >
      <Link
        href="/"
        className={`pointer-events-auto logo-link ${mobileShell ? "" : "logo-link--plain"}`.trim()}
        onClick={handleClick}
      >
        <div
          className={`logo-transform ${translateXClasses} max-[346px]:!translate-y-[var(--logo-y-xs)] translate-y-[var(--logo-y)] md:translate-y-[var(--logo-y-md)] lg:translate-y-[var(--logo-y-lg)] xl:translate-y-[var(--logo-y-xl)]`}
          style={styleVars}
        >
          <div className={`relative group cursor-pointer logo-glitch-container ${animationClass}`.trim()}>
            {/* Main logo with enhanced glow */}
            <svg
              className={`sk-logo ${sizeClasses} group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300 relative z-10 ${className ?? ""}`.trim()}
              viewBox={LOGO_VIEW_BOX}
              aria-label="SK Logo"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderLogoPaths({ includeBackground: showBackground })}
            </svg>

            {/* Red glitch layer - offset left */}
            <svg
              className={`${sizeClasses} absolute inset-0 text-red-500 opacity-0 group-hover:opacity-80 transition-opacity duration-150 glitch-red pointer-events-none mix-blend-screen`}
              viewBox={LOGO_VIEW_BOX}
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderLogoPaths({ sFill: "currentColor", kFill: "currentColor" })}
            </svg>

            {/* Blue glitch layer - offset right */}
            <svg
              className={`${sizeClasses} absolute inset-0 text-blue-500 opacity-0 group-hover:opacity-60 transition-opacity duration-200 glitch-blue pointer-events-none mix-blend-screen`}
              viewBox={LOGO_VIEW_BOX}
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderLogoPaths({ sFill: "currentColor", kFill: "currentColor" })}
            </svg>

            {/* Green accent layer for extra glitch */}
            <svg
              className={`${sizeClasses} absolute inset-0 text-green-400 opacity-0 group-hover:opacity-30 transition-opacity duration-100 glitch-green pointer-events-none mix-blend-overlay`}
              viewBox={LOGO_VIEW_BOX}
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderLogoPaths({ sFill: "currentColor", kFill: "currentColor" })}
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
