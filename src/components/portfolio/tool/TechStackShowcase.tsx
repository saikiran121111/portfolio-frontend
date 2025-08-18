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
  ArrowRight
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

export default function TechStackShowcase({ portfolio }: TechStackShowcaseProps) {
  const techStackItems: TechStackItem[] = [
    {
      title: "Backend API",
      description: "NestJS server with TypeScript, providing robust REST APIs and real-time features",
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
      description: "Next.js application with modern React, TypeScript, and responsive design",
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
      description: "PostgreSQL database hosting data with optimized queries and relationships",
      icon: Database,
      urls: {
        deployed: portfolio.postgresDeployedServer,
      },
      gradient: "from-blue-600 to-indigo-600",
      glowColor: "rgba(59,130,246,0.3)",
    },
  ];

  // Filter out items that don't have any URLs
  const availableItems = techStackItems.filter(item => 
    Object.values(item.urls).some(url => url)
  );

  if (availableItems.length === 0) return null;

  return (
    <section className="relative mb-12">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Tech Stack Architecture
          </span>
        </h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
          Explore the complete codebase and infrastructure behind this portfolio. 
          From source code to live deployments.
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
            {/* Card */}
            <div className="relative h-full rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-2xl">
              {/* Glow effect on hover */}
              <div 
                className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                style={{ 
                  background: `radial-gradient(circle at center, ${item.glowColor}, transparent 70%)` 
                }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                  {item.description}
                </p>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  {item.urls.repo && (
                    <motion.a
                      href={item.urls.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between w-full p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group/btn"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Github className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                        <span className="text-xs sm:text-sm text-gray-300 group-hover/btn:text-white transition-colors">
                          View Source Code
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                    </motion.a>
                  )}

                  {item.urls.deployed && (
                    <motion.a
                      href={item.urls.deployed}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between w-full p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group/btn"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-cyan-400 transition-colors" />
                        <span className="text-xs sm:text-sm text-gray-300 group-hover/btn:text-white transition-colors">
                          Live Application
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-1 transition-all" />
                    </motion.a>
                  )}

                  {item.urls.docs && (
                    <motion.a
                      href={item.urls.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between w-full p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group/btn"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-green-400 transition-colors" />
                        <span className="text-xs sm:text-sm text-gray-300 group-hover/btn:text-white transition-colors">
                          API Documentation
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-green-400 group-hover/btn:translate-x-1 transition-all" />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-gray-400">
          Each component is built with modern technologies and best practices. 
          <span className="text-cyan-400"> Explore the code to see how it all works together.</span>
        </p>
      </motion.div>
    </section>
  );
}
