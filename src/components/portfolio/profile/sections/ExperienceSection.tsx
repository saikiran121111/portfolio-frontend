"use client";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Calendar } from "lucide-react";
import type { IExperience } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, scaleVariants, formatDate } from "./utils";

export default function ExperienceSection({ experiences }: { experiences: IExperience[] }) {
  if (!experiences?.length) return null;
  return (
    <motion.section id="experience" variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <BriefcaseBusiness className="size-5 text-cyan-300" /> Experience
      </motion.h2>
      <div className="space-y-6">
        {experiences.map((e, i) => (
          <motion.div key={i} variants={scaleVariants} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02, y: -4 }} className="rounded-xl border border-white/10 bg-white/[.03] p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
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
  );
}
