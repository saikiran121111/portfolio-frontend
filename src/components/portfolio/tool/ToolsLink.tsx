import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import toolIcon from "./tool.png";

interface ToolsLinkProps {
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
  desktopOffsetY?: number; // lg ≥ 1024
  xlOffsetX?: number; // xl ≥ 1280
  xlOffsetY?: number; // xl ≥ 1280
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
  // png icon size only (does not change the circle). If omitted, scales with control.
  iconSizePx?: number;
  // global scaler to resize the whole control (circle + expanded width)
  scale?: number; // default 1
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

export function ToolsLink({
  className,
  // default to top-right per request
  v = "top",
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
  iconSizePx,
  scale = 1,
}: ToolsLinkProps) {
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

  return (
    <div className={`${introGate ? "intro-gate" : ""} flex h-full w-full ${alignY} ${alignX}`.trim()}>
      <div
        className={`profile-transform ${translateXClasses} max-[346px]:!translate-y-[var(--profile-y-xs)] translate-y-[var(--profile-y)] md:translate-y-[var(--profile-y-md)] lg:translate-y-[var(--profile-y-lg)] xl:translate-y-[var(--profile-y-xl)]`}
        style={styleVars}
      >
        <Link href="/tools" className={`profile-link pointer-events-auto ${className ?? ""}`.trim()} aria-label="Open tools">
          <span className="icon" aria-hidden="true" style={{ inlineSize: computedIcon, blockSize: computedIcon }}>
            <Image src={toolIcon} alt="Tools" width={computedIcon} height={computedIcon} />
          </span>
          <span className="label">TOOLS</span>
        </Link>
      </div>
    </div>
  );
}

export default ToolsLink;
