"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface IntroLoaderProps {
  // Duration of the whole count animation in ms
  durationMs?: number;
  // Optional callback when animation completes
  onComplete?: () => void;
  // Optional: background overlay color
  overlayClassName?: string;
}

// Particle component for animated background
const Particle = ({ delay = 0, index = 0 }: { delay?: number; index?: number }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use index to create deterministic but varied values
  const randomX = mounted ? (index * 37.5) % 100 : 50;
  const randomY = mounted ? (index * 73.2) % 100 : 50;
  const randomScale = mounted ? 0.5 + ((index * 0.1) % 0.5) : 0.75;
  const randomDuration = mounted ? 3 + ((index * 0.5) % 4) : 3.5;
  
  if (!mounted) {
    return (
      <div
        className="absolute w-2 h-2 rounded-full opacity-40"
        style={{
          left: '50%',
          top: '50%',
          transform: 'scale(0.75)',
          background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
        }}
      />
    );
  }
  
  return (
    <div
      className="absolute w-2 h-2 rounded-full opacity-60"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        transform: `scale(${randomScale})`,
        animation: `float ${randomDuration}s ease-in-out infinite ${delay}s`,
        background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(240, 240, 240, 0.2)',
        filter: 'blur(0.5px)',
      }}
    />
  );
};

// Geometric shape component
const GeometricShape = ({ type, delay = 0, index = 0 }: { type: 'triangle' | 'circle' | 'square'; delay?: number; index?: number }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use index to create deterministic but varied values
  const randomX = mounted ? (index * 43.7) % 100 : 50;
  const randomY = mounted ? (index * 67.3) % 100 : 50;
  const randomRotation = mounted ? (index * 47) % 360 : 0;
  const randomDuration = mounted ? 8 + ((index * 0.3) % 4) : 10;
  
  const shapes = {
    triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    circle: 'circle(50%)',
    square: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  };
  
  if (!mounted) {
    return (
      <div
        className="absolute w-8 h-8 backdrop-blur-sm hexagon-grid"
        style={{
          left: '50%',
          top: '50%',
          transform: 'rotate(0deg)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(240, 240, 240, 0.08))',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        }}
      />
    );
  }
  
  return (
    <div
      className="absolute w-8 h-8 backdrop-blur-sm hexagon-grid"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        transform: `rotate(${randomRotation}deg)`,
        animation: `spin ${randomDuration}s linear infinite ${delay}s, float ${randomDuration * 0.7}s ease-in-out infinite, hexagon-grid 6s ease-in-out infinite`,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(240, 240, 240, 0.08))',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)',
      }}
    />
  );
};

// A fullscreen intro that counts 0% -> 100% with advanced animations and visual effects
export default function IntroLoader({
  durationMs = 2400,
  onComplete,
  overlayClassName = "bg-black",
}: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [outlined, setOutlined] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [breathingEffect, setBreathingEffect] = useState(false);

  // Ensure client-side only rendering for random elements
  useEffect(() => {
    setMounted(true);
  }, []);

  // Stabilize the onComplete callback
  const stableOnComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  // Stabilize the duration
  const stableDuration = useMemo(() => durationMs, [durationMs]);

  // Enhanced scaling with elastic effect
  const contentScale = useMemo(() => {
    const baseScale = 0.7 + (progress / 100) * 0.8; // 0.7 -> 1.5
    const elasticFactor = progress > 90 ? 1 + Math.sin((progress - 90) * 0.31) * 0.1 : 1;
    return baseScale * elasticFactor;
  }, [progress]);

  const inverseScale = useMemo(() => 1 / contentScale, [contentScale]);

  // Dynamic glow intensity based on progress
  const glowIntensity = useMemo(() => {
    return Math.min(100, progress * 1.2);
  }, [progress]);

  // Pulse effect for final stages
  useEffect(() => {
    if (progress >= 80) {
      setPulseIntensity((progress - 80) / 20);
    }
    if (progress >= 60) {
      setBreathingEffect(true);
    }
  }, [progress]);

  useEffect(() => {
    const start = performance.now();
    
    const step = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / stableDuration) * 100));
      setProgress(pct);
      
      if (pct < 100) {
        requestAnimationFrame(step);
      } else {
        // Enhanced completion sequence
        const outlineTimer = setTimeout(() => setOutlined(true), 150);
        const zoomTimer = setTimeout(() => setReveal(true), 800);
        const endTimer = setTimeout(() => {
          try {
            document.documentElement.setAttribute("data-intro-done", "true");
            window.dispatchEvent(new Event("intro:done"));
          } catch {}
          setHidden(true);
          stableOnComplete();
        }, 2000);
        return () => {
          clearTimeout(outlineTimer);
          clearTimeout(zoomTimer);
          clearTimeout(endTimer);
        };
      }
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [stableDuration, stableOnComplete]);

  if (hidden) return null;

  return (
    <>
      {/* CSS Keyframes for futuristic animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hologram-shimmer {
          0% { 
            background-position: -200% center;
            transform: perspective(1000px) rotateY(0deg);
          }
          50% {
            transform: perspective(1000px) rotateY(5deg);
          }
          100% { 
            background-position: 200% center;
            transform: perspective(1000px) rotateY(0deg);
          }
        }
        @keyframes cyber-pulse {
          0%, 100% { 
            transform: scale(1) rotateZ(0deg);
            filter: hue-rotate(0deg) brightness(1);
          }
          25% {
            transform: scale(1.01) rotateZ(1deg);
            filter: hue-rotate(0deg) brightness(1.1);
          }
          50% { 
            transform: scale(1.02) rotateZ(0deg);
            filter: hue-rotate(0deg) brightness(1.2);
          }
          75% {
            transform: scale(1.01) rotateZ(-1deg);
            filter: hue-rotate(0deg) brightness(1.1);
          }
        }
        @keyframes neural-glow {
          0%, 100% { 
            filter: brightness(1) saturate(1) blur(0px);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% { 
            filter: brightness(1.2) saturate(1.3) blur(0.5px);
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(240, 240, 240, 0.2);
          }
        }
        @keyframes data-stream {
          0% { 
            transform: translateY(20px) scale(0.8);
            opacity: 0;
            filter: blur(2px);
          }
          50% {
            filter: blur(0px);
          }
          100% { 
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }
        @keyframes tech-scan {
          0% { 
            top: -4px; 
            opacity: 1;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
          }
          100% { 
            top: 100%; 
            opacity: 0;
            box-shadow: 0 0 40px rgba(240, 240, 240, 0.4);
          }
        }
        @keyframes quantum-rain {
          0% { 
            opacity: 1; 
            transform: translateY(-100vh) scale(1);
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(0deg);
          }
          100% { 
            opacity: 0; 
            transform: translateY(100vh) scale(0.5);
            filter: hue-rotate(0deg);
          }
        }
        @keyframes hexagon-grid {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1) rotate(60deg);
            opacity: 0.7;
          }
        }
        .hologram-shimmer {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.8), 
            rgba(255, 255, 255, 0.9),
            rgba(240, 240, 240, 0.6),
            transparent);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: hologram-shimmer 3s ease-in-out infinite;
        }
        .cyber-pulse {
          animation: cyber-pulse 4s ease-in-out infinite;
        }
        .neural-glow {
          animation: neural-glow 2.5s ease-in-out infinite;
        }
        .data-stream {
          animation: data-stream 1s ease-out forwards;
        }
        .tech-scan {
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.8), 
            rgba(255, 255, 255, 0.6),
            rgba(240, 240, 240, 0.8),
            transparent);
          animation: tech-scan 3s linear infinite;
          filter: blur(1px);
        }
        .quantum-char {
          animation: quantum-rain 4s linear infinite;
          font-family: 'Courier New', monospace;
          background: linear-gradient(45deg, #ffffff, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }
        .hexagon-grid {
          animation: hexagon-grid 6s ease-in-out infinite;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-hidden" aria-hidden>
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {mounted && Array.from({ length: 50 }).map((_, i) => (
            <Particle key={`particle-${i}`} delay={i * 0.1} index={i} />
          ))}
        </div>

        {/* Geometric shapes */}
        <div className="absolute inset-0">
          {mounted && Array.from({ length: 15 }).map((_, i) => (
            <GeometricShape 
              key={`shape-${i}`} 
              type={['triangle', 'circle', 'square'][i % 3] as 'triangle' | 'circle' | 'square'} 
              delay={i * 0.2} 
              index={i}
            />
          ))}
        </div>

        {/* Quantum data stream */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {mounted && Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`quantum-${i}`}
              className="absolute quantum-char text-sm font-mono"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {String.fromCharCode(48 + (i % 10))} {/* Numbers 0-9 */}
            </div>
          ))}
        </div>

        {/* Main zoom & fade wrapper with pitch black background */}
        <div
          className={`absolute inset-0 ${overlayClassName} flex items-center justify-center`}
          style={{
            transform: reveal ? "scale(20)" : "scale(1)",
            opacity: reveal ? 0 : 1,
            transition: "transform 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1200ms ease",
            transformOrigin: "50% 50%",
            background: "#000000",
          }}
        >
          {/* Futuristic scanning line effect */}
          <div className="tech-scan" />
          
          {/* Central content container */}
          <div
            className={`flex w-full max-w-[720px] flex-col items-center gap-8 px-6 relative data-stream ${breathingEffect ? 'cyber-pulse' : ''}`}
            style={{ 
              transform: `scale(${contentScale})`, 
              transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)" 
            }}
          >
            {/* Futuristic percentage display */}
            <div className="select-none relative">
              {/* Main holographic text - removed background box */}
              <span
                className={`
                  relative z-10 font-black text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw] 
                  leading-none tracking-tighter select-none
                  ${!outlined ? 'hologram-shimmer' : ''}
                `}
                style={{
                  ...(outlined
                    ? { 
                        color: "transparent", 
                        WebkitTextStroke: "2px rgba(255, 255, 255, 0.9)",
                        filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 60px rgba(240, 240, 240, 0.4))"
                      }
                    : { 
                        background: `linear-gradient(135deg, 
                          #ffffff 0%, 
                          #ffffff 25%, 
                          #f0f0f0 50%, 
                          #ffffff 75%, 
                          #ffffff 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        filter: `
                          drop-shadow(0 4px 30px rgba(255, 255, 255, 0.5))
                          drop-shadow(0 0 50px rgba(240, 240, 240, 0.3))
                        `
                      }),
                  textShadow: outlined ? 'none' : '0 0 60px rgba(255, 255, 255, 0.4)',
                  transform: `perspective(1000px) rotateX(${Math.sin(progress * 0.02) * 2}deg) rotateY(${Math.cos(progress * 0.015) * 1}deg)`,
                }}
              >
                {progress}%
              </span>

              {/* Quantum data sweep */}
              {!outlined && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 via-white/20 to-transparent"
                  style={{
                    transform: `translateX(${(progress / 100) * 200 - 100}%)`,
                    transition: 'transform 200ms ease-out',
                    mixBlendMode: 'screen',
                    filter: 'blur(1px)',
                  }}
                />
              )}
            </div>

            {/* Futuristic loading bar */}
            {progress < 100 && (
              <div 
                className="w-full relative"
              >
                {/* Quantum field container */}
                <div className="relative p-1">
                  <div 
                    className="absolute inset-0 rounded-full blur-sm"
                    style={{
                      background: `linear-gradient(90deg, 
                        rgba(255, 255, 255, 0.4) 0%, 
                        rgba(240, 240, 240, 0.3) 50%, 
                        rgba(255, 255, 255, 0.4) 100%)`,
                      opacity: progress / 100,
                    }}
                  />
                  
                  {/* Main progress bar with tech design */}
                  <div className="relative h-4 rounded-full bg-black/50 overflow-hidden backdrop-blur-sm border border-white/30" 
                       style={{ boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.15)' }}>
                    {/* Animated circuit pattern */}
                    <div 
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `
                          repeating-linear-gradient(
                            90deg,
                            transparent 0px,
                            rgba(255, 255, 255, 0.15) 2px,
                            transparent 4px,
                            transparent 12px
                          ),
                          repeating-linear-gradient(
                            0deg,
                            transparent 0px,
                            rgba(240, 240, 240, 0.08) 1px,
                            transparent 2px,
                            transparent 8px
                          )
                        `,
                        animation: 'slide 2s linear infinite',
                      }}
                    />
                    
                    {/* Progress fill with quantum effect */}
                    <div
                      className="h-full relative overflow-hidden"
                      style={{ 
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, 
                          #ffffff 0%, 
                          #ffffff 30%, 
                          #f0f0f0 60%, 
                          #ffffff 100%)`,
                        boxShadow: `
                          0 0 25px rgba(255, 255, 255, 0.6),
                          inset 0 1px 0 rgba(255, 255, 255, 0.4),
                          inset 0 -1px 0 rgba(255, 255, 255, 0.4)
                        `,
                        transition: "width 150ms cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {/* Quantum energy pulse */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        style={{
                          transform: 'translateX(-100%)',
                          animation: 'slide 1.5s ease-in-out infinite',
                          filter: 'blur(1px)',
                        }}
                      />
                      
                      {/* Data nodes */}
                      <div className="absolute inset-0 flex items-center justify-around">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-white rounded-full opacity-60"
                            style={{
                              animation: `pulse 1s ease-in-out infinite ${i * 0.1}s`,
                              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Holographic progress indicators */}
                <div className="flex justify-between mt-3 text-xs font-mono">
                  <span className="text-white/80 tracking-wider">LOADING_SYS...</span>
                  <span className="text-white/90 font-semibold tracking-wider">{progress.toString().padStart(3, '0')}%</span>
                </div>
              </div>
            )}

            {/* Futuristic status display */}
            {progress < 100 && (
              <div className="text-center">
                <p className="text-white/80 text-sm font-mono tracking-widest uppercase">
                  {progress < 30 && ">> INITIALIZING NEURAL NETWORKS..."}
                  {progress >= 30 && progress < 60 && ">> LOADING QUANTUM MODULES..."}
                  {progress >= 60 && progress < 90 && ">> SYNCHRONIZING DATA STREAMS..."}
                  {progress >= 90 && ">> SYSTEM READY - STANDBY..."}
                </p>
                <div className="mt-2 flex justify-center space-x-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      style={{
                        animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`,
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional CSS for sliding animation */}
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
}
