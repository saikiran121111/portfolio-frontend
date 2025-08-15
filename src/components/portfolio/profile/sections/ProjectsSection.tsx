"use client";
import { motion } from "framer-motion";
import { Github, ExternalLink, Globe, Calendar } from "lucide-react";
import type { IProjects } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, scaleVariants, formatDate } from "./utils";

export default function ProjectsSection({ projects }: { projects: IProjects[] }) {
  if (!projects?.length) return null;
  return (
    <motion.section id="projects" variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Globe className="size-5 text-cyan-300" /> Projects
      </motion.h2>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.div key={i} variants={scaleVariants} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.03, y: -6 }} className="rounded-xl border border-white/10 bg-white/[.03] p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
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
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" title="Repository" className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                    <Github className="size-4" />
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo" className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
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
  );
}
