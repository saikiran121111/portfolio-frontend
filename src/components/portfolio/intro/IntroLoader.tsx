"use client";

import { useEffect, useMemo, useState } from "react";

interface IntroLoaderProps {
  // Duration of the whole count animation in ms
  durationMs?: number;
  // Optional callback when animation completes
  onComplete?: () => void;
  // Optional: background overlay color
  overlayClassName?: string;
}

// A fullscreen intro that counts 0% -> 100% while scaling the number up.
// At 100, the same number becomes an outline and the overlay zooms/fades to reveal the page.
export default function IntroLoader({
  durationMs = 1800,
  onComplete,
  overlayClassName = "bg-black/80",
}: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [outlined, setOutlined] = useState(false); // outline the same number at 100
  const [reveal, setReveal] = useState(false); // triggers overlay zoom+fade

  // Compute a scale from 0 -> 1.25 across the animation
  const scale = useMemo(() => 0.5 + (progress / 100) * 0.75, [progress]);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(step);
      } else {
        // Outline the existing number, then zoom/fade the overlay away
        const outlineTimer = setTimeout(() => setOutlined(true), 120);
        const zoomTimer = setTimeout(() => setReveal(true), 600);
        const endTimer = setTimeout(() => {
          try {
            document.documentElement.setAttribute("data-intro-done", "true");
            window.dispatchEvent(new Event("intro:done"));
          } catch {}
          setHidden(true);
          onComplete?.();
        }, 1500);
        return () => {
          clearTimeout(outlineTimer);
          clearTimeout(zoomTimer);
          clearTimeout(endTimer);
        };
      }
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [durationMs, onComplete]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden>
      {/* Zoom & fade wrapper with overlay background */}
      <div
        className={`absolute inset-0 ${overlayClassName} flex items-center justify-center`}
        style={{
          transform: reveal ? "scale(16)" : "scale(1)",
          opacity: reveal ? 0 : 1,
          transition: "transform 900ms ease, opacity 900ms ease",
          // Center the zoom so the 100 scales from the middle
          transformOrigin: "50% 50%",
        }}
      >
        <div className="flex w-full max-w-[720px] flex-col items-center gap-6 px-6">
          <div className="select-none will-change-transform" style={{ transition: "transform 75ms ease-out" }}>
            <span
              className="font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-[10vw] sm:text-[8vw] md:text-[6vw] leading-none tracking-tight"
              style={{
                transform: `scale(${scale})`,
                color: outlined ? "transparent" : "#ffffff",
                WebkitTextStroke: outlined ? "0.8px rgba(255,255,255,0.4)" : "0px transparent",
                // Smoothly fade from filled to outlined
                transition: "transform 75ms ease-out, color 300ms ease, -webkit-text-stroke 300ms ease",
              } as any}
            >
              {progress}%
            </span>
          </div>

          {/* Loading bar shows only while loading */}
          {progress < 100 && (
            <div className="w-full">
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.35)] transition-[width] duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
