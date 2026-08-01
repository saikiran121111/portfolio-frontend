import { LogoMark } from "@/components/portfolio/logo/Logo";

export default function LoadingMark({ className = "" }: { className?: string }) {
  return (
    <span className={`loading-mark ${className}`.trim()} aria-hidden="true">
      <LogoMark className="loading-mark-logo loading-mark-logo-base" size={68} decorative />
      <span className="loading-mark-shine">
        <LogoMark className="loading-mark-logo loading-mark-logo-highlight" size={68} decorative />
      </span>
    </span>
  );
}
