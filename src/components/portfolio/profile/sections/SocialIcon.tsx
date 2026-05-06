"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Globe } from "lucide-react";
import type { ISocials } from "@/interfaces/portfolio.interface";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SocialIcon({
  socials,
  className,
}: {
  socials?: ISocials;
  className?: string;
}) {
  if (!socials) return null;

  const items = [
    socials.github && { href: socials.github, label: "GitHub", Icon: Github },
    socials.linkedin && {
      href: socials.linkedin,
      label: "LinkedIn",
      Icon: Linkedin,
    },
    socials.portfolio && {
      href: socials.portfolio,
      label: "Portfolio",
      Icon: Globe,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }>;

  if (!items.length) return null;

  return (
    <div className={classNames("flex flex-wrap items-center gap-2 sm:gap-3", className)}>
      {items.map(({ href, label, Icon }, index) => (
        <motion.a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="contrast-pill group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-white/90 transition-colors hover:text-white sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
          title={label}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="size-4 shrink-0" />
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/80 sm:hidden">
            {label}
          </span>
          <ArrowUpRight className="hidden size-3 -translate-y-0.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 sm:block" />
        </motion.a>
      ))}
    </div>
  );
}
