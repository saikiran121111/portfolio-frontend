"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useMemo, useState, useRef, useEffect } from "react";
import type { IToolDoc } from "@/interfaces/portfolio.interface";
import { 
  Wrench, 
  Boxes, 
  BadgeCheck, 
  Sparkles, 
  Star, 
  Zap, 
  Code2, 
  Layers, 
  Search,
  Filter,
  ArrowUpDown,
  Grid3X3,
  LayoutGrid,
  Eye,
  EyeOff,
  LucideProps
} from "lucide-react";

export interface ToolsShowcaseProps {
  tools?: IToolDoc[];
}

// Map common tool keys to curated local SVGs from /public with enhanced metadata
const localLogoMap: Record<string, { src: string; color?: string; glow?: string }> = {
  next: { src: "/next.svg", color: "from-gray-900 to-black", glow: "rgba(255,255,255,0.1)" },
  nextjs: { src: "/next.svg", color: "from-gray-900 to-black", glow: "rgba(255,255,255,0.1)" },
  vercel: { src: "/vercel.svg", color: "from-gray-900 to-black", glow: "rgba(255,255,255,0.1)" },
  globe: { src: "/globe.svg", color: "from-blue-600 to-cyan-500", glow: "rgba(34,211,238,0.3)" },
  window: { src: "/window.svg", color: "from-purple-600 to-violet-500", glow: "rgba(139,92,246,0.3)" },
  file: { src: "/file.svg", color: "from-green-600 to-emerald-500", glow: "rgba(34,197,94,0.3)" },
  // Add more tool mappings with their brand colors
  react: { src: "/react.svg", color: "from-blue-400 to-cyan-400", glow: "rgba(56,189,248,0.4)" },
  typescript: { src: "/typescript.svg", color: "from-blue-600 to-blue-400", glow: "rgba(59,130,246,0.4)" },
  tailwind: { src: "/tailwind.svg", color: "from-teal-400 to-cyan-400", glow: "rgba(20,184,166,0.4)" },
  nodejs: { src: "/nodejs.svg", color: "from-green-500 to-green-400", glow: "rgba(34,197,94,0.4)" },
  postgres: { src: "/postgres.svg", color: "from-blue-700 to-blue-500", glow: "rgba(29,78,216,0.4)" },
  docker: { src: "/docker.svg", color: "from-blue-500 to-cyan-400", glow: "rgba(56,189,248,0.4)" },
  prisma: { src: "/prisma.svg", color: "from-slate-700 to-slate-500", glow: "rgba(100,116,139,0.4)" },
  nestjs: { src: "/nestjs.svg", color: "from-red-600 to-red-400", glow: "rgba(239,68,68,0.4)" },
};

const categoryColors: Record<string, { bg: string; text: string; icon: React.ComponentType<LucideProps> }> = {
  frontend: { bg: "from-blue-500/20 to-cyan-500/20", text: "text-cyan-300", icon: Layers },
  backend: { bg: "from-green-500/20 to-emerald-500/20", text: "text-emerald-300", icon: Code2 },
  database: { bg: "from-purple-500/20 to-violet-500/20", text: "text-violet-300", icon: Boxes },
  deployment: { bg: "from-orange-500/20 to-red-500/20", text: "text-orange-300", icon: Zap },
  tools: { bg: "from-yellow-500/20 to-amber-500/20", text: "text-amber-300", icon: Wrench },
  default: { bg: "from-gray-500/20 to-slate-500/20", text: "text-gray-300", icon: Star },
};

function getToolCategory(tool: IToolDoc): keyof typeof categoryColors {
  const key = tool.key.toLowerCase();
  if (['react', 'nextjs', 'tailwind', 'framer-motion'].includes(key)) return 'frontend';
  if (['nestjs', 'nodejs', 'express'].includes(key)) return 'backend';
  if (['postgres', 'prisma', 'mongodb'].includes(key)) return 'database';
  if (['vercel', 'docker', 'render'].includes(key)) return 'deployment';
  if (['eslint', 'prettier', 'jest'].includes(key)) return 'tools';
  return 'default';
}

function getLogo(tool: IToolDoc): { src?: string; alt: string; unoptimized?: boolean; metadata?: { src: string; color?: string; glow?: string } } {
  const key = tool.icon?.toLowerCase?.().trim?.() || tool.key?.toLowerCase?.().trim?.();
  if (key) {
    // Prefer explicit URL in icon
    if (/^https?:\/\//i.test(tool.icon)) {
      return { src: tool.icon, alt: `${tool.title} logo`, unoptimized: true };
    }
    // Local mapping by key with enhanced metadata
    const local = localLogoMap[key];
    if (local) return { src: local.src, alt: `${tool.title} logo`, metadata: local };
    // If icon looks like a local path already
    if (tool.icon?.startsWith("/")) return { src: tool.icon, alt: `${tool.title} logo` };
  }
  return { alt: `${tool.title} logo` };
}

function Paragraphs({ text }: { text?: string }) {
  if (!text) return null;
  // Enhanced text rendering with code blocks, lists, and better formatting
  const parts = text.split(/\n\n+/g);
  return (
    <div className="space-y-4 leading-relaxed text-white/85">
      {parts.map((part, i) => {
        // Handle code blocks
        if (part.trim().startsWith('```') && part.trim().endsWith('```')) {
          const code = part.replace(/```/g, '').trim();
          return (
            <pre key={i} className="overflow-x-auto rounded-lg bg-black/40 p-3 text-sm">
              <code className="text-cyan-300/90">{code}</code>
            </pre>
          );
        }
        
        // Handle bullet points
        if (part.includes('\n- ') || part.includes('\n• ')) {
          const lines = part.split('\n');
          const title = lines[0];
          const bullets = lines.slice(1).filter(line => line.trim().startsWith('- ') || line.trim().startsWith('• '));
          return (
            <div key={i} className="space-y-2">
              {title && <p className="font-medium text-white/95">{title}</p>}
              <ul className="ml-4 space-y-1 text-white/80">
                {bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 rounded-full bg-cyan-400/60 shrink-0" />
                    <span>{bullet.replace(/^[•-]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        
        // Regular paragraph with enhanced link rendering
        return (
          <p key={i} className="text-white/85">
            {part.split(/(https?:\/\/\S+)/g).map((chunk, j) =>
              /^https?:\/\//.test(chunk) ? (
                <a
                  key={j}
                  href={chunk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline decoration-cyan-400/60 underline-offset-4 hover:text-white hover:decoration-cyan-300 transition-colors"
                >
                  {chunk}
                  <span className="opacity-60">↗</span>
                </a>
              ) : (
                <span key={j}>{chunk}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function ToolsShowcase({ tools = [] }: ToolsShowcaseProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"order" | "title" | "category">("order");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based header effects
  const { scrollYProgress } = useScroll({ target: containerRef });
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -20]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
  // Mouse tracking for magical cursor effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const filtered = useMemo(() => {
    let result = tools.slice();
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(tool => 
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(tool => getToolCategory(tool) === selectedCategory);
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "title": return a.title.localeCompare(b.title);
        case "category": return getToolCategory(a).localeCompare(getToolCategory(b));
        case "order":
        default: return (a.order ?? 0) - (b.order ?? 0);
      }
    });
    
    return result;
  }, [tools, searchTerm, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map(getToolCategory)));
    return cats.sort();
  }, [tools]);

  if (!tools.length) return null;

  return (
    <section aria-labelledby="tools-title" className="relative" ref={containerRef}>
      {/* Magical floating orbs */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ x: springX, y: springY }}
      >
        <div 
          className="absolute size-64 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 blur-3xl"
          style={{
            transform: `translate(${springX.get() * 0.1}px, ${springY.get() * 0.1}px)`,
          }}
        />
        <div 
          className="absolute size-32 rounded-full bg-gradient-to-r from-pink-500/15 to-orange-500/15 blur-2xl"
          style={{
            transform: `translate(${springX.get() * -0.05}px, ${springY.get() * -0.05}px)`,
          }}
        />
      </motion.div>

      {/* Enhanced Section header with parallax */}
      <motion.div 
        className="mb-8 flex flex-col gap-6"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <div className="flex items-center gap-4">
          <div className="relative grid place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 p-[3px] shadow-[0_0_60px_-10px_rgba(34,211,238,0.8)]">
            <div className="rounded-full bg-black/60 p-3 backdrop-blur-sm">
              <BadgeCheck className="size-6 text-cyan-300" aria-hidden />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(34,211,238,0.3), transparent)",
              }}
            />
          </div>
          <div>
            <h2 id="tools-title" className="text-3xl font-bold text-white tracking-tight">
              Tools & Stack Behind This Portfolio
            </h2>
            <p className="text-white/70 mt-1 flex items-center gap-2">
              <Sparkles className="size-4" />
              Crafted with precision and passion
            </p>
          </div>
        </div>

        {/* Enhanced Filters and Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-sm"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-2 transition-all ${
                  viewMode === "grid" 
                    ? "bg-cyan-500/20 text-cyan-300" 
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <Grid3X3 className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-2 transition-all ${
                  viewMode === "list" 
                    ? "bg-cyan-500/20 text-cyan-300" 
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-all backdrop-blur-sm ${
                showFilters ? "bg-cyan-500/20 text-cyan-300" : "text-white/70 hover:text-white/90"
              }`}
            >
              <Filter className="size-4" />
              Filters
              {showFilters ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
            </button>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-3 overflow-hidden"
              >
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white focus:border-cyan-400/50 focus:outline-none backdrop-blur-sm"
                  >
                    <option value="all">All</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-black/90 text-white">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "order" | "title" | "category")}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white focus:border-cyan-400/50 focus:outline-none backdrop-blur-sm"
                  >
                    <option value="order" className="bg-black/90 text-white">Order</option>
                    <option value="title" className="bg-black/90 text-white">Title</option>
                    <option value="category" className="bg-black/90 text-white">Category</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <ArrowUpDown className="size-4" />
                  {filtered.length} of {tools.length} tools
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Enhanced Grid/List */}
      <motion.ul
        role="list"
        layout
        className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" 
            : "grid-cols-1"
        }`}
      >
        {filtered.map((tool: IToolDoc, idx: number) => {
          const logo = getLogo(tool);
          const isOpen = openKey === tool.key;
          const category = getToolCategory(tool);
          const categoryInfo = categoryColors[category];
          const CategoryIcon = categoryInfo.icon;
          
          return (
            <motion.li 
              key={tool.key} 
              className="list-none"
              layout
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20, 
                delay: Math.min(idx * 0.03, 0.2) 
              }}
            >
              <motion.article
                layout
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className={`group relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl overflow-hidden ${
                  viewMode === "list" ? "flex gap-6 items-center" : ""
                }`}
              >
                {/* Enhanced Glows and Effects */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100"
                     aria-hidden
                     style={{ 
                       background: `radial-gradient(800px 200px at top left, ${logo.metadata?.glow || "rgba(34,211,238,0.15)"}, transparent 60%)` 
                     }}
                />
                
                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                  animate={{ rotate: isOpen ? 360 : 0 }}
                  transition={{ duration: isOpen ? 4 : 2, ease: "linear", repeat: isOpen ? Infinity : 0 }}
                  style={{
                    background: "conic-gradient(from 0deg, transparent, rgba(34,211,238,0.2), transparent, rgba(139,92,246,0.2), transparent)",
                    padding: "1px",
                  }}
                >
                  <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02]" />
                </motion.div>

                {/* Category Badge */}
                <div className={`absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs backdrop-blur-sm ${categoryInfo.bg} z-10`}>
                  <CategoryIcon className="size-3" />
                  <span className={categoryInfo.text}>{category}</span>
                </div>

                {/* Header */}
                <div className={`flex items-center gap-4 ${viewMode === "list" ? "flex-1" : ""} ${viewMode === "grid" ? "pr-16" : ""}`}>
                  <motion.div 
                    className="relative size-16 shrink-0 grid place-items-center rounded-xl bg-black/40 ring-1 ring-white/10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {/* Enhanced logo container with dynamic gradients */}
                    <motion.div 
                      className="absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
                      style={{
                        background: logo.metadata?.color 
                          ? `linear-gradient(45deg, ${logo.metadata.color})` 
                          : "linear-gradient(45deg, rgba(34,211,238,0.3), rgba(139,92,246,0.3))"
                      }}
                      aria-hidden 
                    />
                    {logo.src ? (
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={48}
                          height={48}
                          className="relative select-none drop-shadow-lg"
                          priority={idx < 6}
                          unoptimized={logo.unoptimized}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Wrench className="size-8 text-white/70" aria-hidden />
                      </motion.div>
                    )}
                    
                    {/* Sparkle effects */}
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="size-4 text-cyan-300/80" />
                    </motion.div>
                  </motion.div>
                  
                  <div className="min-w-0 flex-1">
                    <motion.h3 
                      className="truncate text-lg font-bold text-white"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {tool.title}
                    </motion.h3>
                    {tool.summary && (
                      <p className="mt-1 line-clamp-2 text-sm text-white/75 leading-relaxed">
                        {tool.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className={`mt-6 flex items-center justify-between gap-3 ${viewMode === "list" ? "mt-0" : ""}`}>
                  <motion.div 
                    className="flex items-center gap-2 text-xs text-cyan-300/90"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Boxes className="size-4" aria-hidden />
                    <span className="font-medium">Used in portfolio</span>
                  </motion.div>
                  
                  <motion.button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenKey(isOpen ? null : tool.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group/btn relative overflow-hidden rounded-lg border border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 text-sm font-medium text-white/95 shadow-lg transition-all hover:border-cyan-400/40 hover:from-cyan-500/20 hover:to-violet-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 backdrop-blur-sm"
                  >
                    <span className="relative z-10">
                      {isOpen ? "Hide details" : "How I used it"}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 opacity-0 group-hover/btn:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>

                {/* Enhanced Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-black/20 p-4 backdrop-blur-sm"
                    >
                      <Paragraphs text={tool.content} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* No results state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="rounded-full bg-white/5 p-4 mb-4">
            <Search className="size-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white/80 mb-2">No tools found</h3>
          <p className="text-white/60 max-w-md">
            Try adjusting your search terms or filters to find what you&apos;re looking for.
          </p>
        </motion.div>
      )}
    </section>
  );
}
