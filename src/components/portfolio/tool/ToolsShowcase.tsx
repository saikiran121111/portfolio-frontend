"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import type { IToolDoc } from "@/interfaces/portfolio.interface";
import { Wrench, Boxes, BadgeCheck } from "lucide-react";

export interface ToolsShowcaseProps {
  tools?: IToolDoc[];
}

// Map common tool keys to curated local SVGs from /public
const localLogoMap: Record<string, string> = {
  next: "/next.svg",
  nextjs: "/next.svg",
  vercel: "/vercel.svg",
  globe: "/globe.svg",
  window: "/window.svg",
  file: "/file.svg",
};

function getLogo(tool: IToolDoc): { src?: string; alt: string; unoptimized?: boolean } {
  const key = tool.icon?.toLowerCase?.().trim?.() || tool.key?.toLowerCase?.().trim?.();
  if (key) {
    // Prefer explicit URL in icon
    if (/^https?:\/\//i.test(tool.icon)) {
      return { src: tool.icon, alt: `${tool.title} logo`, unoptimized: true };
    }
    // Local mapping by key
    const local = localLogoMap[key];
    if (local) return { src: local, alt: `${tool.title} logo` };
    // If icon looks like a local path already
    if (tool.icon?.startsWith("/")) return { src: tool.icon, alt: `${tool.title} logo` };
  }
  return { alt: `${tool.title} logo` };
}

function Paragraphs({ text }: { text?: string }) {
  if (!text) return null;
  // Very lightweight text rendering: split paragraphs; preserve simple links
  const parts = text.split(/\n\n+/g);
  return (
    <div className="space-y-3 leading-relaxed text-white/80">
      {parts.map((p, i) => (
        <p key={i}>
          {p.split(/(https?:\/\/\S+)/g).map((chunk, j) =>
            /^https?:\/\//.test(chunk) ? (
              <a
                key={j}
                href={chunk}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-cyan-400/60 underline-offset-4 hover:text-white hover:decoration-cyan-300"
              >
                {chunk}
              </a>
            ) : (
              <span key={j}>{chunk}</span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

export default function ToolsShowcase({ tools = [] }: ToolsShowcaseProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return tools.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [tools]);

  if (!sorted.length) return null;

  return (
    <section aria-labelledby="tools-title" className="relative">
      {/* Section header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="relative grid place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 p-[2px] shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]">
          <div className="rounded-full bg-black/40 p-2 backdrop-blur-sm">
            <BadgeCheck className="size-5 text-cyan-300" aria-hidden />
          </div>
        </div>
        <h2 id="tools-title" className="text-2xl font-semibold text-white tracking-tight">
          Tools & Stack Behind This Portfolio
        </h2>
      </div>

      {/* Grid */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
      >
        {sorted.map((tool, idx) => {
          const logo = getLogo(tool);
          const isOpen = openKey === tool.key;
          return (
            <li key={tool.key} className="list-none">
              <motion.article
                layout
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: Math.min(idx * 0.05, 0.3) }}
                className="group relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
              >
                {/* Glows */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                     aria-hidden
                     style={{ background: "radial-gradient(600px 120px at top left, rgba(34,211,238,0.18), transparent 50%)" }}
                />

                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="relative size-12 shrink-0 grid place-items-center rounded-xl bg-black/30 ring-1 ring-white/10">
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                    {logo.src ? (
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={40}
                        height={40}
                        className="relative select-none"
                        priority={idx < 6}
                        unoptimized={logo.unoptimized}
                      />
                    ) : (
                      <Wrench className="size-6 text-white/70" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-white">{tool.title}</h3>
                    {tool.summary && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-white/70">{tool.summary}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-300/80">
                    <Boxes className="size-4" aria-hidden />
                    <span>Used in this portfolio</span>
                  </div>
                  <motion.button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenKey(isOpen ? null : tool.key)}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 shadow hover:border-cyan-400/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                  >
                    {isOpen ? "Hide details" : "How I used it"}
                  </motion.button>
                </div>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <Paragraphs text={tool.content} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
