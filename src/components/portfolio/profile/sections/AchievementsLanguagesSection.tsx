"use client";
import { motion } from "framer-motion";
import { Trophy, Languages as LanguagesIcon, ExternalLink, Calendar, Award, Star } from "lucide-react";
import type { IAchievements, ILanguages } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, scaleVariants, formatDate } from "./utils";

export default function AchievementsLanguagesSection({ achievements, languages }: { achievements: IAchievements[]; languages: ILanguages[] }) {
  if (!achievements?.length && !languages?.length) return null;

  const getLanguageProficiencyColor = (level: string) => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel.includes('native') || normalizedLevel.includes('fluent')) return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400';
    if (normalizedLevel.includes('advanced') || normalizedLevel.includes('proficient')) return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400';
    if (normalizedLevel.includes('intermediate')) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400';
    if (normalizedLevel.includes('basic') || normalizedLevel.includes('beginner')) return 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400';
    return 'from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400';
  };

  return (
    <motion.section 
      id="achievements" 
      variants={containerVariants} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true, margin: "-120px" }} 
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <motion.h2 variants={fadeUpVariants} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
        <Trophy className="size-6 text-cyan-400" /> Achievements & Languages
      </motion.h2>
      
      <div className="space-y-8">
        {/* Achievements Section - Full Width */}
        {achievements?.length && (
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white/90">
              <Award className="size-5 text-cyan-400" />
              Achievements
            </h3>
            
            <div className="space-y-4">
              {achievements.map((a, i) => (
                <motion.div 
                  key={i} 
                  variants={scaleVariants}
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.08] p-5 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/15"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 pl-6">
                      <h4 className="mb-2 text-base font-medium text-white group-hover:text-cyan-300 transition-colors">
                        {a.title}
                      </h4>
                      
                      {a.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-cyan-400" />
                          <span className="text-white/70 text-sm">
                            {formatDate(a.date)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {a.link && (
                      <motion.a 
                        href={a.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="View Achievement"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-500/20 text-cyan-400 hover:text-white hover:from-cyan-500/30 hover:to-blue-400/30 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200"
                      >
                        <ExternalLink className="size-4" />
                      </motion.a>
                    )}
                  </div>
                  
                  {/* Timeline dot indicator like experience section */}
                  <div className="absolute top-6 left-3 w-3 h-3 rounded-full bg-cyan-400 group-hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-400/30"></div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section - Full Width Bottom */}
        {languages?.length && (
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white/90">
              <LanguagesIcon className="size-5 text-cyan-400" />
              Languages
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {languages.map((l, i) => (
                <motion.div 
                  key={i} 
                  variants={scaleVariants}
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ scale: 1.02, y: -1 }} 
                  className={`group relative rounded-xl border p-4 transition-all duration-300 hover:shadow-lg bg-gradient-to-r ${getLanguageProficiencyColor(l.level)}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="flex items-center justify-center size-8 rounded-full bg-white/10 backdrop-blur-sm"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Star className="size-4 text-current" />
                      </motion.div>
                      
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-current transition-colors">
                          {l.name}
                        </h4>
                        <p className="text-sm text-white/70 group-hover:text-current/80 transition-colors">
                          {l.level}
                        </p>
                      </div>
                    </div>
                    
                    {/* Proficiency indicator */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, index) => {
                        const isActive = (() => {
                          const level = l.level.toLowerCase();
                          if (level.includes('native') || level.includes('fluent')) return index < 5;
                          if (level.includes('advanced') || level.includes('proficient')) return index < 4;
                          if (level.includes('intermediate')) return index < 3;
                          if (level.includes('basic') || level.includes('beginner')) return index < 2;
                          return index < 3;
                        })();
                        
                        return (
                          <motion.div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              isActive ? 'bg-current shadow-sm' : 'bg-white/20'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 + index * 0.05 }}
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
        )}
      </div>
    </motion.section>
  );
}
