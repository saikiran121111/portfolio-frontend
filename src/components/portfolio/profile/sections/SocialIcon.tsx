"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ISocials } from "@/interfaces/portfolio.interface";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SocialIcon({ socials, className }: { socials?: ISocials; className?: string }) {
  if (!socials) return null;
  const items = [
    socials.github && { href: socials.github, label: "GitHub" },
    socials.linkedin && { href: socials.linkedin, label: "LinkedIn" },
    socials.portfolio && { href: socials.portfolio, label: "Portfolio" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  if (!items.length) return null;
  const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    GitHub: require("lucide-react").Github,
    LinkedIn: require("lucide-react").Linkedin,
    Portfolio: require("lucide-react").Globe,
  };

  return (
    <div className={classNames("flex items-center gap-3", className)}>
      {items.map(({ href, label }, index) => {
        const Icon = IconMap[label];
        return (
          <motion.a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            title={label}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="size-4" />
            <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
          </motion.a>
        );
      })}
    </div>
  );
}
