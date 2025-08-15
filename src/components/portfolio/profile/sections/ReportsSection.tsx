"use client";
import { motion } from "framer-motion";
import { ShieldCheck, ExternalLink } from "lucide-react";
import type { IscanReports, ISummary } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, formatDate } from "./utils";

export default function ReportsSection({ reports }: { reports: IscanReports[] }) {
  if (!reports?.length) return null;
  return (
    <motion.section id="reports" variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <motion.h2 variants={fadeUpVariants} className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck className="size-5 text-cyan-300" /> Security & Quality Reports
      </motion.h2>
      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((r, i) => (
          <motion.div key={i} variants={fadeUpVariants} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium">{r.type}</h3>
                <p className="mt-1 text-sm text-white/70">
                  Ran on {formatDate(r.runAt)}
                  {r.commitSha ? ` · ${r.commitSha.slice(0, 7)}` : ""}
                </p>
              </div>
              {r.artifactUrl && (
                <a href={r.artifactUrl} target="_blank" rel="noopener noreferrer" title="View Report" className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>
            {r.summary ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {(() => {
                  const s = r.summary as ISummary;
                  return (
                    <>
                      {s.bugs !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">Bugs: <span className="font-medium">{s.bugs}</span></div>
                      )}
                      {s.vulnerabilities !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">Vulns: <span className="font-medium">{s.vulnerabilities}</span></div>
                      )}
                      {s.codeSmells !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">Code Smells: <span className="font-medium">{s.codeSmells}</span></div>
                      )}
                      {s.coverage !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">Coverage: <span className="font-medium">{s.coverage}%</span></div>
                      )}
                      {s.qualityGate !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">Quality Gate: <span className="font-medium">{s.qualityGate}</span></div>
                      )}
                      {s.low !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">Low: <span className="font-medium">{s.low}</span></div>
                      )}
                      {s.medium !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">Medium: <span className="font-medium">{s.medium}</span></div>
                      )}
                      {s.high !== undefined && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">High: <span className="font-medium">{s.high}</span></div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
