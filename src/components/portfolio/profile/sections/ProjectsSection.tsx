"use client";
import { motion } from "framer-motion";
import { Github, ExternalLink, Globe, Calendar } from "lucide-react";
import type { IProjects } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, scaleVariants, formatDate } from "./utils";

export default function ProjectsSection({ projects }: { projects: IProjects[] }) {
  if (!projects?.length) return null;
  return (
    <motion.section 
      id="projects" 
      variants={containerVariants} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true, margin: "-120px" }} 
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <motion.h2 variants={fadeUpVariants} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
        <Globe className="size-6 text-cyan-400" /> Projects
      </motion.h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.div 
            key={i} 
            variants={scaleVariants} 
            transition={{ delay: i * 0.1 }} 
            whileHover={{ scale: 1.02, y: -4 }} 
            className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.08] p-6 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/15"
          >
            {/* Project status indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {p.repoUrl && (
                <motion.a 
                  href={p.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Repository"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-gray-600/20 to-gray-500/20 text-white/70 hover:text-white hover:from-gray-500/30 hover:to-gray-400/30 border border-gray-500/20 hover:border-gray-400/40 transition-all duration-200"
                >
                  <Github className="size-4" />
                </motion.a>
              )}
              {p.liveUrl && (
                <motion.a 
                  href={p.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Live Demo"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:text-cyan-200 hover:from-cyan-400/30 hover:to-blue-400/30 border border-cyan-400/30 hover:border-cyan-300/50 transition-all duration-200"
                >
                  <ExternalLink className="size-4" />
                </motion.a>
              )}
            </div>
            
            <div className="pr-20">
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                {p.title}
              </h3>
              
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                <Calendar className="size-3 text-cyan-400" />
                {formatDate(p.startDate)} – {formatDate(p.endDate)}
              </div>
            </div>
            
            {p.description && (
              <div className="mt-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-white/90 leading-relaxed">{p.description}</p>
              </div>
            )}
            
            {p.highlights?.length ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-cyan-300 mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {p.highlights.map((h, j) => (
                    <motion.li 
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
                      <span className="leading-relaxed">{h}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : null}
            
            {p.tech?.length ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-cyan-300 mb-3">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t, j) => (
                    <motion.span 
                      key={j}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + j * 0.02 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300 border border-cyan-400/20 rounded-full hover:border-cyan-400/40 hover:bg-cyan-500/20 transition-all duration-200"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : null}
            
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/[0.02] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
