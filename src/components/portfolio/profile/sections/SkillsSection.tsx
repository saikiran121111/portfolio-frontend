"use client";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { containerVariants, fadeUpVariants, slideInRightVariants, mapSkillLevelToPercent, EASE_OUT } from "./utils";

export default function SkillsSection({ skillsByCat }: { skillsByCat: Array<[string, { name: string; level: string }[]]> }) {
  return (
    <motion.section 
      id="skills" 
      variants={containerVariants} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true, margin: "-80px" }} 
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <motion.h2 variants={fadeUpVariants} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
        <BadgeCheck className="size-6 text-cyan-400" /> Skills
      </motion.h2>
      
      <div className="grid gap-8 md:grid-cols-2">
        {skillsByCat.map(([cat, items], catIndex) => (
          <motion.div 
            key={cat} 
            variants={slideInRightVariants} 
            transition={{ delay: catIndex * 0.1 }}
            className="space-y-5"
          >
            <h3 className="text-lg font-semibold text-cyan-300 border-b border-cyan-400/20 pb-2 mb-4">
              {cat}
            </h3>
            
            <div className="space-y-4">
              {items.map((s, idx) => {
                const pct = mapSkillLevelToPercent(s.level);
                return (
                  <motion.div 
                    key={`${s.name}-${idx}`} 
                    className="group" 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ delay: catIndex * 0.1 + idx * 0.05 }} 
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{s.name}</span>
                      <span className="px-2 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-400/30">
                        {s.level}
                      </span>
                    </div>
                    
                    <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
                      <motion.div 
                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30"
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${pct}%` }} 
                        viewport={{ once: true }} 
                        transition={{ 
                          duration: 1.5, 
                          ease: EASE_OUT, 
                          delay: catIndex * 0.1 + idx * 0.05 + 0.3 
                        }} 
                      />
                      
                      {/* Glow effect */}
                      <motion.div 
                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-400/50 to-blue-400/50 blur-sm"
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${pct}%` }} 
                        viewport={{ once: true }} 
                        transition={{ 
                          duration: 1.5, 
                          ease: EASE_OUT, 
                          delay: catIndex * 0.1 + idx * 0.05 + 0.3 
                        }} 
                      />
                    </div>
                    
                    {/* Percentage indicator */}
                    <div className="flex justify-end mt-1">
                      <motion.span 
                        className="text-xs text-cyan-400 font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: catIndex * 0.1 + idx * 0.05 + 0.8,
                          duration: 0.3 
                        }}
                      >
                        {pct}%
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
