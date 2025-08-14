import { fetchUserPortfolio } from "@/services/portfolio.service";

interface PortfolioNameProps {
  className?: string;
  // vertical: top | center | bottom
  v?: "top" | "center" | "bottom";
  // horizontal: left | center | right
  h?: "left" | "center" | "right";
  // pixel offsets applied via translate (mobile/default)
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
}

export async function PortfolioName({
  className,
  v = "center",
  h = "center",
  offsetX = 0,
  offsetY = 0,
  tabletOffsetX,
  tabletOffsetY,
  desktopOffsetX,
  desktopOffsetY,
  xlOffsetX,
  xlOffsetY,
}: PortfolioNameProps) {
  const { name } = await fetchUserPortfolio();

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

  return (
    <div
      className={`intro-gate flex h-full w-full px-4 ${alignY} ${alignX}`}
    >
      <div
        className="pn-transform translate-x-[var(--pn-x)] translate-y-[var(--pn-y)] md:translate-x-[var(--pn-x-md)] md:translate-y-[var(--pn-y-md)] lg:translate-x-[var(--pn-x-desktop)] lg:translate-y-[var(--pn-y-desktop)] xl:translate-x-[var(--pn-x-xl)] xl:translate-y-[var(--pn-y-xl)]"
        style={
          {
            // Set variables for each breakpoint once; utilities pick the right one per screen size
            ["--pn-x" as any]: `${offsetX}px`,
            ["--pn-y" as any]: `${offsetY}px`,
            ["--pn-x-md" as any]: `${(tabletOffsetX ?? offsetX)}px`,
            ["--pn-y-md" as any]: `${(tabletOffsetY ?? offsetY)}px`,
            ["--pn-x-desktop" as any]: `${(desktopOffsetX ?? tabletOffsetX ?? offsetX)}px`,
            ["--pn-y-desktop" as any]: `${(desktopOffsetY ?? tabletOffsetY ?? offsetY)}px`,
            ["--pn-x-xl" as any]: `${(xlOffsetX ?? desktopOffsetX ?? tabletOffsetX ?? offsetX)}px`,
            ["--pn-y-xl" as any]: `${(xlOffsetY ?? desktopOffsetY ?? tabletOffsetY ?? offsetY)}px`,
          } as any
        }
      >
        <h1
          className={`text-center text-xl font-bold tracking-tight md:text-2xl lg:text-3xl xl:text-3xl md:leading-tight ${
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
