import Link from "next/link";
import type { CSSProperties } from "react";
import { siteContent } from "@/content/site";

interface LogoProps {
  className?: string;
  size?: number;
  xsSize?: number;
  tabletSize?: number;
  desktopSize?: number;
  xlSize?: number;
  v?: "top" | "center" | "bottom";
  h?: "left" | "center" | "right";
  xsOffsetX?: number;
  xsOffsetY?: number;
  offsetX?: number;
  offsetY?: number;
  tabletOffsetX?: number;
  tabletOffsetY?: number;
  desktopOffsetX?: number;
  desktopOffsetY?: number;
  xlOffsetX?: number;
  xlOffsetY?: number;
  minLeftPx?: number;
  xsMinLeftPx?: number;
  tabletMinLeftPx?: number;
  desktopMinLeftPx?: number;
  xlMinLeftPx?: number;
  introGate?: boolean;
  animate?: boolean;
  mobileShell?: boolean;
  showBackground?: boolean;
  ownerName?: string;
}

interface LogoMarkProps {
  className?: string;
  size?: number;
  decorative?: boolean;
}

export function LogoMark({ className, size = 48, decorative = false }: LogoMarkProps) {
  const style = { "--brand-size": `${size}px` } as CSSProperties;

  return (
    <svg
      className={className}
      style={style}
      viewBox="43 27 389 389"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "SK Logo"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="brand-s"
        d="M 51 63 L 153 184 L 213 189 L 212 236 L 171 212 L 235 367 L 235 164 L 168 164 L 127 112 L 210 118 L 213 144 L 235 145 L 235 98 Z"
      />
      <g transform="translate(-8 0)">
        <path
          className="brand-k"
          d="M 430 67 L 277 142 L 271 96 L 252 98 L 251 367 L 272 304 L 273 198 L 307 218 L 318 203 L 283 171 Z"
        />
      </g>
    </svg>
  );
}

export function Logo({ className, size = 48, ownerName }: LogoProps) {
  return (
    <Link href="/" className="brand-link" aria-label={`${ownerName || siteContent.identity.shortName}, home`}>
      <LogoMark className={className} size={size} decorative />
    </Link>
  );
}

export default Logo;
