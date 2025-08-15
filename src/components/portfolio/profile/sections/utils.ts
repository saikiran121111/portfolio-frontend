"use client";
import { Variants } from "framer-motion";

export function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Common easing
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Motion variants
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export function mapSkillLevelToPercent(level: string): number {
  const n = parseInt(level.replace(/[^0-9]/g, ""), 10);
  if (!Number.isNaN(n) && n > 0 && n <= 100) return n;
  const key = level.trim().toLowerCase();
  switch (key) {
    case "novice":
    case "beginner":
      return 25;
    case "junior":
    case "intermediate":
      return 55;
    case "senior":
    case "advanced":
      return 80;
    case "expert":
    case "master":
      return 92;
    default:
      return 65;
  }
}

export function formatDate(d?: Date | null) {
  if (!d) return "Present";
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short" }).format(new Date(d));
  } catch {
    return String(d);
  }
}
