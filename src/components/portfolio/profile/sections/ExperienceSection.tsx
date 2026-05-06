"use client";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Calendar, MapPin } from "lucide-react";
import type { IExperience } from "@/interfaces/user.interface";
import {
  containerVariants,
  fadeUpVariants,
  scaleVariants,
  formatDate,
} from "./utils";

export default function ExperienceSection({
  experiences,
}: {
  experiences: IExperience[];
}) {
  if (!experiences?.length) return null;

  return (
    <motion.section
      id="experience"
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
        <BriefcaseBusiness className="size-6 text-slate-200" /> Experience
      </motion.h2>

      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            variants={scaleVariants}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="contrast-card group relative rounded-xl p-6 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/10"
          >
            <div className="absolute -left-3 top-6 h-6 w-6 rounded-full border-2 border-slate-300/30 bg-slate-950/95 transition-colors duration-300 group-hover:bg-white/20">
              <div className="absolute inset-1 rounded-full bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>

            {index < experiences.length - 1 && (
              <div className="absolute -left-1 top-12 h-16 w-0.5 bg-white/20"></div>
            )}

            <div className="ml-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-white">
                    {experience.title}
                  </h3>
                  <p className="font-medium text-slate-100">{experience.company}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <span className="contrast-pill inline-flex items-center gap-1.5 rounded-md px-2 py-1">
                      <Calendar className="size-3 text-slate-200" />
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </span>
                    {experience.location && (
                      <span className="contrast-pill inline-flex items-center gap-1.5 rounded-md px-2 py-1">
                        <MapPin className="size-3 text-slate-200" />
                        {experience.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {experience.description && (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="leading-relaxed text-white/90">
                    {experience.description}
                  </p>
                </div>
              )}

              {experience.bullets?.length ? (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-slate-200">
                    Key Achievements:
                  </h4>
                  <ul className="space-y-2">
                    {experience.bullets.map((bullet, bulletIndex) => (
                      <motion.li
                        key={bulletIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + bulletIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-white/85"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70"></span>
                        <span className="leading-relaxed">{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {experience.techStack?.length ? (
                <div className="mt-4">
                  <h4 className="mb-3 text-sm font-medium text-slate-200">
                    Technologies Used:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.techStack.map((tech, techIndex) => (
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
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
