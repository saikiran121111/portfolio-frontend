"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
    transition: { staggerChildren: 0.08 },
  },
} as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
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
      {items.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          title={label}
        >
          <Icon className="size-4" />
          <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
        </a>
      ))}
    </div>
  );
}

export default function ProfileView() {
  const [data, setData] = useState<IPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="container mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_.7fr]"
      >
        <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{data.name}</h1>
              {data.headline && <p className="mt-1 text-white/70">{data.headline}</p>}
            </div>
            <SocialIcon socials={data.socials} />
          </div>
          {data.summary && <p className="mt-4 text-white/80 leading-relaxed">{data.summary}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
            {data.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-cyan-300" /> {data.location}
              </span>
            )}
            {data.email && (
              <a className="inline-flex items-center gap-2 hover:text-white" href={`mailto:${data.email}`}>
                <Mail className="size-4 text-cyan-300" /> {data.email}
              </a>
            )}
            {data.phone && (
              <a className="inline-flex items-center gap-2 hover:text-white" href={`tel:${data.phone}`}>
                <Phone className="size-4 text-cyan-300" /> {data.phone}
              </a>
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
          {skillsByCat.map(([cat, items]) => (
            <motion.div key={cat} variants={fadeUpVariants}>
              <h3 className="mb-3 text-white/80 font-medium">{cat}</h3>
              <div className="space-y-3">
                {items.map((s, idx) => {
                  const pct = mapSkillLevelToPercent(s.level);
                  return (
                    <div key={`${s.name}-${idx}`} className="group">
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
                    </div>
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
              <motion.div key={i} variants={fadeUpVariants} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
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
              <motion.div key={i} variants={fadeUpVariants} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
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
  );
}
