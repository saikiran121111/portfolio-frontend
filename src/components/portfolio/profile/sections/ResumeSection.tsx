"use client";
import { motion } from "framer-motion";
import { Download, FileText, Eye, ExternalLink } from "lucide-react";
import { containerVariants, fadeUpVariants, scaleVariants } from "./utils";

export default function ResumeSection() {
  const resumeUrl = "https://github.com/saikiran121111/Resume/raw/main/SaiKiran_Resume.pdf";
  
  const handleDownload = () => {
    // Use our API route for proper download
    const link = document.createElement('a');
    link.href = '/api/download-resume';
    link.download = 'SaiKiran_Resume.pdf';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    window.open(resumeUrl, '_blank');
  };

  return (
    <motion.section 
      id="resume" 
      variants={containerVariants} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true, margin: "-120px" }} 
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <motion.h2 variants={fadeUpVariants} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
        <FileText className="size-6 text-cyan-400" /> Resume
      </motion.h2>
      
      <motion.div 
        variants={scaleVariants}
        whileHover={{ scale: 1.01 }} 
        className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.08] p-6 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10"
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2">
                Download My Resume
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Get a comprehensive overview of my experience, skills, and achievements in a professionally formatted PDF document.
              </p>
            </div>
            
            {/* File icon with animation */}
            <motion.div 
              className="flex items-center justify-center size-12 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-500/20 border border-cyan-500/20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="size-6 text-cyan-400" />
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Download button */}
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-medium transition-all duration-300 hover:from-cyan-500 hover:to-blue-400 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <Download className="size-5" />
              Download Resume
            </motion.button>

            {/* Preview button */}
            <motion.button
              onClick={handlePreview}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 sm:flex-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-medium transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-300"
            >
              <Eye className="size-5" />
              Preview
            </motion.button>
          </div>

          {/* Additional info */}
          <div className="mt-4 flex items-center justify-between text-xs text-white/60">
            <span className="flex items-center gap-1">
              <ExternalLink className="size-3" />
              PDF Format
            </span>
            <span>Updated regularly</span>
          </div>
        </div>
      </motion.div>

    </motion.section>
  );
}
