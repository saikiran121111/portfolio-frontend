"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className="ml-2 relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 text-white/60 hover:text-cyan-300 transition-all duration-200 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={copied ? "Copied!" : `Copy ${label}`}
    >
      <motion.div animate={copied ? { scale: [1, 1.2, 1], rotate: [0, 360, 0] } : {}} transition={{ duration: 0.5 }}>
        {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4 group-hover:text-cyan-300" />}
      </motion.div>

      <motion.div
        className={classNames(
          "absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap text-xs font-medium border transition-all duration-200",
          copied ? "bg-green-500/90 text-white border-green-400/50 opacity-100" : "bg-gray-900/90 text-white border-white/20 opacity-0 group-hover:opacity-100"
        )}
        initial={{ opacity: 0, y: 5, scale: 0.8 }}
        animate={copied ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 5, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {copied ? "✓ Copied!" : `Copy ${label}`}
        <div className={classNames(
          "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent",
          copied ? "border-t-green-500/90" : "border-t-gray-900/90"
        )}></div>
      </motion.div>
    </motion.button>
  );
}
