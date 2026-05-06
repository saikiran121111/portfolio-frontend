"use client";
import { motion } from "framer-motion";
import { ShieldCheck, ExternalLink } from "lucide-react";
import type { IscanReports, ISummary } from "@/interfaces/user.interface";
import { containerVariants, fadeUpVariants, formatDate } from "./utils";

export default function ReportsSection({
  reports,
}: {
  reports: IscanReports[];
}) {
  if (!reports?.length) return null;

  return (
    <motion.section
      id="reports"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="contrast-surface mt-8 rounded-2xl p-6"
    >
      <motion.h2
        variants={fadeUpVariants}
        className="mb-4 flex items-center gap-2 text-lg font-semibold text-white"
      >
        <ShieldCheck className="size-5 text-slate-200" /> Security & Quality
        Reports
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report, index) => (
          <motion.div
            key={index}
            variants={fadeUpVariants}
            className="contrast-card rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-white">{report.type}</h3>
                <p className="mt-1 text-sm text-white/80">
                  Ran on {formatDate(report.runAt)}
                  {report.commitSha ? ` - ${report.commitSha.slice(0, 7)}` : ""}
                </p>
              </div>
              {report.artifactUrl && (
                <a
                  href={report.artifactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Report"
                  className="contrast-pill inline-flex size-9 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>

            {report.summary ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {(() => {
                  const summary = report.summary as ISummary;

                  return (
                    <>
                      {summary.bugs !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          Bugs: <span className="font-medium text-white">{summary.bugs}</span>
                        </div>
                      )}
                      {summary.vulnerabilities !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          Vulns: <span className="font-medium text-white">{summary.vulnerabilities}</span>
                        </div>
                      )}
                      {summary.codeSmells !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          Code Smells: <span className="font-medium text-white">{summary.codeSmells}</span>
                        </div>
                      )}
                      {summary.coverage !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          Coverage: <span className="font-medium text-white">{summary.coverage}%</span>
                        </div>
                      )}
                      {summary.qualityGate !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          Quality Gate: <span className="font-medium text-white">{summary.qualityGate}</span>
                        </div>
                      )}
                      {summary.low !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          Low: <span className="font-medium text-white">{summary.low}</span>
                        </div>
                      )}
                      {summary.medium !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          Medium: <span className="font-medium text-white">{summary.medium}</span>
                        </div>
                      )}
                      {summary.high !== undefined && (
                        <div className="contrast-surface-soft rounded-lg px-3 py-2 text-white/85">
                          High: <span className="font-medium text-white">{summary.high}</span>
                        </div>
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
