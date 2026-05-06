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
        <GraduationCap className="size-6 text-slate-200" /> Education & Certifications
      </motion.h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Education Column */}
        {education?.length && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white/90">
              <School className="size-5 text-slate-200" />
              Education
            </h3>
            
            <div className="space-y-4">
              {education.map((ed, i) => (
                <motion.div 
                  key={i} 
                  variants={scaleVariants}
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.08] p-5 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/10"
                >
                  <h4 className="mb-2 text-lg font-semibold text-white group-hover:text-white transition-colors">
                    {ed.degree}
                  </h4>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <School className="size-4 text-slate-200" />
                    <span className="text-white/80 font-medium">{ed.institution}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="size-4 text-slate-200" />
                    <span className="text-white/70 text-sm">
                      {formatDate(ed.startDate)} – {formatDate(ed.endDate)}
                    </span>
                  </div>
                  
                  {ed.field && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 bg-white/10 text-slate-200 border border-white/20">
                      <BookOpen className="size-3 text-slate-200" />
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
                <BadgeCheck className="size-5 text-slate-200" />
            </h3>
            
            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <motion.div 
                  key={i} 
                  variants={scaleVariants}
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.08] p-5 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="mb-2 text-lg font-semibold text-white group-hover:text-white transition-colors">
                        {cert.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="size-4 text-slate-200" />
                        <span className="text-white/80 font-medium">{cert.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-slate-200" />
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
                        className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-slate-200 hover:text-white border border-white/20 hover:border-white/30 transition-all duration-200"
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
