"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  BadgeCheck,
  Link as LinkIcon,
  Calendar,
  Award,
  School,
  BookOpen,
} from "lucide-react";
import type {
  IEducation,
  ICertifications,
} from "@/interfaces/user.interface";
import {
  containerVariants,
  fadeUpVariants,
  scaleVariants,
  formatDate,
} from "./utils";

export default function EducationCertsSection({
  education,
  certifications,
}: {
  education: IEducation[];
  certifications: ICertifications[];
}) {
  if (!education?.length && !certifications?.length) return null;

  const educationGridClass =
    education.length > 1 ? "grid gap-4 xl:grid-cols-2" : "grid gap-4";
  const certificationGridClass =
    certifications.length > 1 ? "grid gap-4 xl:grid-cols-2" : "grid gap-4";

  return (
    <motion.section
      id="education"
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
        <GraduationCap className="size-6 text-slate-200" />
        Education & Certifications
      </motion.h2>

      <div className="space-y-8">
        {education?.length ? (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white/90">
              <School className="size-5 text-slate-200" />
              Education
            </h3>

            <div className={educationGridClass}>
              {education.map((item, index) => (
                <motion.div
                  key={`${item.institution}-${item.degree}-${index}`}
                  variants={scaleVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="contrast-card group relative rounded-xl p-5 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/10"
                >
                  <h4 className="mb-2 text-lg font-semibold text-white">
                    {item.degree}
                  </h4>

                  <div className="mb-2 flex items-center gap-2">
                    <School className="size-4 text-slate-200" />
                    <span className="font-medium text-white/85">
                      {item.institution}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <Calendar className="size-4 text-slate-200" />
                    <span className="text-sm text-white/80">
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </span>
                  </div>

                  {item.field ? (
                    <div className="contrast-pill mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
                      <BookOpen className="size-3 text-slate-200" />
                      {item.field}
                    </div>
                  ) : null}

                  {item.description ? (
                    <p className="text-sm leading-relaxed text-white/85">
                      {item.description}
                    </p>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}

        {certifications?.length ? (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white/90">
              <BadgeCheck className="size-5 text-slate-200" />
              Certifications
            </h3>

            <div className={certificationGridClass}>
              {certifications.map((item, index) => (
                <motion.div
                  key={`${item.title}-${item.issuer}-${index}`}
                  variants={scaleVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="contrast-card group relative rounded-xl p-5 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="mb-2 text-lg font-semibold text-white">
                        {item.title}
                      </h4>

                      <div className="mb-2 flex items-center gap-2">
                        <Award className="size-4 text-slate-200" />
                        <span className="font-medium text-white/85">
                          {item.issuer}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-slate-200" />
                        <span className="text-sm text-white/80">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>

                    {item.link ? (
                      <motion.a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Certificate"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="contrast-pill inline-flex size-10 items-center justify-center rounded-full text-slate-200 transition-all duration-200 hover:border-white/30 hover:text-white"
                      >
                        <LinkIcon className="size-4" />
                      </motion.a>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
