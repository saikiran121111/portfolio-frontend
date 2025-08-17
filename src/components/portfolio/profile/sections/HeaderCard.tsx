"use client";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import type { IPortfolio } from "@/interfaces/portfolio.interface";
import SocialIcon from "./SocialIcon";
import CopyButton from "./CopyButton";
import { fadeUpVariants } from "./utils";
import { useState, useEffect, useRef } from "react";

export default function HeaderCard({ data }: { data: IPortfolio }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    if (isHovered) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered]);

  return (
    <>
      {/* Ultra-Advanced CSS Styles */}
      <style jsx>{`
        .hero-card-container {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .hero-card {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(15,23,42,0.9) 0%, 
            rgba(30,41,59,0.8) 25%,
            rgba(15,23,42,0.9) 50%,
            rgba(30,41,59,0.8) 75%,
            rgba(15,23,42,0.9) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border: 2px solid transparent;
          background-clip: padding-box;
          box-shadow: 
            0 25px 50px -12px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 0 100px rgba(6,182,212,0.15);
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }

        .hero-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, 
            #06b6d4, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #06b6d4);
          background-size: 400% 400%;
          border-radius: inherit;
          z-index: -1;
          animation: border-animation 8s ease infinite;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .hero-card:hover::before {
          opacity: 1;
        }

        @keyframes border-animation {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .neural-grid {
          position: absolute;
          inset: 0;
          background-image: 
            conic-gradient(from 90deg at 40% 50%, #0000 50%, #06b6d4 50%),
            conic-gradient(from 90deg at 60% 50%, #0000 50%, #3b82f6 50%);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          opacity: 0.03;
          animation: neural-pulse 4s ease-in-out infinite;
        }

        @keyframes neural-pulse {
          0%, 100% { opacity: 0.03; transform: scale(1); }
          50% { opacity: 0.08; transform: scale(1.02); }
        }

        .floating-orbs {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          mix-blend-mode: screen;
        }

        .orb-1 {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%);
          top: -20%;
          left: -10%;
        }

        .orb-2 {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%);
          top: 60%;
          right: -5%;
        }

        .orb-3 {
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%);
          bottom: -15%;
          left: 40%;
        }

        .orb-4 {
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%);
          top: 20%;
          right: 30%;
        }

        .orb-5 {
          width: 90px;
          height: 90px;
          background: radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%);
          bottom: 40%;
          left: 10%;
        }

        .orb-6 {
          width: 70px;
          height: 70px;
          background: radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%);
          top: 40%;
          left: 70%;
        }

        .particle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          border-radius: 50%;
          box-shadow: 0 0 6px currentColor;
        }

        .holographic-text {
          background: linear-gradient(45deg, 
            #ffffff 0%, 
            #06b6d4 20%, 
            #ffffff 40%, 
            #3b82f6 60%, 
            #ffffff 80%, 
            #8b5cf6 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: hologram-shift 4s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(6,182,212,0.5));
          position: relative;
        }

        .holographic-text::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(45deg, #ff0080, #00ff80, #8000ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0;
          animation: glitch-hologram 3s ease-in-out infinite;
          transform: translate(1px, 1px);
        }

        @keyframes hologram-shift {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }

        @keyframes glitch-hologram {
          0%, 90%, 100% { opacity: 0; }
          5%, 85% { opacity: 0.3; }
        }

        .contact-item {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(255,255,255,0.05) 0%, 
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          overflow: hidden;
        }

        .contact-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(6,182,212,0.2) 25%,
            rgba(59,130,246,0.2) 50%,
            rgba(139,92,246,0.2) 75%,
            transparent 100%);
          transition: left 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .contact-item:hover::before {
          left: 100%;
        }

        .contact-item:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(6,182,212,0.4);
          box-shadow: 
            0 10px 30px rgba(6,182,212,0.2),
            0 0 20px rgba(6,182,212,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2);
          background: linear-gradient(135deg, 
            rgba(6,182,212,0.1) 0%, 
            rgba(59,130,246,0.05) 50%,
            rgba(139,92,246,0.1) 100%);
        }

        .cursor-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, 
            rgba(6,182,212,0.15) 0%, 
            rgba(59,130,246,0.1) 30%,
            rgba(139,92,246,0.05) 60%,
            transparent 80%);
          border-radius: 50%;
          pointer-events: none;
          filter: blur(20px);
          mix-blend-mode: screen;
        }

        .glow-icon {
          filter: drop-shadow(0 0 8px rgba(6,182,212,0.6));
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .glow-icon:hover {
          filter: drop-shadow(0 0 16px rgba(6,182,212,1));
          transform: scale(1.2) rotate(5deg);
        }

        .text-shimmer {
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.8) 0%, 
            rgba(255,255,255,1) 25%,
            rgba(6,182,212,1) 50%,
            rgba(255,255,255,1) 75%,
            rgba(255,255,255,0.8) 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer-wave 3s ease-in-out infinite;
        }

        @keyframes shimmer-wave {
          0%, 100% { background-position: -100% 0; }
          50% { background-position: 200% 0; }
        }

        .scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(6,182,212,0.03) 50%,
            transparent 100%
          );
          animation: scanline-sweep 3s linear infinite;
          pointer-events: none;
        }

        @keyframes scanline-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @media (max-width: 768px) {
          .hero-card {
            transform: none !important;
          }
          
          .cursor-glow {
            display: none;
          }
        }
      `}</style>

      <motion.div 
        ref={cardRef}
        variants={fadeUpVariants} 
        className="hero-card-container relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
        }}
      >
        {/* Neural Grid Background */}
        <div className="neural-grid absolute inset-0"></div>
        
        {/* Floating Orbs */}
        <div className="floating-orbs absolute inset-0 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className={`orb orb-${i} absolute rounded-full`}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Particle Field */}
        <div className="particle-field absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="particle absolute"
              animate={{
                x: [Math.random() * 400, Math.random() * 400],
                y: [Math.random() * 200, Math.random() * 200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Cursor Glow Effect */}
        {isHovered && (
          <motion.div
            className="cursor-glow absolute pointer-events-none"
            style={{
              left: mousePosition.x - 150,
              top: mousePosition.y - 150,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Main Card */}
        <motion.div 
          className="hero-card relative z-10 rounded-2xl p-8"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Scanline Effect */}
          <div className="scanline absolute inset-0"></div>

          <motion.div className="flex flex-wrap items-center justify-between gap-6 relative z-20">
            <div className="flex-1">
              <motion.h1 
                className="holographic-text text-3xl md:text-4xl font-bold tracking-tight"
                data-text={data.name}
                initial={{ opacity: 0, y: 30, scale: 0.8 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                {data.name}
              </motion.h1>
              {data.headline && (
                <motion.p 
                  className="mt-2 text-lg text-shimmer font-medium"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {data.headline}
                </motion.p>
              )}
            </div>
            <motion.div 
              className="social-container relative z-30"
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }} 
              animate={{ opacity: 1, scale: 1, rotateY: 0 }} 
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                type: "spring",
                stiffness: 120
              }}
              whileHover={{
                scale: 1.1,
                rotateY: -5,
                transition: { duration: 0.3 }
              }}
            >
              <SocialIcon socials={data.socials} />
            </motion.div>
          </motion.div>

          {data.summary && (
            <motion.p 
              className="mt-6 text-white/90 leading-relaxed text-lg relative z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {data.summary}
            </motion.p>
          )}

          <motion.div 
            className="mt-6 flex flex-wrap items-center gap-4 relative z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {data.location && (
              <motion.span 
                className="contact-item inline-flex items-center gap-3 px-4 py-3 rounded-lg"
                whileHover={{
                  scale: 1.05,
                  rotateX: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MapPin className="size-5 text-cyan-300 glow-icon" />
                </motion.div>
                <span className="text-white font-medium">{data.location}</span>
              </motion.span>
            )}
            {data.email && (
              <motion.div 
                className="contact-item inline-flex items-center gap-3 px-4 py-3 rounded-lg group"
                whileHover={{
                  scale: 1.05,
                  rotateX: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <a className="inline-flex items-center gap-3 hover:text-cyan-200 transition-all duration-300" href={`mailto:${data.email}`}>
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotate: 15,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Mail className="size-5 text-cyan-300 glow-icon" />
                  </motion.div>
                  <span className="text-white font-medium">{data.email}</span>
                </a>
                <CopyButton text={data.email} label="email" />
              </motion.div>
            )}
            {data.phone && (
              <motion.div 
                className="contact-item inline-flex items-center gap-3 px-4 py-3 rounded-lg group"
                whileHover={{
                  scale: 1.05,
                  rotateX: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <a className="inline-flex items-center gap-3 hover:text-cyan-200 transition-all duration-300" href={`tel:${data.phone}`}>
                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    whileHover={{
                      scale: 1.2,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Phone className="size-5 text-cyan-300 glow-icon" />
                  </motion.div>
                  <span className="text-white font-medium">{data.phone}</span>
                </a>
                <CopyButton text={data.phone} label="phone" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
