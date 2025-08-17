"use client";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Calendar } from "lucide-react";
import type { IExperience } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, scaleVariants, formatDate } from "./utils";

export default function ExperienceSection({ experiences }: { experiences: IExperience[] }) {
  if (!experiences?.length) return null;
  return (
    <motion.section 
      id="experience" 
      variants={containerVariants} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true, margin: "-120px" }} 
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <motion.h2 variants={fadeUpVariants} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
        <BriefcaseBusiness className="size-6 text-cyan-400" /> Experience
      </motion.h2>
      
      <div className="space-y-6">
        {experiences.map((e, i) => (
          <motion.div 
            key={i} 
            variants={scaleVariants} 
            transition={{ delay: i * 0.1 }} 
            whileHover={{ scale: 1.01, y: -2 }} 
            className="group relative rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.02] to-white/[0.05] p-6 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            {/* Timeline dot */}
            <div className="absolute -left-3 top-6 h-6 w-6 rounded-full border-2 border-cyan-400 bg-gray-900 group-hover:bg-cyan-400 transition-colors duration-300">
              <div className="absolute inset-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Timeline line */}
            {i < experiences.length - 1 && (
              <div className="absolute -left-1 top-12 w-0.5 h-16 bg-gradient-to-b from-cyan-400/50 to-transparent"></div>
            )}
            
            <div className="ml-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {e.title}
                  </h3>
                  <p className="text-cyan-400 font-medium">{e.company}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/70">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                      <Calendar className="size-3 text-cyan-400" /> 
                      {formatDate(e.startDate)} – {formatDate(e.endDate)}
                    </span>
                    {e.location && (
                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">
                        📍 {e.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {e.description && (
                <div className="mt-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-white/90 leading-relaxed">{e.description}</p>
                </div>
              )}
              
              {e.bullets?.length ? (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {e.bullets.map((b, j) => (
                      <motion.li 
                        key={j} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-white/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
                        <span className="leading-relaxed">{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : null}
              
              {e.techStack?.length ? (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-cyan-300 mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {e.techStack.map((t, j) => (
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
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
