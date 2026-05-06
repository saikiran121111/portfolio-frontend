"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className?: string;
}) {
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
      className={classNames(
        "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white/60 transition-all duration-200 group hover:border-white/30 hover:bg-white/20 hover:text-white",
        className,
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={copied ? "Copied!" : `Copy ${label}`}
    >
      <motion.div animate={copied ? { scale: [1, 1.2, 1], rotate: [0, 360, 0] } : {}} transition={{ duration: 0.5 }}>
        {copied ? <Check className="size-4 text-white" /> : <Copy className="size-4 group-hover:text-white" />}
      </motion.div>

      <motion.div
        className={classNames(
          "absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap text-xs font-medium border transition-all duration-200",
          copied ? "bg-white/90 text-slate-900 border-white/80 opacity-100" : "bg-gray-900/90 text-white border-white/20 opacity-0 group-hover:opacity-100"
        )}
        initial={{ opacity: 0, y: 5, scale: 0.8 }}
        animate={copied ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 5, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {copied ? "\u2713 Copied!" : `Copy ${label}`}
        <div className={classNames(
          "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent",
          copied ? "border-t-white/90" : "border-t-gray-900/90"
        )}></div>
      </motion.div>
    </motion.button>
  );
}
