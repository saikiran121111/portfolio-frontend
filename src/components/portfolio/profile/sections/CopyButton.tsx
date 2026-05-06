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
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className={classNames(
        "contrast-pill group relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white",
        className,
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={copied ? "Copied!" : `Copy ${label}`}
    >
      <motion.div
        animate={copied ? { scale: [1, 1.2, 1], rotate: [0, 360, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {copied ? (
          <Check className="size-4 text-white" />
        ) : (
          <Copy className="size-4 group-hover:text-white" />
        )}
      </motion.div>

      <motion.div
        className={classNames(
          "absolute -top-12 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium shadow-lg pointer-events-none transition-all duration-200",
          copied
            ? "border-white/80 bg-white/90 text-slate-900 opacity-100"
            : "border-white/20 bg-gray-900/90 text-white opacity-0 group-hover:opacity-100",
        )}
        initial={{ opacity: 0, y: 5, scale: 0.8 }}
        animate={
          copied
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 5, scale: 0.8 }
        }
        transition={{ duration: 0.2 }}
      >
        {copied ? "✓ Copied!" : `Copy ${label}`}
        <div
          className={classNames(
            "absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-[6px] border-r-[6px] border-t-[6px] border-transparent",
            copied ? "border-t-white/90" : "border-t-gray-900/90",
          )}
        ></div>
      </motion.div>
    </motion.button>
  );
}
