"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  BriefcaseBusiness,
  GraduationCap,
  BadgeCheck,
  Trophy,
  ShieldCheck,
  Languages as LanguagesIcon,
  ArrowUpRight,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Menu,
  Copy,
  Check,
} from "lucide-react";
import { fetchUserPortfolio } from "@/services/portfolio.service";
import type { IPortfolio, ISocials } from "@/interfaces/portfolio.interface";
import type { ISummary } from "@/interfaces/user.interface";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Cubic-bezier easeOut like feel
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Framer Motion variants moved out of hooks to avoid hook-order changes on Fast Refresh
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.1
    },
  },
} as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: EASE_OUT 
    } 
  },
} as const;

const slideInRightVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.5, 
      ease: EASE_OUT 
    } 
  },
} as const;

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.4, 
      ease: EASE_OUT 
    } 
  },
} as const;

function mapSkillLevelToPercent(level: string): number {
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

function formatDate(d?: Date | null) {
  if (!d) return "Present";
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short" }).format(new Date(d));
  } catch {
    return String(d);
  }
}

function SocialIcon({ socials, className }: { socials?: ISocials; className?: string }) {
  if (!socials) return null;
  const items = [
    socials.github && { href: socials.github, label: "GitHub", Icon: Github },
    socials.linkedin && { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
    socials.portfolio && { href: socials.portfolio, label: "Portfolio", Icon: Globe },
  ].filter(Boolean) as Array<{ href: string; label: string; Icon: React.ComponentType<{ className?: string }> }>;

  if (!items.length) return null;
  return (
    <div className={classNames("flex items-center gap-3", className)}>
      {items.map(({ href, label, Icon }, index) => (
        <motion.a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          title={label}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="size-4" />
          <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
        </motion.a>
      ))}
    </div>
  );
}

// Copy Button Component
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className="ml-2 relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 text-white/60 hover:text-cyan-300 transition-all duration-200 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={copied ? "Copied!" : `Copy ${label}`}
    >
      <motion.div
        animate={copied ? { scale: [1, 1.2, 1], rotate: [0, 360, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {copied ? (
          <Check className="size-4 text-green-400" />
        ) : (
          <Copy className="size-4 group-hover:text-cyan-300" />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <motion.div
        className={classNames(
          "absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap text-xs font-medium border transition-all duration-200",
          copied 
            ? "bg-green-500/90 text-white border-green-400/50 opacity-100" 
            : "bg-gray-900/90 text-white border-white/20 opacity-0 group-hover:opacity-100"
        )}
        initial={{ opacity: 0, y: 5, scale: 0.8 }}
        animate={copied 
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 5, scale: 0.8 }
        }
        transition={{ duration: 0.2 }}
      >
        {copied ? "✓ Copied!" : `Copy ${label}`}
        <div className={classNames(
          "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent",
          copied ? "border-t-green-500/90" : "border-t-gray-900/90"
        )}></div>
      </motion.div>
    </motion.button>
  );
}

// Navigation Tab Component
function NavigationTab({ sections }: { sections: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }> }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isTabOpen, setIsTabOpen] = useState(false);

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
    setIsTabOpen(false);
  };

  // Fixed, anchored drawer: width equals the panel width. We translate the whole drawer by its
  // own width when closed, so the button (attached to its left edge) remains perfectly flush
  // with the viewport's right edge in both states.
  const PANEL_WIDTH = 288; // w-72

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.6, ease: EASE_OUT }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
    >
      {/* Drawer track (anchored to right). When closed, shift by +100% (panel width). */}
      <motion.div
        className="relative w-72 pointer-events-auto"
        style={{ width: PANEL_WIDTH }}
        initial={false}
        animate={{ x: isTabOpen ? 0 : PANEL_WIDTH }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        {/* Toggle Button: absolutely attached to drawer's left edge so it rides with the panel */}
        <motion.button
          onClick={() => setIsTabOpen(!isTabOpen)}
          aria-label={isTabOpen ? "Close quick navigation" : "Open quick navigation"}
          className={classNames(
            "absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center justify-center w-14 h-14 backdrop-blur-xl transition-all duration-300 shadow-lg border border-white/20 z-10",
            isTabOpen
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border-cyan-500/30 shadow-cyan-500/20 rounded-l-2xl"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:shadow-xl rounded-l-2xl"
          )}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          animate={isTabOpen ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <motion.div animate={{ rotate: isTabOpen ? 90 : 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
            <Menu className="size-5" />
          </motion.div>
        </motion.button>

        {/* Navigation Panel: flush with right edge when open */}
        <motion.div
          initial={false}
          animate={{ opacity: isTabOpen ? 1 : 1 }}
          className="max-w-[min(288px,calc(100vw-120px))] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 border-l-0 rounded-l-2xl shadow-2xl shadow-black/40 relative overflow-hidden"
          style={{ width: PANEL_WIDTH }}
        >
          <motion.div
            className="p-6"
            initial={false}
            animate={isTabOpen ? { opacity: 1, y: 0 } : { opacity: 0.85, y: 4 }}
            transition={{ duration: 0.25 }}
          >
            <motion.h3
              className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2"
              initial={false}
              animate={isTabOpen ? { opacity: 1, x: 0 } : { opacity: 0.9, x: -6 }}
              transition={{ duration: 0.25 }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Quick Navigation
            </motion.h3>
            <nav className="space-y-1">
              {sections.map(({ id, label, icon: Icon }, index) => (
                <motion.button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={classNames(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group",
                    activeSection === id
                      ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                      : "text-white/70 hover:text-white hover:bg-white/10 hover:shadow-md"
                  )}
                  initial={false}
                  animate={isTabOpen ? { opacity: 1, x: 0, transition: { delay: 0.05 + index * 0.04 } } : { opacity: 0.85, x: -8 }}
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <Icon className="size-4 flex-shrink-0" />
                  </motion.div>
                  <span className="truncate font-medium">{label}</span>
                  {activeSection === id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 rounded-full bg-cyan-400 ml-auto shadow-lg shadow-cyan-400/50"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                  <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity" initial={false} whileHover={{ x: 2 }}>
                    <ArrowUpRight className="size-3" />
                  </motion.div>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function ProfileView() {
  const [data, setData] = useState<IPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll hooks - must be called unconditionally
  const { scrollY, scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.98]);

  // Define navigation sections based on available data
  const navigationSections = useMemo(() => {
    if (!data) return [];
    
    const sections = [
      { id: "header", label: "Profile", icon: MapPin },
      { id: "skills", label: "Skills", icon: BadgeCheck },
    ];

    if (data.experiences?.length) {
      sections.push({ id: "experience", label: "Experience", icon: BriefcaseBusiness });
    }
    if (data.projects?.length) {
      sections.push({ id: "projects", label: "Projects", icon: Globe });
    }
    if (data.education?.length || data.certifications?.length) {
      sections.push({ id: "education", label: "Education & Certifications", icon: GraduationCap });
    }
    if (data.achievements?.length || data.languages?.length) {
      sections.push({ id: "achievements", label: "Achievements & Languages", icon: Trophy });
    }
    if (data.scanReports?.length) {
      sections.push({ id: "reports", label: "Security Reports", icon: ShieldCheck });
    }

    return sections;
  }, [data]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await fetchUserPortfolio({ cache: "no-store" });
        if (!mounted) return;
        setData(p);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : "Failed to load profile";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Group skills by category (must be defined before any early returns)
  const skillsByCat = useMemo(() => {
    const groups: Array<[string, { name: string; level: string }[]]> = [];
    if (data?.skills) {
      const g = new Map<string, { name: string; level: string }[]>();
      for (const s of data.skills) {
        const arr = g.get(s.category) ?? [];
        arr.push({ name: s.name, level: s.level });
        g.set(s.category, arr);
      }
      for (const entry of g.entries()) groups.push(entry);
    }
    return groups;
  }, [data?.skills]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="animate-pulse grid gap-6">
          <div className="h-24 rounded-lg bg-white/10" />
          <div className="h-48 rounded-lg bg-white/10" />
          <div className="h-64 rounded-lg bg-white/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const mapSrc = data.location
    ? `https://www.google.com/maps?q=${encodeURIComponent(data.location)}&output=embed&z=12`
    : null;

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 z-50 origin-left shadow-lg shadow-cyan-500/50"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />
      
      <div ref={containerRef} className="container mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <motion.section
          id="header"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ opacity: headerOpacity, scale: headerScale }}
          className="grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_.7fr]"
        >
        <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <motion.div 
            className="flex flex-wrap items-center justify-between gap-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <motion.h1 
                className="text-2xl md:text-3xl font-semibold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {data.name}
              </motion.h1>
              {data.headline && (
                <motion.p 
                  className="mt-1 text-white/70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {data.headline}
                </motion.p>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <SocialIcon socials={data.socials} />
            </motion.div>
          </motion.div>
          {data.summary && <p className="mt-4 text-white/80 leading-relaxed">{data.summary}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
            {data.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-cyan-300" /> {data.location}
              </span>
            )}
            {data.email && (
              <div className="inline-flex items-center gap-2 group">
                <a className="inline-flex items-center gap-2 hover:text-white transition-colors" href={`mailto:${data.email}`}>
                  <Mail className="size-4 text-cyan-300" /> {data.email}
                </a>
                <CopyButton text={data.email} label="email" />
              </div>
            )}
            {data.phone && (
              <div className="inline-flex items-center gap-2 group">
                <a className="inline-flex items-center gap-2 hover:text-white transition-colors" href={`tel:${data.phone}`}>
                  <Phone className="size-4 text-cyan-300" /> {data.phone}
                </a>
                <CopyButton text={data.phone} label="phone" />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeUpVariants} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          {mapSrc ? (
            <iframe
              title="Location Map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full md:h-full"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-white/60">No location provided</div>
          )}
        </motion.div>
      </motion.section>

        {/* Skills */}
        <motion.section
          id="skills"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BadgeCheck className="size-5 text-cyan-300" /> Skills
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {skillsByCat.map(([cat, items], catIndex) => (
              <motion.div 
                key={cat} 
                variants={slideInRightVariants}
                transition={{ delay: catIndex * 0.1 }}
              >
                <h3 className="mb-3 text-white/80 font-medium">{cat}</h3>
                <div className="space-y-3">
                  {items.map((s, idx) => {
                    const pct = mapSkillLevelToPercent(s.level);
                    return (
                      <motion.div 
                        key={`${s.name}-${idx}`} 
                        className="group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (catIndex * 0.1) + (idx * 0.05) }}
                        viewport={{ once: true }}
                      >
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-white/90">{s.name}</span>
                          <span className="text-white/60">{s.level}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: EASE_OUT }}
                          />
                        </div>
                      </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Experience */}
      {data.experiences?.length ? (
        <motion.section
          id="experience"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BriefcaseBusiness className="size-5 text-cyan-300" /> Experience
          </motion.h2>
          <div className="space-y-6">
            {data.experiences.map((e, i) => (
              <motion.div 
                key={i} 
                variants={scaleVariants}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-xl border border-white/10 bg-white/[.03] p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium">
                      {e.title} · <span className="text-white/70">{e.company}</span>
                    </h3>
                    <div className="mt-1 text-sm text-white/70 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" /> {formatDate(e.startDate)} – {formatDate(e.endDate)}
                      </span>
                      {e.location && <span>• {e.location}</span>}
                    </div>
                  </div>
                </div>
                {e.description && <p className="mt-3 text-white/80">{e.description}</p>}
                {e.bullets?.length ? (
                  <ul className="mt-3 list-disc pl-5 text-white/80 space-y-1">
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}
                {e.techStack?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.techStack.map((t, j) => (
                      <span key={j} className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/80">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.section>
      ) : null}

      {/* Projects */}
      {data.projects?.length ? (
        <motion.section
          id="projects"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Globe className="size-5 text-cyan-300" /> Projects
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {data.projects.map((p, i) => (
              <motion.div 
                key={i} 
                variants={scaleVariants}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -6 }}
                className="rounded-xl border border-white/10 bg-white/[.03] p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      <Calendar className="mr-1 inline size-3 align-[-2px]" />
                      {formatDate(p.startDate)} – {formatDate(p.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Repository"
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                      >
                        <Github className="size-4" />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Live Demo"
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-white/80">{p.description}</p>
                {p.highlights?.length ? (
                  <ul className="mt-3 list-disc pl-5 text-white/80 space-y-1">
                    {p.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                ) : null}
                {p.tech?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tech.map((t, j) => (
                      <span key={j} className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/80">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.section>
      ) : null}

      {/* Education and Certifications */}
      {(data.education?.length || data.certifications?.length) ? (
        <motion.section
          id="education"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-8 grid gap-6 md:grid-cols-2"
        >
          {data.education?.length ? (
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <GraduationCap className="size-5 text-cyan-300" /> Education
              </h2>
              <div className="space-y-4">
                {data.education.map((ed, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                    <h3 className="font-medium">
                      {ed.degree} · <span className="text-white/70">{ed.institution}</span>
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      <Calendar className="mr-1 inline size-3 align-[-2px]" />
                      {formatDate(ed.startDate)} – {formatDate(ed.endDate)}
                    </p>
                    {ed.field && <p className="mt-2 text-white/80">{ed.field}</p>}
                    {ed.description && <p className="mt-2 text-white/80">{ed.description}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          {data.certifications?.length ? (
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <BadgeCheck className="size-5 text-cyan-300" /> Certifications
              </h2>
              <div className="space-y-4">
                {data.certifications.map((c, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">
                          {c.title} · <span className="text-white/70">{c.issuer}</span>
                        </h3>
                        <p className="mt-1 text-sm text-white/70">
                          <Calendar className="mr-1 inline size-3 align-[-2px]" />
                          {formatDate(c.date)}
                        </p>
                      </div>
                      {c.link && (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Certificate"
                          className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                        >
                          <LinkIcon className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </motion.section>
      ) : null}

      {/* Achievements and Languages */}
      {(data.achievements?.length || data.languages?.length) ? (
        <motion.section
          id="achievements"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-8 grid gap-6 md:grid-cols-2"
        >
          {data.achievements?.length ? (
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Trophy className="size-5 text-cyan-300" /> Achievements
              </h2>
              <div className="space-y-4">
                {data.achievements.map((a, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{a.title}</h3>
                        {a.date && (
                          <p className="mt-1 text-sm text-white/70">
                            <Calendar className="mr-1 inline size-3 align-[-2px]" />
                            {formatDate(a.date)}
                          </p>
                        )}
                      </div>
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open"
                          className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          {data.languages?.length ? (
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <LanguagesIcon className="size-5 text-cyan-300" /> Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((l, i) => (
                  <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                    {l.name} · <span className="text-white/60">{l.level}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          ) : null}
        </motion.section>
      ) : null}

      {/* Scan Reports */}
      {data.scanReports?.length ? (
        <motion.section
          id="reports"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="size-5 text-cyan-300" /> Security & Quality Reports
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {data.scanReports.map((r, i) => (
              <motion.div key={i} variants={fadeUpVariants} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{r.type}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      Ran on {formatDate(r.runAt)}
                      {r.commitSha ? ` · ${r.commitSha.slice(0, 7)}` : ""}
                    </p>
                  </div>
                  {r.artifactUrl && (
                    <a
                      href={r.artifactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Report"
                      className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
                {r.summary ? (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {(() => {
                      const s = r.summary as ISummary;
                      return (
                        <>
                          {s.bugs !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              Bugs: <span className="font-medium">{s.bugs}</span>
                            </div>
                          )}
                          {s.vulnerabilities !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              Vulns: <span className="font-medium">{s.vulnerabilities}</span>
                            </div>
                          )}
                          {s.codeSmells !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              Code Smells: <span className="font-medium">{s.codeSmells}</span>
                            </div>
                          )}
                          {s.coverage !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              Coverage: <span className="font-medium">{s.coverage}%</span>
                            </div>
                          )}
                          {s.qualityGate !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              Quality Gate: <span className="font-medium">{s.qualityGate}</span>
                            </div>
                          )}
                          {s.low !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              Low: <span className="font-medium">{s.low}</span>
                            </div>
                          )}
                          {s.medium !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              Medium: <span className="font-medium">{s.medium}</span>
                            </div>
                          )}
                          {s.high !== undefined && (
                            <div className="rounded-lg bg-white/10 px-3 py-2">
                              High: <span className="font-medium">{s.high}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.section>
      ) : null}
      </div>

      {/* Navigation Tab */}
      <NavigationTab sections={navigationSections} />
    </>
  );
}
