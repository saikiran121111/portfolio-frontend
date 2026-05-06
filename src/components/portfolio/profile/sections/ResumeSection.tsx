"use client";
import { motion } from "framer-motion";
import { Download, FileText, Eye, ExternalLink } from "lucide-react";
import { containerVariants, fadeUpVariants, scaleVariants } from "./utils";
import { useState } from "react";
import ResumeModal from "./ResumeModal";

export default function ResumeSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/api/download-resume";
    link.download = "SaiKiran_Resume.pdf";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.section
      id="resume"
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
        <FileText className="size-6 text-slate-200" /> Resume
      </motion.h2>

      <motion.div
        variants={scaleVariants}
        whileHover={{ scale: 1.01 }}
        className="contrast-card group relative rounded-xl p-6 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
      >
        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-white">
                Download My Resume
              </h3>
              <p className="text-sm leading-relaxed text-white/80">
                Get a comprehensive overview of my experience, skills, and
                achievements in a professionally formatted PDF document.
              </p>
            </div>

            <motion.div
              className="contrast-pill flex size-12 items-center justify-center rounded-full"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="size-6 text-slate-200" />
            </motion.div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-cyan-400/25 bg-cyan-500/20 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/15"
            >
              <Download className="size-5" />
              Download Resume
            </motion.button>

            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="contrast-pill flex flex-1 items-center justify-center gap-3 rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 sm:flex-auto"
            >
              <Eye className="size-5" />
              Preview
            </motion.button>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/70">
            <span className="flex items-center gap-1">
              <ExternalLink className="size-3" />
              PDF Format
            </span>
            <span>Updated regularly</span>
          </div>
        </div>
      </motion.div>

      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
      />
    </motion.section>
  );
}
