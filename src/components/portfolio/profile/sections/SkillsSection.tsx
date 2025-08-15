"use client";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { containerVariants, fadeUpVariants, slideInRightVariants, mapSkillLevelToPercent, EASE_OUT } from "./utils";

export default function SkillsSection({ skillsByCat }: { skillsByCat: Array<[string, { name: string; level: string }[]]> }) {
  return (
    <motion.section id="skills" variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <BadgeCheck className="size-5 text-cyan-300" /> Skills
      </motion.h2>
      <div className="grid gap-6 md:grid-cols-2">
        {skillsByCat.map(([cat, items], catIndex) => (
          <motion.div key={cat} variants={slideInRightVariants} transition={{ delay: catIndex * 0.1 }}>
            <h3 className="mb-3 text-white/80 font-medium">{cat}</h3>
            <div className="space-y-3">
              {items.map((s, idx) => {
                const pct = mapSkillLevelToPercent(s.level);
                return (
                  <motion.div key={`${s.name}-${idx}`} className="group" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: catIndex * 0.1 + idx * 0.05 }} viewport={{ once: true }}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-white/90">{s.name}</span>
                      <span className="text-white/60">{s.level}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_16px_rgba(34,211,238,0.35)]" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE_OUT }} />
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
