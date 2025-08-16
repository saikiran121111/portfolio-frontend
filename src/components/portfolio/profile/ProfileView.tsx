"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Globe,
  BriefcaseBusiness,
  GraduationCap,
  BadgeCheck,
  Trophy,
  ShieldCheck,
  ArrowUpRight,
  Menu,
} from "lucide-react";
import { fetchUserPortfolio } from "@/services/portfolio.service";
import type { IPortfolio } from "@/interfaces/portfolio.interface";
// Import shared utils and section components
import { classNames, containerVariants, fadeUpVariants, EASE_OUT } from "./sections/utils";
import HeaderCard from "./sections/HeaderCard";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import EducationCertsSection from "./sections/EducationCertsSection";
import AchievementsLanguagesSection from "./sections/AchievementsLanguagesSection";

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

  // Fixed, anchored drawer
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
        {/* Toggle Button */}
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

        {/* Navigation Panel */}
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
  const skillsByCat = useMemo((): Array<[string, { name: string; level: string }[]]> => {
    if (!data?.skills) return [];
    const g = new Map<string, { name: string; level: string }[]>();
    for (const s of data.skills) {
      const arr = g.get(s.category) ?? [];
      arr.push({ name: s.name, level: s.level });
      g.set(s.category, arr);
    }
    return Array.from(g.entries());
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
          <HeaderCard data={data} />

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
        <SkillsSection skillsByCat={skillsByCat} />

        {/* Experience */}
        <ExperienceSection experiences={data.experiences ?? []} />

        {/* Projects */}
        <ProjectsSection projects={data.projects ?? []} />

        {/* Education and Certifications */}
        <EducationCertsSection education={data.education ?? []} certifications={data.certifications ?? []} />

        {/* Achievements and Languages */}
        <AchievementsLanguagesSection achievements={data.achievements ?? []} languages={data.languages ?? []} />

      </div>

      {/* Navigation Tab */}
      <NavigationTab sections={navigationSections} />
    </>
  );
}
