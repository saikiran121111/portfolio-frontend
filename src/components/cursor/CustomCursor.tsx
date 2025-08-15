"use client";
import { useCallback, useEffect, useRef } from "react";

// Helper outside component to keep a stable reference and avoid re-creating per render
const setTransform = (el: HTMLDivElement | null, x: number, y: number, size: number) => {
  if (!el) return;
  const half = size / 2;
  const dpr = window.devicePixelRatio || 1;
  // Pixel-snapped translate for crisp edges
  const tx = Math.round((x - half) * dpr) / dpr;
  const ty = Math.round((y - half) * dpr) / dpr;
  el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
};

type Props = {
  baseSize?: number; // big ball diameter (px)
  expandPadding?: number; // unused (kept for backwards compat)
  ease?: number; // big ball lerp factor 0..1
  zIndexClassName?: string; // unused in new approach, kept for compat
  interactiveSelector?: string; // selector for hoverables
  smallSize?: number; // small ball diameter (px)
  smallEase?: number; // small ball lerp factor 0..1
  hoverScale?: number; // scale for big ball on hover
};

const DEFAULT_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  ".sk-logo",
  "[data-cursor-expand]",
  ".hoverable",
].join(",");

const LOGO_SELECTOR = ".sk-logo";

export default function CustomCursor(props: Props) {
  const {
    baseSize = 30,
    expandPadding = 8, // kept for compat
    ease = 0.2, // big ball ease
    zIndexClassName = "z-[9999]", // kept for compat
    interactiveSelector = DEFAULT_SELECTOR,
    smallSize = 10,
    smallEase = 0.5,
    hoverScale = 4,
  } = props;
  // explicitly reference unused props to satisfy eslint without altering behavior
  void expandPadding;
  void zIndexClassName;

  const bigRef = useRef<HTMLDivElement | null>(null);
  const smallRef = useRef<HTMLDivElement | null>(null);

  // positions
  const target = useRef({ x: 0, y: 0 });
  const bigPos = useRef({ x: 0, y: 0 });
  const smallPos = useRef({ x: 0, y: 0 });

  // scales (logical)
  const bigScale = useRef(1);
  const bigScaleTarget = useRef(1);

  // cached diameters to keep DOM updates minimal
  const bigDiameterApplied = useRef(baseSize);
  const smallDiameterRef = useRef(smallSize);

  // state
  const rafRef = useRef<number | null>(null);

  // Memoized animation loop; depends on core numeric props only
  const animate = useCallback(() => {
    // Lerp positions
    bigPos.current.x += (target.current.x - bigPos.current.x) * ease;
    bigPos.current.y += (target.current.y - bigPos.current.y) * ease;

    smallPos.current.x += (target.current.x - smallPos.current.x) * smallEase;
    smallPos.current.y += (target.current.y - smallPos.current.y) * smallEase;

    // Lerp scale (logical)
    bigScale.current += (bigScaleTarget.current - bigScale.current) * Math.min(1, ease * 1.25);

    // Convert scale into an even integer diameter to avoid half-pixel radii
    const desired = baseSize * bigScale.current;
    const bigDiameter = Math.max(2, 2 * Math.round(desired / 2)); // quantize to even px

    // Update element size only when it changes
    if (bigRef.current && bigDiameterApplied.current !== bigDiameter) {
      bigRef.current.style.width = `${bigDiameter}px`;
      bigRef.current.style.height = `${bigDiameter}px`;
      bigDiameterApplied.current = bigDiameter;
    }

    setTransform(bigRef.current, bigPos.current.x, bigPos.current.y, bigDiameter);
    setTransform(smallRef.current, smallPos.current.x, smallPos.current.y, smallDiameterRef.current);

    rafRef.current = requestAnimationFrame(animate);
  }, [baseSize, ease, smallEase]);

  useEffect(() => {
    // Skip on touch-only devices
    const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    // Quantize initial diameters to even integers for crisp edges
    const initialBigDiameter = Math.max(2, 2 * Math.round(baseSize / 2));
    const initialSmallDiameter = Math.max(2, 2 * Math.round(smallSize / 2));
    smallDiameterRef.current = initialSmallDiameter;
    bigDiameterApplied.current = initialBigDiameter;

    // Create big ball
    const big = document.createElement("div");
    big.setAttribute("aria-hidden", "true");
    big.className = `pointer-events-none fixed left-0 top-0 rounded-full`;
    big.style.width = `${initialBigDiameter}px`;
    big.style.height = `${initialBigDiameter}px`;
    big.style.borderRadius = "50%";
    big.style.background = "#f7f8fa"; // solid light
    big.style.mixBlendMode = "difference"; // high contrast
    big.style.zIndex = "2147483647";
    big.style.willChange = "transform, width, height";
    big.style.backfaceVisibility = "hidden";
    big.style.contain = "layout paint style";
    // Slightly promote to its own layer for stability
    big.style.transform = "translate3d(0,0,0)";

    // Create small ball
    const small = document.createElement("div");
    small.setAttribute("aria-hidden", "true");
    small.className = `pointer-events-none fixed left-0 top-0 rounded-full`;
    small.style.width = `${initialSmallDiameter}px`;
    small.style.height = `${initialSmallDiameter}px`;
    small.style.borderRadius = "50%";
    small.style.background = "#f7f8fa";
    small.style.mixBlendMode = "difference";
    small.style.zIndex = "2147483647";
    small.style.willChange = "transform";
    small.style.backfaceVisibility = "hidden";
    small.style.contain = "layout paint style";
    small.style.transform = "translate3d(0,0,0)";

    document.body.appendChild(big);
    document.body.appendChild(small);
    bigRef.current = big;
    smallRef.current = small;

    // Init at center
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    target.current = { x: cx, y: cy };
    bigPos.current = { x: cx, y: cy };
    smallPos.current = { x: cx, y: cy };
    bigScale.current = 1;
    bigScaleTarget.current = 1;
    setTransform(big, cx, cy, initialBigDiameter);
    setTransform(small, cx, cy, initialSmallDiameter);

    const supportsPointer = typeof window !== "undefined" && ("onpointermove" in window);

    const onMove = (e: PointerEvent | MouseEvent) => {
      const x = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
      const y = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
      target.current.x = x;
      target.current.y = y;

      const t = document.elementFromPoint(x, y);
      const hoverable = t && (t instanceof Element) ? t.closest(interactiveSelector) : null;
      bigScaleTarget.current = hoverable ? hoverScale : 1;

      // If hovering logo, drop behind it to avoid visual obstruction
      const overLogo = t && (t instanceof Element) ? !!t.closest(LOGO_SELECTOR) : false;
      const zi = overLogo ? "1" : "2147483647";
      if (bigRef.current) bigRef.current.style.zIndex = zi;
      if (smallRef.current) smallRef.current.style.zIndex = zi;
    };

    const onLeave = () => {
      bigScaleTarget.current = 1;
      // Restore z-index to top when pointer leaves window
      if (bigRef.current) bigRef.current.style.zIndex = "2147483647";
      if (smallRef.current) smallRef.current.style.zIndex = "2147483647";
    };

    if (supportsPointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave as EventListener, { passive: true });
    } else {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave as EventListener, { passive: true });
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (supportsPointer) {
        window.removeEventListener("pointermove", onMove as EventListener);
        window.removeEventListener("pointerleave", onLeave as EventListener);
      } else {
        window.removeEventListener("mousemove", onMove as EventListener);
        window.removeEventListener("mouseleave", onLeave as EventListener);
      }
      big.remove();
      small.remove();
      bigRef.current = null;
      smallRef.current = null;
    };
  }, [baseSize, smallSize, ease, smallEase, hoverScale, interactiveSelector, animate]);

  return null;
}
