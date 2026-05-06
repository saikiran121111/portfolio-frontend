"use client";
import { motion } from "framer-motion";
import {
  Trophy,
  Languages as LanguagesIcon,
  ExternalLink,
  Calendar,
  Award,
  Star,
} from "lucide-react";
import type { IAchievements, ILanguages } from "@/interfaces/user.interface";
import {
  containerVariants,
  fadeUpVariants,
  scaleVariants,
  formatDate,
} from "./utils";

function getLanguageTone(level: string) {
  const normalized = level.toLowerCase();

  if (normalized.includes("native") || normalized.includes("fluent")) {
    return "contrast-card border-emerald-400/25 text-emerald-100";
  }

  if (normalized.includes("advanced") || normalized.includes("proficient")) {
    return "contrast-card border-cyan-400/25 text-cyan-100";
  }

  if (normalized.includes("basic") || normalized.includes("beginner")) {
    return "contrast-card border-amber-400/25 text-amber-100";
  }

  return "contrast-card border-violet-400/20 text-slate-100";
}

export default function AchievementsLanguagesSection({
  achievements,
  languages,
}: {
  achievements: IAchievements[];
  languages: ILanguages[];
}) {
  if (!achievements?.length && !languages?.length) return null;

  return (
    <motion.section
      id="achievements"
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
        <Trophy className="size-6 text-slate-200" /> Achievements & Languages
      </motion.h2>

      <div className="space-y-8">
        {achievements?.length ? (
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white/90">
              <Award className="size-5 text-slate-200" />
              Achievements
            </h3>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={scaleVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="contrast-card group relative rounded-xl p-5 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 pl-6">
                      <h4 className="mb-2 text-base font-medium text-white">
                        {achievement.title}
                      </h4>

                      {achievement.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-slate-200" />
                          <span className="text-sm text-white/80">
                            {formatDate(achievement.date)}
                          </span>
                        </div>
                      )}
                    </div>

                    {achievement.link && (
                      <motion.a
                        href={achievement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Achievement"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="contrast-pill inline-flex size-10 items-center justify-center rounded-full text-slate-200 transition-all duration-200 hover:border-white/30 hover:text-white"
                      >
                        <ExternalLink className="size-4" />
                      </motion.a>
                    )}
                  </div>

                  <div className="absolute left-3 top-6 h-3 w-3 rounded-full bg-white/70 shadow-lg shadow-white/10 transition-colors group-hover:bg-white/90"></div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}

        {languages?.length ? (
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white/90">
              <LanguagesIcon className="size-5 text-slate-200" />
              Languages
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {languages.map((language, index) => (
                <motion.div
                  key={index}
                  variants={scaleVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  className={`group relative rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${getLanguageTone(language.level)}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="contrast-pill flex size-8 items-center justify-center rounded-full"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Star className="size-4 text-current" />
                      </motion.div>

                      <div>
                        <h4 className="font-semibold text-white transition-colors group-hover:text-current">
                          {language.name}
                        </h4>
                        <p className="text-sm text-white/80 transition-colors group-hover:text-current/80">
                          {language.level}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(5)].map((_, dotIndex) => {
                        const isActive = (() => {
                          const level = language.level.toLowerCase();
                          if (level.includes("native") || level.includes("fluent")) return dotIndex < 5;
                          if (level.includes("advanced") || level.includes("proficient")) return dotIndex < 4;
                          if (level.includes("intermediate")) return dotIndex < 3;
                          if (level.includes("basic") || level.includes("beginner")) return dotIndex < 2;
                          return dotIndex < 3;
                        })();

                        return (
                          <motion.div
                            key={dotIndex}
                            className={`h-2 w-2 rounded-full transition-all duration-200 ${
                              isActive ? "bg-current shadow-sm" : "bg-white/20"
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + dotIndex * 0.05 }}
                            whileHover={{ scale: 1.2 }}
                          />
                        );
                      })}
                    </div>
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
