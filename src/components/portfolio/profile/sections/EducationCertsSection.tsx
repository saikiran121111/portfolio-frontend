"use client";
import { motion } from "framer-motion";
import { GraduationCap, BadgeCheck, Link as LinkIcon, Calendar, Award, School, BookOpen } from "lucide-react";
import type { IEducation, ICertifications } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, scaleVariants, formatDate } from "./utils";

export default function EducationCertsSection({ education, certifications }: { education: IEducation[]; certifications: ICertifications[] }) {
  if (!education?.length && !certifications?.length) return null;
  
  return (
    <motion.section 
      id="education" 
      variants={containerVariants} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true, margin: "-120px" }} 
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <motion.h2 variants={fadeUpVariants} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
        <GraduationCap className="size-6 text-cyan-400" /> Education & Certifications
      </motion.h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Education Column */}
        {education?.length && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white/90">
              <School className="size-5 text-cyan-400" />
              Education
            </h3>
            
            <div className="space-y-4">
              {education.map((ed, i) => (
                <motion.div 
                  key={i} 
                  variants={scaleVariants}
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.08] p-5 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/15"
                >
                  <h4 className="mb-2 text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {ed.degree}
                  </h4>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <School className="size-4 text-cyan-400" />
                    <span className="text-white/80 font-medium">{ed.institution}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="size-4 text-cyan-400" />
                    <span className="text-white/70 text-sm">
                      {formatDate(ed.startDate)} – {formatDate(ed.endDate)}
                    </span>
                  </div>
                  
                  {ed.field && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border border-green-500/30">
                      <BookOpen className="size-3" />
                      {ed.field}
                    </div>
                  )}
                  
                  {ed.description && (
                    <p className="text-white/80 leading-relaxed text-sm">
                      {ed.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Column */}
        {certifications?.length && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white/90">
              <BadgeCheck className="size-5 text-cyan-400" />
              Certifications
            </h3>
            
            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <motion.div 
                  key={i} 
                  variants={scaleVariants}
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.08] p-5 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/15"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="mb-2 text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {cert.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="size-4 text-yellow-400" />
                        <span className="text-white/80 font-medium">{cert.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-cyan-400" />
                        <span className="text-white/70 text-sm">
                          {formatDate(cert.date)}
                        </span>
                      </div>
                    </div>
                    
                    {cert.link && (
                      <motion.a 
                        href={cert.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="View Certificate"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-500/20 text-cyan-400 hover:text-white hover:from-cyan-500/30 hover:to-blue-400/30 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200"
                      >
                        <LinkIcon className="size-4" />
                      </motion.a>
                    )}
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
