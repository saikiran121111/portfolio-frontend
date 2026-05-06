"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export default function ResumeModal({
  isOpen,
  onClose,
  onDownload,
}: ResumeModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const googleDriveFileId = "1b07xyyctw0xHcR_kz1lob_x1dA0-Ug9R";
  const embedUrl = `https://drive.google.com/file/d/${googleDriveFileId}/preview`;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: "-100vh",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      y: "-100vh",
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
        duration: 0.4,
      },
    },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[2147483645] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="fixed inset-0 z-[2147483646] flex cursor-none flex-col overflow-hidden bg-slate-900"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

            <div className="relative z-20 flex shrink-0 items-center justify-between border-b border-white/15 bg-slate-900/95 p-4 backdrop-blur-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="contrast-pill rounded-xl p-2 sm:p-3">
                  <ExternalLink className="size-5 text-white/80 sm:size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Resume Preview
                  </h2>
                  <p className="text-xs text-white/80 sm:text-sm">
                    Full Screen View - SaiKiran_Resume.pdf
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <motion.button
                  onClick={onDownload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-500/20 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/15 sm:gap-3 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                >
                  <Download className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Download Resume</span>
                  <span className="sm:hidden">Download</span>
                </motion.button>

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="contrast-pill rounded-lg p-2 text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white sm:rounded-xl sm:p-3"
                >
                  <X className="size-5 sm:size-6" />
                </motion.button>
              </div>
            </div>

            <div className="relative z-20 min-h-0 flex-1 bg-slate-950">
              {isLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4 sm:gap-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="size-10 text-white/80 sm:size-12" />
                    </motion.div>
                    <div className="px-4 text-center">
                      <p className="mb-2 text-lg font-medium text-white/80 sm:text-xl">
                        Loading resume preview...
                      </p>
                      <p className="text-sm text-white/70">
                        Please wait while we prepare your document
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <iframe
                src={embedUrl}
                className="h-full w-full border-0"
                onLoad={() => setIsLoading(false)}
                title="Resume Preview - Full Screen"
                allowFullScreen
                style={{ width: "100vw", height: "100%" }}
              />
            </div>

            <div className="absolute left-8 top-20 z-10 opacity-40">
              <motion.div
                animate={{
                  y: [-4, 4, -4],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-3 w-3 rounded-full bg-white/60 shadow-lg shadow-white/10"
              />
            </div>
            <div className="absolute right-12 top-32 z-10 opacity-30">
              <motion.div
                animate={{
                  y: [4, -4, 4],
                  rotate: [360, 180, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3,
                }}
                className="h-4 w-4 rounded-full bg-slate-300/70 shadow-lg shadow-white/10"
              />
            </div>
            <div className="absolute bottom-20 left-16 z-10 opacity-25">
              <motion.div
                animate={{
                  x: [-3, 3, -3],
                  y: [-2, 2, -2],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="h-2 w-2 rounded-full bg-slate-300/70 shadow-lg shadow-white/10"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
