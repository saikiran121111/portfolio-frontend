"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface IntroLoaderProps {
  durationMs?: number;
  onComplete?: () => void;
  overlayClassName?: string;
}

export default function IntroLoader({
  durationMs = 4000,
  onComplete,
  overlayClassName = "bg-black",
}: IntroLoaderProps) {
  const [phase, setPhase] = useState<"initial" | "dot" | "line" | "s-in" | "k-arrow" | "complete" | "zoom" | "done">("initial");
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  const [mounted, setMounted] = useState(false);
  const animationStarted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const introShown = sessionStorage.getItem("intro-shown");
      if (introShown === "true") {
        setSkipIntro(true);
        document.documentElement.setAttribute("data-intro-done", "true");
        onComplete?.();
      }
    } catch {
      // Continue with animation
    }
  }, [mounted, onComplete]);

  const stableOnComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const stableDuration = useMemo(() => durationMs, [durationMs]);

  // Animation sequence controller
  useEffect(() => {
    if (!mounted || skipIntro || animationStarted.current) return;
    animationStarted.current = true;

    setPhase("dot");

    const lineTimer = setTimeout(() => setPhase("line"), 400);
    const sTimer = setTimeout(() => setPhase("s-in"), 1000);
    const kTimer = setTimeout(() => setPhase("k-arrow"), 1800);
    const completeTimer = setTimeout(() => setPhase("complete"), 2600);
    const zoomTimer = setTimeout(() => setPhase("zoom"), stableDuration - 600);

    const endTimer = setTimeout(() => {
      setPhase("done");
      try {
        document.documentElement.setAttribute("data-intro-done", "true");
        sessionStorage.setItem("intro-shown", "true");
        window.dispatchEvent(new Event("intro:done"));
      } catch { }
      setHidden(true);
      stableOnComplete();
    }, stableDuration);

    // Progress bar
    const startTime = performance.now();
    const animateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / (stableDuration - 600)) * 100));
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(animateProgress);
    };
    requestAnimationFrame(animateProgress);

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(sTimer);
      clearTimeout(kTimer);
      clearTimeout(completeTimer);
      clearTimeout(zoomTimer);
      clearTimeout(endTimer);
    };
  }, [mounted, skipIntro, stableDuration, stableOnComplete]);

  if (!mounted || skipIntro || hidden) return null;

  const showDot = phase === "dot";
  const showLine = phase === "line" || phase === "s-in" || phase === "k-arrow" || phase === "complete" || phase === "zoom";
  const showS = phase === "s-in" || phase === "k-arrow" || phase === "complete" || phase === "zoom";
  const showKArrow = phase === "k-arrow" || phase === "complete" || phase === "zoom";
  const isComplete = phase === "complete" || phase === "zoom";

  return (
    <>
      <style jsx>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        
        @keyframes lineGrow {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        
        @keyframes slideInLeft {
          0% { transform: translateX(-80px); opacity: 0; }
          70% { transform: translateX(5px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes arrowSlash {
          0% { 
            clip-path: polygon(0 50%, 0 50%, 0 50%, 0 50%);
            opacity: 0;
          }
          100% { 
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            opacity: 1;
          }
        }
        
        @keyframes luxuryGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5)) 
                    drop-shadow(0 0 16px rgba(255, 215, 0, 0.25));
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.6)) 
                    drop-shadow(0 0 24px rgba(255, 215, 0, 0.35));
          }
        }
        
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes zoomReveal {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .dot-pulse { 
          animation: dotPulse 0.5s ease-in-out infinite;
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
        }
        
        .line-grow { 
          animation: lineGrow 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
          transform-origin: center; 
        }
        
        .slide-in-left { 
          animation: slideInLeft 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
        }
        
        .arrow-slash { 
          animation: arrowSlash 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
        }
        
        .luxury-glow { 
          animation: luxuryGlow 2s ease-in-out infinite, gentleFloat 3s ease-in-out infinite; 
        }
        
        .zoom-reveal { 
          animation: zoomReveal 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
        
        .bar-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 250, 205, 0.6) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-hidden" aria-hidden>
        <div
          className={`absolute inset-0 ${overlayClassName} flex flex-col items-center justify-center gap-10`}
          style={{
            background: "#000000",
            opacity: phase === "zoom" ? 0 : 1,
            transition: "opacity 500ms ease-out",
          }}
        >
          {/* Logo Container */}
          <div className={`relative ${isComplete ? "luxury-glow" : ""} ${phase === "zoom" ? "zoom-reveal" : ""}`}>
            <svg
              style={{
                width: "min(50vw, 280px)",
                height: "min(50vw, 280px)",
                filter: isComplete ? undefined : "drop-shadow(0 0 6px rgba(255, 215, 0, 0.4))",
              }}
              viewBox="50 -30 520 560"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B8860B" />
                  <stop offset="25%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="75%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>

                <linearGradient id="goldVertical" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="30%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>

              {/* DOT - center starting point */}
              {showDot && (
                <circle
                  cx="345"
                  cy="250"
                  r="10"
                  fill="#FFD700"
                  className="dot-pulse"
                />
              )}

              {/* K vertical bar - grows from center */}
              {showLine && (
                <path
                  className="line-grow"
                  fill="url(#goldVertical)"
                  d="M330 20 l15 20 l15 -20 v50 l-5 5 v300 l5 5 v50 l-15 -20 l-15 20 v-50 l5 -5 v-300 l-5 -5 z"
                />
              )}

              {/* S - slides in from left with slight bounce */}
              {showS && (
                <path
                  className="slide-in-left"
                  fill="url(#goldGradient)"
                  d="M140 50c40-40 150-40 190 0-50 0-90 10-115 30-40 30-40 90 40 110 120 30 160 90 90 150-50 40-150 50-200 0 60 10 110-10 130-40 30-50-10-80-60-100-90-40-110-110-35-150z"
                />
              )}

              {/* K arrow - slashes in */}
              {showKArrow && (
                <path
                  className="arrow-slash"
                  fill="url(#goldGradient)"
                  d="M355 260 l145 -180 h60 l-150 200 160 220h-65L355 270z"
                />
              )}
            </svg>
          </div>

          {/* Golden Progress Bar */}
          {phase !== "zoom" && (
            <div
              className="flex justify-center"
              style={{ width: "min(50vw, 280px)" }}
            >
              <div
                className="w-full relative h-1 rounded-full overflow-hidden"
                style={{ background: "rgba(212, 175, 55, 0.15)" }}
              >
                <div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #B8860B, #D4AF37, #FFD700, #D4AF37, #B8860B)",
                    boxShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
                    transition: "width 50ms linear",
                  }}
                >
                  <div className="absolute inset-0 bar-shimmer" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
