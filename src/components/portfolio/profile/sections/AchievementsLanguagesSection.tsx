"use client";
import { motion } from "framer-motion";
import { Trophy, Languages as LanguagesIcon, ExternalLink, Calendar } from "lucide-react";
import type { IAchievements, ILanguages } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, formatDate } from "./utils";

export default function AchievementsLanguagesSection({ achievements, languages }: { achievements: IAchievements[]; languages: ILanguages[] }) {
  if (!achievements?.length && !languages?.length) return null;
  return (
    <motion.section id="achievements" variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }} className="mt-8 grid gap-6 md:grid-cols-2">
      {achievements?.length ? (
        <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Trophy className="size-5 text-cyan-300" /> Achievements
          </h2>
          <div className="space-y-4">
            {achievements.map((a, i) => (
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
                    <a href={a.link} target="_blank" rel="noopener noreferrer" title="Open" className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}

      {languages?.length ? (
        <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <LanguagesIcon className="size-5 text-cyan-300" /> Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((l, i) => (
              <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                {l.name} · <span className="text-white/60">{l.level}</span>
              </span>
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.section>
  );
}
