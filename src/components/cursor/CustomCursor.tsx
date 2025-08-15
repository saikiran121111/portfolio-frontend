"use client";
import { useEffect, useRef } from "react";

type Props = {
  baseSize?: number; // px diameter of the default cursor dot
  expandPadding?: number; // extra px added around target when expanding
  ease?: number; // 0..1 lerp factor
  zIndexClassName?: string; // override stacking
  interactiveSelector?: string; // override selector for expand targets
};

const DEFAULT_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  ".sk-logo",
  "[data-cursor-expand]",
].join(",");

export default function CustomCursor({
  baseSize = 14,
  expandPadding = 8,
  ease = 0.2,
  zIndexClassName = "z-[9999]",
  interactiveSelector = DEFAULT_SELECTOR,
}: Props) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const pos = useRef({ x: 0, y: 0 }); // rendered position
  const targetPos = useRef({ x: 0, y: 0 }); // desired position
  const scaleRef = useRef(1);
  const lockedRef = useRef(false);
  const activeElRef = useRef<Element | null>(null);
  const rafRef = useRef<number | null>(null);

  // Helpers
  const setTransform = (x: number, y: number, scale: number) => {
    const el = cursorRef.current;
    if (!el) return;
    const half = baseSize / 2;
    el.style.transform = `translate3d(${x - half}px, ${y - half}px, 0) scale(${scale})`;
  };

  const setActiveStyles = (active: boolean) => {
    const el = cursorRef.current;
    if (!el) return;
    if (active) {
      el.style.background = "white";
      el.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.9) inset, 0 8px 28px rgba(0,0,0,0.45)";
      el.style.outline = "0px solid transparent";
      el.style.mixBlendMode = "normal";
    } else {
      // High-contrast silver idle
      el.style.background =
        "radial-gradient(60% 60% at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(246,248,250,0.95) 48%, rgba(216,222,228,0.92) 72%, rgba(70,76,84,0.95) 100%), #d7dce1";
      el.style.boxShadow =
        "0 6px 18px rgba(0,0,0,0.35), inset 0 0 14px rgba(255,255,255,0.45), inset 0 -12px 24px rgba(0,0,0,0.22)";
      el.style.outline = "1.5px solid rgba(255,255,255,0.5)";
      el.style.mixBlendMode = "normal";
    }
  };

  const computeTargetCenterAndScale = (el: Element) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const diameter = Math.max(rect.width, rect.height) + expandPadding * 2; // cover target bounds
    const scale = Math.max(1, diameter / baseSize);
    return { cx, cy, scale };
  };

  const animate = () => {
    const { x: tx, y: ty } = targetPos.current;
    const dx = tx - pos.current.x;
    const dy = ty - pos.current.y;
    pos.current.x += dx * ease;
    pos.current.y += dy * ease;
    setTransform(pos.current.x, pos.current.y, scaleRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Skip on touch-only devices
    const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.className = `pointer-events-none fixed ${zIndexClassName} left-0 top-0 will-change-transform rounded-full transition-[background,box-shadow] duration-200 ease-out`;
    el.style.width = `${baseSize}px`;
    el.style.height = `${baseSize}px`;
    el.style.transformOrigin = "50% 50%";
    el.style.zIndex = "2147483647"; // ensure on top of everything

    document.body.appendChild(el);
    cursorRef.current = el;
    // Apply idle styles AFTER ref is set so they're not skipped
    setActiveStyles(false);

    // Initialize at screen center so it's visible even before the first move
    const initX = window.innerWidth / 2;
    const initY = window.innerHeight / 2;
    targetPos.current.x = initX;
    targetPos.current.y = initY;
    pos.current.x = initX;
    pos.current.y = initY;
    setTransform(initX, initY, 1);

    const onMove = (e: MouseEvent | PointerEvent) => {
      const mx = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
      const my = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
      if (!lockedRef.current) {
        targetPos.current.x = mx;
        targetPos.current.y = my;
      }

      const target = document.elementFromPoint(mx, my);
      const interactive = target?.closest?.(interactiveSelector) ?? null;
      if (interactive !== activeElRef.current) {
        activeElRef.current = interactive;
        if (interactive) {
          const { cx, cy, scale } = computeTargetCenterAndScale(interactive);
          lockedRef.current = true;
          scaleRef.current = scale;
          setActiveStyles(true);
          targetPos.current.x = cx;
          targetPos.current.y = cy;
        } else {
          lockedRef.current = false;
          scaleRef.current = 1;
          setActiveStyles(false);
        }
      }
    };

    const onScrollOrResize = () => {
      if (!activeElRef.current) return;
      const { cx, cy, scale } = computeTargetCenterAndScale(activeElRef.current);
      scaleRef.current = scale;
      targetPos.current.x = cx;
      targetPos.current.y = cy;
    };

    window.addEventListener("pointermove", onMove as any, { passive: true });
    window.addEventListener("mousemove", onMove as any, { passive: true }); // fallback
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove as any);
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      el.remove();
      cursorRef.current = null;
    };
  }, [baseSize, ease, expandPadding, interactiveSelector, zIndexClassName]);

  return null;
}
