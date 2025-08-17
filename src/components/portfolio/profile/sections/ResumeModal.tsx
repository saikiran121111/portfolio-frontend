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

export default function ResumeModal({ isOpen, onClose, onDownload }: ResumeModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Convert Google Drive share link to embeddable format
  const googleDriveFileId = "1b07xyyctw0xHcR_kz1lob_x1dA0-Ug9R";
  const embedUrl = `https://drive.google.com/file/d/${googleDriveFileId}/preview`;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      y: "-100vh"
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0,
      y: "-100vh",
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
        duration: 0.4
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!mounted) return null;

  return createPortal(
    (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Full Black Backdrop - Completely Black, highest z below modal */}
            <motion.div
              className="fixed inset-0 z-[2147483646] bg-black"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            />

            {/* Full Screen Modal via Portal - Slides from top, max z-index */}
            <motion.div
              className="fixed inset-0 z-[2147483647] flex flex-col bg-slate-900 overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              
              {/* Header - Fixed within modal at top */}
              <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 border-b border-cyan-500/20 bg-slate-800/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-500/30 border border-cyan-400/30">
                    <ExternalLink className="size-5 sm:size-6 text-cyan-300" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Resume Preview</h2>
                    <p className="text-xs sm:text-sm text-cyan-200/80">Full Screen View • SaiKiran_Resume.pdf</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Download button */}
                  <motion.button
                    onClick={onDownload}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-medium transition-all duration-300 hover:from-cyan-500 hover:to-blue-400 hover:shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base"
                  >
                    <Download className="size-4 sm:size-5" />
                    <span className="hidden sm:inline">Download Resume</span>
                    <span className="sm:hidden">Download</span>
                  </motion.button>

                  {/* Close button */}
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-red-400/40 hover:text-red-300 transition-all duration-300"
                  >
                    <X className="size-5 sm:size-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content - fills remaining height */}
              <div className="relative z-20 flex-1 bg-slate-900 min-h-0">
                {/* Loading spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm z-30">
                    <div className="flex flex-col items-center gap-4 sm:gap-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="size-10 sm:size-12 text-cyan-400" />
                      </motion.div>
                      <div className="text-center px-4">
                        <p className="text-cyan-200 font-medium text-lg sm:text-xl mb-2">Loading resume preview...</p>
                        <p className="text-cyan-300/60 text-sm">Please wait while we prepare your document</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF Iframe - Full screen */}
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  title="Resume Preview - Full Screen"
                  allowFullScreen
                  style={{ width: '100vw', height: '100%' }}
                />
              </div>

              {/* Floating sparkles animation - positioned for full screen */}
              <div className="absolute top-20 left-8 opacity-40 z-10">
                <motion.div
                  animate={{ 
                    y: [-4, 4, -4],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-3 h-3 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50"
                />
              </div>
              <div className="absolute top-32 right-12 opacity-30 z-10">
                <motion.div
                  animate={{ 
                    y: [4, -4, 4],
                    rotate: [360, 180, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 3
                  }}
                  className="w-4 h-4 bg-blue-300 rounded-full shadow-lg shadow-blue-300/50"
                />
              </div>
              <div className="absolute bottom-20 left-16 opacity-25 z-10">
                <motion.div
                  animate={{ 
                    x: [-3, 3, -3],
                    y: [-2, 2, -2],
                    rotate: [0, 90, 180, 270, 360]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="w-2 h-2 bg-purple-300 rounded-full shadow-lg shadow-purple-300/50"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    ),
    document.body
  );
}
