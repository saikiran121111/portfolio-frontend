"use client";
import { motion } from "framer-motion";
import { GraduationCap, BadgeCheck, Link as LinkIcon, Calendar } from "lucide-react";
import type { IEducation, ICertifications } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, formatDate } from "./utils";

export default function EducationCertsSection({ education, certifications }: { education: IEducation[]; certifications: ICertifications[] }) {
  if (!education?.length && !certifications?.length) return null;
  return (
    <motion.section id="education" variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }} className="mt-8 grid gap-6 md:grid-cols-2">
      {education?.length ? (
        <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="size-5 text-cyan-300" /> Education
          </h2>
          <div className="space-y-4">
            {education.map((ed, i) => (
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

      {certifications?.length ? (
        <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BadgeCheck className="size-5 text-cyan-300" /> Certifications
          </h2>
          <div className="space-y-4">
            {certifications.map((c, i) => (
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
                    <a href={c.link} target="_blank" rel="noopener noreferrer" title="View Certificate" className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
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
  );
}
