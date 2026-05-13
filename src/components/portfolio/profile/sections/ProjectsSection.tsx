"use client";
import { motion } from "framer-motion";
import { Github, ExternalLink, Globe, Calendar } from "lucide-react";
import type { IProjects } from "@/interfaces/user.interface";
import {
  containerVariants,
  fadeUpVariants,
  scaleVariants,
  formatDate,
} from "./utils";

export default function ProjectsSection({
  projects,
}: {
  projects: IProjects[];
}) {
  const visibleProjects = projects?.filter((project) => project.isVisible !== false) ?? [];

  if (!visibleProjects.length) return null;

  return (
    <motion.section
      id="projects"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="contrast-surface mt-8 rounded-2xl p-6"
    >
      <motion.h2
        variants={fadeUpVariants}
        className="mb-6 flex items-center gap-2 text-xl font-bold text-white"
      >
        <Globe className="size-6 text-slate-200" /> Projects
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-2">
        {visibleProjects.map((project, index) => (
          <motion.div
            key={index}
            variants={scaleVariants}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="contrast-card group relative rounded-xl p-6 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/10"
          >
            <div className="absolute right-4 top-4 flex items-center gap-2">
              {project.repoUrl && (
                <motion.a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Repository"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="contrast-pill inline-flex size-10 items-center justify-center rounded-full text-white/85 transition-all duration-200 hover:border-white/30 hover:text-white"
                >
                  <Github className="size-4" />
                </motion.a>
              )}
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Live Demo"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="contrast-pill inline-flex size-10 items-center justify-center rounded-full text-white/85 transition-all duration-200 hover:border-white/30 hover:text-white"
                >
                  <ExternalLink className="size-4" />
                </motion.a>
              )}
              {project.projectUrl &&
                project.projectUrl !== project.repoUrl &&
                project.projectUrl !== project.liveUrl && (
                  <motion.a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={project.type || "Project"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="contrast-pill inline-flex size-10 items-center justify-center rounded-full text-white/85 transition-all duration-200 hover:border-white/30 hover:text-white"
                  >
                    <ExternalLink className="size-4" />
                  </motion.a>
                )}
            </div>

            <div className="pr-20">
              <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-white">
                {project.title}
              </h3>

              <div className="contrast-pill mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-white/80">
                <Calendar className="size-3 text-slate-200" />
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </div>
            </div>

            {project.description && (
              <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="leading-relaxed text-white/90">
                  {project.description}
                </p>
              </div>
            )}

            {project.highlights?.length ? (
              <div className="mt-4">
                <h4 className="mb-3 text-sm font-medium text-slate-200">
                  Key Features:
                </h4>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <motion.li
                      key={highlightIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + highlightIndex * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 text-white/85"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70"></span>
                      <span className="leading-relaxed">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.tech?.length ? (
              <div className="mt-4">
                <h4 className="mb-3 text-sm font-medium text-slate-200">
                  Technologies:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + techIndex * 0.02 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className="contrast-pill rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:border-white/30 hover:bg-white/10"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/[0.03] to-white/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
