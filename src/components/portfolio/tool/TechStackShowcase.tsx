"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Database,
  Code2,
  Server,
  FileText,
  Globe,
  ArrowRight,
} from "lucide-react";
import type { IPortfolio } from "@/interfaces/portfolio.interface";

interface TechStackShowcaseProps {
  portfolio: IPortfolio;
}

interface TechStackItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  urls: {
    repo?: string;
    deployed?: string;
    docs?: string;
  };
  gradient: string;
  glowColor: string;
}

export default function TechStackShowcase({
  portfolio,
}: TechStackShowcaseProps) {
  const techStackItems: TechStackItem[] = [
    {
      title: "Backend API",
      description:
        "NestJS server with TypeScript, providing robust REST APIs and real-time features",
      icon: Server,
      urls: {
        repo: portfolio.nestJSGitRepo,
        deployed: portfolio.nestJSDeployedServer,
        docs: portfolio.nestJSSwaggerUrl,
      },
      gradient: "from-red-500 to-pink-500",
      glowColor: "rgba(239,68,68,0.3)",
    },
    {
      title: "Frontend App",
      description:
        "Next.js application with modern React, TypeScript, and responsive design",
      icon: Code2,
      urls: {
        repo: portfolio.nextJSGitRepo,
        deployed: portfolio.nextJSDeployedServer,
      },
      gradient: "from-gray-700 to-gray-900",
      glowColor: "rgba(255,255,255,0.2)",
    },
    {
      title: "Database",
      description:
        "PostgreSQL database hosting data with optimized queries and relationships",
      icon: Database,
      urls: {
        deployed: portfolio.postgresDeployedServer,
      },
      gradient: "from-blue-600 to-indigo-600",
      glowColor: "rgba(59,130,246,0.3)",
    },
  ];

  const availableItems = techStackItems.filter((item) =>
    Object.values(item.urls).some((url) => url),
  );

  if (availableItems.length === 0) return null;

  return (
    <section className="relative mb-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 blur-3xl delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center sm:mb-8"
      >
        <h2 className="mb-2 text-2xl font-bold text-white sm:mb-3 sm:text-3xl">
          <span className="contrast-accent-title">Tech Stack Architecture</span>
        </h2>
        <p className="mx-auto max-w-2xl px-4 text-base text-slate-200 sm:text-lg">
          Explore the complete codebase and infrastructure behind this
          portfolio. From source code to live deployments.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="contrast-card relative h-full rounded-xl p-4 transition-all duration-300 hover:border-white/20 hover:shadow-2xl sm:rounded-2xl sm:p-6">
              <div
                className="absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 sm:rounded-2xl"
                style={{
                  background: `radial-gradient(circle at center, ${item.glowColor}, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <div className={`rounded-lg bg-gradient-to-r p-2 shadow-lg sm:rounded-xl sm:p-3 ${item.gradient}`}>
                    <item.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-cyan-300 sm:text-xl">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="mb-4 text-xs leading-relaxed text-slate-200 sm:mb-6 sm:text-sm">
                  {item.description}
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {item.urls.repo && (
                    <motion.a
                      href={item.urls.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="contrast-pill group/btn flex w-full items-center justify-between rounded-lg p-2 transition-all hover:border-white/20 hover:bg-white/10 sm:p-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Github className="h-3 w-3 text-gray-300 transition-colors group-hover/btn:text-white sm:h-4 sm:w-4" />
                        <span className="text-xs text-slate-200 transition-colors group-hover/btn:text-white sm:text-sm">
                          View Source Code
                        </span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-gray-300 transition-all group-hover/btn:translate-x-1 group-hover/btn:text-white sm:h-4 sm:w-4" />
                    </motion.a>
                  )}

                  {item.urls.deployed && (
                    <motion.a
                      href={item.urls.deployed}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="contrast-pill group/btn flex w-full items-center justify-between rounded-lg p-2 transition-all hover:border-white/20 hover:bg-white/10 sm:p-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Globe className="h-3 w-3 text-gray-300 transition-colors group-hover/btn:text-cyan-400 sm:h-4 sm:w-4" />
                        <span className="text-xs text-slate-200 transition-colors group-hover/btn:text-white sm:text-sm">
                          Live Application
                        </span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-gray-300 transition-all group-hover/btn:translate-x-1 group-hover/btn:text-cyan-400 sm:h-4 sm:w-4" />
                    </motion.a>
                  )}

                  {item.urls.docs && (
                    <motion.a
                      href={item.urls.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="contrast-pill group/btn flex w-full items-center justify-between rounded-lg p-2 transition-all hover:border-white/20 hover:bg-white/10 sm:p-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <FileText className="h-3 w-3 text-gray-300 transition-colors group-hover/btn:text-green-400 sm:h-4 sm:w-4" />
                        <span className="text-xs text-slate-200 transition-colors group-hover/btn:text-white sm:text-sm">
                          API Documentation
                        </span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-gray-300 transition-all group-hover/btn:translate-x-1 group-hover/btn:text-green-400 sm:h-4 sm:w-4" />
                    </motion.a>
                  )}
                </div>
              </div>

              <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60 transition-opacity group-hover:opacity-100 sm:right-4 sm:top-4" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-slate-300">
          Each component is built with modern technologies and best practices.
          <span className="text-cyan-300"> Explore the code to see how it all works together.</span>
        </p>
      </motion.div>
    </section>
  );
}
