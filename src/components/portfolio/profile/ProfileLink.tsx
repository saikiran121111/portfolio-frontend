import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";

interface ProfileLinkProps {
  className?: string;
  label?: string;
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
  sizePx?: number;
  expandedPx?: number;
  scale?: number;
  iconSizePx?: number;
}

export function ProfileLink({ className, label = "View profile" }: ProfileLinkProps) {
  return (
    <Link href="/profile" className={`button button-secondary ${className ?? ""}`.trim()}>
      <UserRound aria-hidden="true" />
      {label}
      <ArrowUpRight aria-hidden="true" />
    </Link>
  );
}

export default ProfileLink;
