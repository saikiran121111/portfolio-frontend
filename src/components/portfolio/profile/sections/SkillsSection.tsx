"use client";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { containerVariants, fadeUpVariants, slideInRightVariants, mapSkillLevelToPercent, EASE_OUT } from "./utils";

type SkillItem = { name: string; level: string };
type SkillCategory = [string, SkillItem[]];

function splitSkillColumns(skillsByCat: SkillCategory[]) {
  const columns: SkillCategory[][] = [[], []];
  const weights = [0, 0];

  for (const category of skillsByCat) {
    const [, items] = category;
    const targetColumn = weights[0] <= weights[1] ? 0 : 1;

    columns[targetColumn].push(category);
    // Include a small heading weight so short categories still balance well.
    weights[targetColumn] += items.length * 2 + 2;
  }

  return columns;
}

export default function SkillsSection({ skillsByCat }: { skillsByCat: Array<[string, { name: string; level: string }[]]> }) {
  const skillColumns = splitSkillColumns(skillsByCat);

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
        <BadgeCheck className="size-6 text-slate-200" /> Skills
      </motion.h2>
      
      <div className="grid gap-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-12">
        {skillColumns.map((column, columnIndex) => (
          <div key={`skills-column-${columnIndex}`} className="space-y-8">
            {column.map(([cat, items], catIndex) => {
              const categoryDelay = columnIndex * 0.08 + catIndex * 0.1;

              return (
                <motion.div 
                  key={cat} 
                  variants={slideInRightVariants} 
                  transition={{ delay: categoryDelay }}
                  className="space-y-5"
                >
                  <h3 className="mb-4 border-b border-white/10 pb-2 text-lg font-semibold text-slate-200">
                    {cat}
                  </h3>
                  
                  <div className="space-y-4">
                    {items.map((s, idx) => {
                      const pct = mapSkillLevelToPercent(s.level);
                      const itemDelay = categoryDelay + idx * 0.05;

                      return (
                        <motion.div 
                          key={`${s.name}-${idx}`} 
                          className="group" 
                          initial={{ opacity: 0, y: 20 }} 
                          whileInView={{ opacity: 1, y: 0 }} 
                          transition={{ delay: itemDelay }} 
                          viewport={{ once: true }}
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-white font-medium">{s.name}</span>
                            <span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-slate-200">
                              {s.level}
                            </span>
                          </div>
                          
                          <div className="relative h-2 overflow-hidden rounded-full border border-gray-700/50 bg-gray-800/50">
                            <motion.div 
                              className="absolute top-0 left-0 h-full rounded-full bg-white/30 shadow-lg shadow-white/10"
                              initial={{ width: 0 }} 
                              whileInView={{ width: `${pct}%` }} 
                              viewport={{ once: true }} 
                              transition={{ 
                                duration: 1.5, 
                                ease: EASE_OUT, 
                                delay: itemDelay + 0.3,
                              }} 
                            />
                            
                            {/* Glow effect */}
                            <motion.div 
                              className="absolute top-0 left-0 h-full rounded-full bg-white/20 blur-sm"
                              initial={{ width: 0 }} 
                              whileInView={{ width: `${pct}%` }} 
                              viewport={{ once: true }} 
                              transition={{ 
                                duration: 1.5, 
                                ease: EASE_OUT, 
                                delay: itemDelay + 0.3,
                              }} 
                            />
                          </div>
                          
                          {/* Percentage indicator */}
                          <div className="mt-1 flex justify-end">
                            <motion.span 
                              className="text-xs font-medium text-slate-200"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ 
                                delay: itemDelay + 0.8,
                                duration: 0.3, 
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
              );
            })}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
