"use client";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import type { IPortfolio } from "@/interfaces/portfolio.interface";
import SocialIcon from "./SocialIcon";
import CopyButton from "./CopyButton";
import { fadeUpVariants, EASE_OUT } from "./utils";

export default function HeaderCard({ data }: { data: IPortfolio }) {
  return (
    <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <motion.div className="flex flex-wrap items-center justify-between gap-4" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <div>
          <motion.h1 className="text-2xl md:text-3xl font-semibold tracking-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {data.name}
          </motion.h1>
          {data.headline && (
            <motion.p className="mt-1 text-white/70" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              {data.headline}
            </motion.p>
          )}
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <SocialIcon socials={data.socials} />
        </motion.div>
      </motion.div>
      {data.summary && <p className="mt-4 text-white/80 leading-relaxed">{data.summary}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
        {data.location && (
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-cyan-300" /> {data.location}
          </span>
        )}
        {data.email && (
          <div className="inline-flex items-center gap-2 group">
            <a className="inline-flex items-center gap-2 hover:text-white transition-colors" href={`mailto:${data.email}`}>
              <Mail className="size-4 text-cyan-300" /> {data.email}
            </a>
            <CopyButton text={data.email} label="email" />
          </div>
        )}
        {data.phone && (
          <div className="inline-flex items-center gap-2 group">
            <a className="inline-flex items-center gap-2 hover:text-white transition-colors" href={`tel:${data.phone}`}>
              <Phone className="size-4 text-cyan-300" /> {data.phone}
            </a>
            <CopyButton text={data.phone} label="phone" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
