import { fetchUserPortfolio } from "@/services/portfolio.service";
import type { CSSProperties } from "react";

interface PortfolioNameProps {
  className?: string;
  // vertical: top | center | bottom
  v?: "top" | "center" | "bottom";
  // horizontal: left | center | right
  h?: "left" | "center" | "right";
  // pixel offsets applied via translate (mobile/default)
  // new extra-small breakpoint (≤346px)
  xsOffsetX?: number; // ≤ 346px
  xsOffsetY?: number; // ≤ 346px
  offsetX?: number;
  offsetY?: number;
  // optional overrides per breakpoint
  tabletOffsetX?: number; // md ≥ 768px
  tabletOffsetY?: number;
  desktopOffsetX?: number; // desktop ≥ 1024px (alias of lg)
  desktopOffsetY?: number; // desktop ≥ 1024px (alias of lg)
  // xl ≥ 1280px
  xlOffsetX?: number;
  xlOffsetY?: number;
  // optional text shown above the name; falls back to API headline
  portfolioText?: string;
}

// Strongly-typed CSS custom properties used by this component
type PNVars = Record<
  | "--pn-x-xs"
  | "--pn-y-xs"
  | "--pn-x"
  | "--pn-y"
  | "--pn-x-md"
  | "--pn-y-md"
  | "--pn-x-desktop"
  | "--pn-y-desktop"
  | "--pn-x-xl"
  | "--pn-y-xl",
  string
>;

export async function PortfolioName({
  className,
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
  portfolioText,
}: PortfolioNameProps) {
  const { name, headline } = await fetchUserPortfolio();

  const alignY =
    v === "top"
      ? "items-start"
      : v === "bottom"
      ? "items-end"
      : "items-center";
  const alignX =
    h === "left"
      ? "justify-start"
      : h === "right"
      ? "justify-end"
      : "justify-center";

  const aboveText = portfolioText ?? headline;

  // Build typed CSS variables for offsets per breakpoint
  const styleVars: CSSProperties & PNVars = {
    "--pn-x-xs": `${(xsOffsetX ?? offsetX)}px`,
    "--pn-y-xs": `${(xsOffsetY ?? offsetY)}px`,
    "--pn-x": `${offsetX}px`,
    "--pn-y": `${offsetY}px`,
    "--pn-x-md": `${(tabletOffsetX ?? offsetX)}px`,
    "--pn-y-md": `${(tabletOffsetY ?? offsetY)}px`,
    "--pn-x-desktop": `${(desktopOffsetX ?? tabletOffsetX ?? offsetX)}px`,
    "--pn-y-desktop": `${(desktopOffsetY ?? tabletOffsetY ?? offsetY)}px`,
    "--pn-x-xl": `${(xlOffsetX ?? desktopOffsetX ?? tabletOffsetX ?? offsetX)}px`,
    "--pn-y-xl": `${(xlOffsetY ?? desktopOffsetY ?? tabletOffsetY ?? offsetY)}px`,
  };

  return (
    <div
      className={`intro-gate flex h-full w-full px-4 ${alignY} ${alignX}`}
    >
      <div
        className="pn-transform max-[346px]:!translate-x-[var(--pn-x-xs)] max-[346px]:!translate-y-[var(--pn-y-xs)] translate-x-[var(--pn-x)] translate-y-[var(--pn-y)] md:translate-x-[var(--pn-x-md)] md:translate-y-[var(--pn-y-md)] lg:translate-x-[var(--pn-x-desktop)] lg:translate-y-[var(--pn-y-desktop)] xl:translate-x-[var(--pn-x-xl)] xl:translate-y-[var(--pn-y-xl)]"
        style={styleVars}
      >
        {aboveText && (
          <p className="mb-1 text-center text-[15px] md:text-[20px] lg:text-[22px] xl:text-[22px] font-medium tracking-wide uppercase opacity-80">
            {aboveText}
          </p>
        )}
        <h1
          className={`font-saol text-center text-xl font-bold tracking-tight md:text-2xl lg:text-3xl xl:text-3xl md:leading-tight ${
            className ?? ""
          }`.trim()}
        >
          {name}
        </h1>
      </div>
      {/* removed styled-jsx to keep this a Server Component */}
    </div>
  );
}
