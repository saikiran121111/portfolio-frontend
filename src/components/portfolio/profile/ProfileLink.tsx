"use client";

import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";

interface ProfileLinkProps {
  className?: string; // extra classes for the <a>
  // alignment like Logo
  v?: "top" | "center" | "bottom";
  h?: "left" | "center" | "right";
  // offset variables (px)
  xsOffsetX?: number; // ≤346px
  xsOffsetY?: number; // ≤346px
  offsetX?: number; // base/mobile
  offsetY?: number;
  tabletOffsetX?: number; // md ≥ 768
  tabletOffsetY?: number;
  desktopOffsetX?: number; // lg ≥ 1024
  desktopOffsetY?: number;
  xlOffsetX?: number; // xl ≥ 1280
  xlOffsetY?: number;
  // min-left clamps like Logo (only applied when h === "left")
  minLeftPx?: number; // default 50
  xsMinLeftPx?: number; // ≤346px
  tabletMinLeftPx?: number; // md ≥ 768
  desktopMinLeftPx?: number; // lg ≥ 1024
  xlMinLeftPx?: number; // xl ≥ 1280
  // optionally gate with homepage intro animation
  introGate?: boolean;
  // visual sizing theming (overrides CSS defaults)
  sizePx?: number; // circle diameter, default 72
  expandedPx?: number; // width on hover, default 220
  // global scaler to resize the whole control (circle + expanded width)
  scale?: number; // default 1
  // optional icon override (SVG size only)
  iconSizePx?: number;
}

type ProfVars = Record<
  | "--profile-x-xs"
  | "--profile-y-xs"
  | "--profile-x"
  | "--profile-y"
  | "--profile-x-md"
  | "--profile-y-md"
  | "--profile-x-lg"
  | "--profile-y-lg"
  | "--profile-x-xl"
  | "--profile-y-xl"
  | "--min-left-xs"
  | "--min-left"
  | "--min-left-md"
  | "--min-left-lg"
  | "--min-left-xl"
  | "--pf-size"
  | "--pf-expanded",
  string
>;

export function ProfileLink({
  className,
  // default to bottom-right per request
  v = "bottom",
  h = "right",
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
  sizePx = 72,
  expandedPx = 220,
  scale = 1,
  iconSizePx,
}: ProfileLinkProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const { triggerTransition, state } = usePageTransition();

  const alignY = v === "top" ? "items-start" : v === "bottom" ? "items-end" : "items-center";
  const alignX = h === "left" ? "justify-start" : h === "right" ? "justify-end" : "justify-center";

  const computedSize = Math.round(sizePx * scale);
  const computedExpanded = Math.round(expandedPx * scale);
  const computedIcon = iconSizePx ?? Math.round(28 * scale);

  const styleVars: CSSProperties & ProfVars = {
    "--profile-x-xs": `${xsOffsetX ?? offsetX}px`,
    "--profile-y-xs": `${xsOffsetY ?? offsetY}px`,
    "--profile-x": `${offsetX}px`,
    "--profile-y": `${offsetY}px`,
    "--profile-x-md": `${tabletOffsetX ?? offsetX}px`,
    "--profile-y-md": `${tabletOffsetY ?? offsetY}px`,
    "--profile-x-lg": `${desktopOffsetX ?? tabletOffsetX ?? offsetX}px`,
    "--profile-y-lg": `${desktopOffsetY ?? tabletOffsetY ?? offsetY}px`,
    "--profile-x-xl": `${xlOffsetX ?? desktopOffsetX ?? tabletOffsetX ?? offsetX}px`,
    "--profile-y-xl": `${xlOffsetY ?? desktopOffsetY ?? tabletOffsetY ?? offsetY}px`,

    "--min-left-xs": `${xsMinLeftPx ?? minLeftPx}px`,
    "--min-left": `${minLeftPx}px`,
    "--min-left-md": `${tabletMinLeftPx ?? minLeftPx}px`,
    "--min-left-lg": `${desktopMinLeftPx ?? tabletMinLeftPx ?? minLeftPx}px`,
    "--min-left-xl": `${xlMinLeftPx ?? desktopMinLeftPx ?? tabletMinLeftPx ?? minLeftPx}px`,

    // sizing for the control (scaled)
    "--pf-size": `${computedSize}px`,
    "--pf-expanded": `${computedExpanded}px`,
  };

  // Mirror Logo's clamped negative-x behavior when left-aligned
  const clampLeft = h === "left";
  const translateXClasses = clampLeft
    ? "max-[346px]:!translate-x-[calc(var(--min-left-xs)+max(0px,var(--profile-x-xs)))] translate-x-[calc(var(--min-left)+max(0px,var(--profile-x)))] md:translate-x-[calc(var(--min-left-md)+max(0px,var(--profile-x-md)))] lg:translate-x-[calc(var(--min-left-lg)+max(0px,var(--profile-x-lg)))] xl:translate-x-[calc(var(--min-left-xl)+max(0px,var(--profile-x-xl)))]"
    : "max-[346px]:!translate-x-[var(--profile-x-xs)] translate-x-[var(--profile-x)] md:translate-x-[var(--profile-x-md)] lg:translate-x-[var(--profile-x-lg)] xl:translate-x-[var(--profile-x-xl)]";

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Only trigger custom animation on homepage and when not already transitioning
    if (isHomepage && state === "idle") {
      e.preventDefault();
      triggerTransition("/profile", { x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div className={`${introGate ? "intro-gate" : ""} flex h-full w-full ${alignY} ${alignX}`.trim()}>
      <div
        className={`profile-transform ${translateXClasses} max-[346px]:!translate-y-[var(--profile-y-xs)] translate-y-[var(--profile-y)] md:translate-y-[var(--profile-y-md)] lg:translate-y-[var(--profile-y-lg)] xl:translate-y-[var(--profile-y-xl)]`}
        style={styleVars}
      >
        <Link
          href="/profile"
          className={`profile-link pointer-events-auto ${className ?? ""}`.trim()}
          aria-label="Open profile"
          onClick={handleClick}
        >
          <span className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width={computedIcon} height={computedIcon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" role="img" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 17.5c-1.2-1.3-2.6-2-4-2s-2.8.7-4 2" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className="label">PROFILE</span>
        </Link>
      </div>
    </div>
  );
}

export default ProfileLink;
