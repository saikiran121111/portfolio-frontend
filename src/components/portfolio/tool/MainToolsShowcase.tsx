"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { 
  ChevronRight, 
  Star, 
  Zap, 
  Shield, 
  Code2, 
  Database, 
  Container,
  GitBranch,
  Layers,
  Server,
  Globe,
  Lock,
  Workflow,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Filter,
  ArrowUpDown,
  Grid3X3,
  LayoutGrid,
  Eye,
  EyeOff
} from "lucide-react";

interface Tool {
  key: string;
  title: string;
  logo: string;
  category: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  useCases: string[];
  whyUse: string;
  moreWithThis: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  year: string;
  color: {
    primary: string;
    secondary: string;
    glow: string;
  };
}

const tools: Tool[] = [
  {
    key: "docker",
    title: "Docker",
    logo: "/docker-logo.png",
    category: "DevOps",
    description: "Docker is a platform that uses containerization to package applications and their dependencies into lightweight, portable containers that can run consistently across different environments.",
    features: [
      "Container orchestration",
      "Image management",
      "Multi-platform support",
      "Scalable deployments",
      "Isolated environments"
    ],
    pros: [
      "Consistent environment across dev/prod",
      "Lightweight compared to VMs",
      "Fast deployment and scaling",
      "Excellent for microservices",
      "Strong ecosystem and community"
    ],
    cons: [
      "Learning curve for beginners",
      "Resource overhead on smaller apps",
      "Security considerations with containers",
      "Complexity in multi-container setups"
    ],
    useCases: [
      "Microservices architecture",
      "CI/CD pipelines",
      "Development environment standardization",
      "Application deployment",
      "Cloud migration"
    ],
    whyUse: "Docker eliminates the 'it works on my machine' problem by ensuring consistent environments everywhere. It's essential for modern DevOps practices and cloud-native applications.",
    moreWithThis: [
      "Docker Compose for multi-container apps",
      "Kubernetes for orchestration",
      "Docker Swarm for clustering",
      "Registry management",
      "Performance monitoring",
      "Security scanning"
    ],
    difficulty: "Intermediate",
    popularity: 95,
    year: "2013",
    color: {
      primary: "from-blue-500 to-cyan-400",
      secondary: "from-blue-600/20 to-cyan-500/20",
      glow: "rgba(56,189,248,0.4)"
    }
  },
  {
    key: "nextjs",
    title: "Next.js",
    logo: "/nextJS-logo.png",
    category: "Frontend",
    description: "Next.js is a React framework that provides production-ready features like server-side rendering, static site generation, and automatic code splitting out of the box.",
    features: [
      "Server-side rendering (SSR)",
      "Static site generation (SSG)",
      "API routes",
      "Automatic code splitting",
      "Image optimization",
      "Built-in CSS support"
    ],
    pros: [
      "Excellent SEO capabilities",
      "Fast performance with SSR/SSG",
      "Great developer experience",
      "Built-in optimizations",
      "Vercel deployment integration",
      "Strong TypeScript support"
    ],
    cons: [
      "Can be overkill for simple apps",
      "Learning curve for SSR concepts",
      "Build times can be slow",
      "Vendor lock-in with some features"
    ],
    useCases: [
      "E-commerce websites",
      "Corporate websites",
      "Blogs and content sites",
      "Progressive web apps",
      "Dashboard applications"
    ],
    whyUse: "Next.js bridges the gap between performance and developer experience, offering the best of both static and dynamic web applications with minimal configuration.",
    moreWithThis: [
      "Advanced routing patterns",
      "Middleware for auth/redirects",
      "Edge runtime functions",
      "Incremental static regeneration",
      "Image and font optimization",
      "Performance analytics"
    ],
    difficulty: "Intermediate",
    popularity: 92,
    year: "2016",
    color: {
      primary: "from-gray-900 to-gray-700",
      secondary: "from-gray-800/20 to-gray-600/20",
      glow: "rgba(255,255,255,0.2)"
    }
  },
  {
    key: "nestjs",
    title: "NestJS",
    logo: "/nestJS_logo.png",
    category: "Backend",
    description: "NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications, heavily inspired by Angular's architecture.",
    features: [
      "Decorator-based architecture",
      "Dependency injection",
      "Built-in TypeScript support",
      "Modular structure",
      "GraphQL integration",
      "Microservices support"
    ],
    pros: [
      "Excellent TypeScript integration",
      "Enterprise-ready architecture",
      "Great for large applications",
      "Strong testing capabilities",
      "Rich ecosystem of modules",
      "Clear project structure"
    ],
    cons: [
      "Steep learning curve",
      "Can be verbose for simple APIs",
      "Heavy for lightweight projects",
      "Angular-like complexity"
    ],
    useCases: [
      "Enterprise APIs",
      "Microservices architecture",
      "GraphQL servers",
      "Real-time applications",
      "Complex business logic apps"
    ],
    whyUse: "NestJS brings enterprise-level architecture patterns to Node.js, making it perfect for building scalable, maintainable backend applications with TypeScript.",
    moreWithThis: [
      "Custom decorators and guards",
      "Advanced caching strategies",
      "Message queue integration",
      "Event-driven architecture",
      "Health checks and monitoring",
      "Advanced security features"
    ],
    difficulty: "Advanced",
    popularity: 85,
    year: "2017",
    color: {
      primary: "from-red-500 to-pink-500",
      secondary: "from-red-600/20 to-pink-500/20",
      glow: "rgba(239,68,68,0.4)"
    }
  },
  {
    key: "postgres",
    title: "PostgreSQL",
    logo: "/postgres-logo.png",
    category: "Database",
    description: "PostgreSQL is a powerful, open-source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability and performance.",
    features: [
      "ACID compliance",
      "Complex queries support",
      "JSON/JSONB support",
      "Full-text search",
      "Custom data types",
      "Extensible architecture"
    ],
    pros: [
      "Excellent data integrity",
      "Advanced SQL features",
      "Great performance",
      "Strong community support",
      "Extensible with plugins",
      "ACID compliant transactions"
    ],
    cons: [
      "More complex than NoSQL",
      "Requires database knowledge",
      "Memory intensive",
      "Can be overkill for simple apps"
    ],
    useCases: [
      "Web applications",
      "Data warehousing",
      "Financial systems",
      "Geographic information systems",
      "Scientific applications"
    ],
    whyUse: "PostgreSQL offers the perfect balance of SQL compliance, performance, and extensibility, making it ideal for applications that need reliable data storage with complex querying capabilities.",
    moreWithThis: [
      "Advanced indexing strategies",
      "Partitioning for large datasets",
      "Replication and clustering",
      "Custom functions and procedures",
      "Performance tuning",
      "Backup and recovery strategies"
    ],
    difficulty: "Intermediate",
    popularity: 88,
    year: "1989",
    color: {
      primary: "from-blue-700 to-indigo-600",
      secondary: "from-blue-700/20 to-indigo-600/20",
      glow: "rgba(29,78,216,0.4)"
    }
  },
  {
    key: "prisma",
    title: "Prisma",
    logo: "/prisma-logo.png",
    category: "ORM",
    description: "Prisma is a next-generation ORM that unlocks a new level of developer experience when working with databases through auto-generated type-safe client and intuitive data modeling.",
    features: [
      "Type-safe database client",
      "Declarative data modeling",
      "Database migrations",
      "Visual database browser",
      "Real-time subscriptions",
      "Multiple database support"
    ],
    pros: [
      "Excellent TypeScript integration",
      "Auto-generated type-safe client",
      "Great developer experience",
      "Visual database management",
      "Easy migrations",
      "Strong introspection capabilities"
    ],
    cons: [
      "Learning curve for traditional SQL users",
      "Limited complex query support",
      "Vendor lock-in concerns",
      "Performance overhead for simple queries"
    ],
    useCases: [
      "Modern web applications",
      "GraphQL APIs",
      "Rapid prototyping",
      "Type-safe backend development",
      "Database-driven applications"
    ],
    whyUse: "Prisma transforms the database development experience by providing type safety, auto-completion, and an intuitive API that makes working with databases feel natural and productive.",
    moreWithThis: [
      "Advanced schema design",
      "Custom middleware",
      "Connection pooling",
      "Database seeding",
      "Performance optimization",
      "Multi-database setups"
    ],
    difficulty: "Beginner",
    popularity: 82,
    year: "2019",
    color: {
      primary: "from-slate-700 to-gray-600",
      secondary: "from-slate-700/20 to-gray-600/20",
      glow: "rgba(100,116,139,0.4)"
    }
  },
  {
    key: "git",
    title: "Git",
    logo: "/git-logo.png",
    category: "Version Control",
    description: "Git is a distributed version control system designed to handle everything from small to very large projects with speed and efficiency, tracking changes in source code during software development.",
    features: [
      "Distributed version control",
      "Branching and merging",
      "Commit history tracking",
      "Remote repository support",
      "Conflict resolution",
      "Lightweight and fast"
    ],
    pros: [
      "Industry standard for version control",
      "Excellent branching model",
      "Distributed architecture",
      "Fast performance",
      "Strong community and tooling",
      "Offline capabilities"
    ],
    cons: [
      "Steep learning curve for beginners",
      "Complex commands for advanced features",
      "Can be confusing with merge conflicts",
      "Binary file handling limitations"
    ],
    useCases: [
      "Source code management",
      "Collaborative development",
      "Release management",
      "Code backup and history",
      "Open source projects"
    ],
    whyUse: "Git is essential for any serious development work, providing the foundation for collaboration, code history, and deployment workflows that modern software development relies on.",
    moreWithThis: [
      "Advanced branching strategies",
      "Git hooks for automation",
      "Submodules for dependencies",
      "Git flow workflows",
      "Integration with CI/CD",
      "Custom merge strategies"
    ],
    difficulty: "Intermediate",
    popularity: 98,
    year: "2005",
    color: {
      primary: "from-orange-500 to-red-500",
      secondary: "from-orange-600/20 to-red-500/20",
      glow: "rgba(249,115,22,0.4)"
    }
  }
];

const categoryIcons = {
  "DevOps": Container,
  "Frontend": Globe,
  "Backend": Server,
  "Database": Database,
  "ORM": Layers,
  "Version Control": GitBranch
};

const difficultyColors = {
  "Beginner": "from-green-500 to-emerald-400",
  "Intermediate": "from-yellow-500 to-orange-400",
  "Advanced": "from-red-500 to-pink-500"
};

export default function MainToolsShowcase() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"popularity" | "difficulty" | "year">("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [animationEnabled, setAnimationEnabled] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 1]);

  // Filter and sort tools
  const filteredTools = tools
    .filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || tool.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity": return b.popularity - a.popularity;
        case "difficulty": 
          const diffOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        case "year": return parseInt(b.year) - parseInt(a.year);
        default: return 0;
      }
    });

  const categories = ["All", ...Array.from(new Set(tools.map(tool => tool.category)))];

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Lock/unlock background scrolling when modal opens/closes
  useEffect(() => {
    if (selectedTool) {
      // Lock scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Unlock scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup function to ensure scrolling is unlocked when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedTool]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ y, opacity }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden"
    >
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 10 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" 
        />
      </div>

      {/* Enhanced Grid Pattern with Animation */}
      <motion.div 
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" 
      />

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Tech Arsenal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Explore the cutting-edge technologies that power modern applications. Each tool is carefully selected for its unique capabilities and impact on the development ecosystem.
          </motion.p>
          
          {/* Statistics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-8 text-sm text-slate-300"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>{filteredTools.length} Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>{categories.length - 1} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>Advanced Showcase</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="popularity" className="bg-slate-900">Popularity</option>
                <option value="difficulty" className="bg-slate-900">Difficulty</option>
                <option value="year" className="bg-slate-900">Year</option>
              </select>
            </div>

            {/* View Mode & Animation Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  viewMode === "grid" 
                    ? "bg-blue-500/20 border-blue-400/50 text-blue-300" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Grid3X3 className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setAnimationEnabled(!animationEnabled)}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  animationEnabled 
                    ? "bg-green-500/20 border-green-400/50 text-green-300" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                }`}
              >
                {animationEnabled ? <Eye className="w-4 h-4 mx-auto" /> : <EyeOff className="w-4 h-4 mx-auto" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tools Grid with 3D Effects */}
        <div className={`mb-20 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}`}>
          {filteredTools.map((tool, index) => {
            const CategoryIcon = categoryIcons[tool.category as keyof typeof categoryIcons] || Code2;
            
            return (
              <motion.div
                key={tool.key}
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: animationEnabled ? index * 0.1 : 0,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={animationEnabled ? { 
                  y: -10,
                  rotateX: 5,
                  rotateY: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                } : {}}
                onMouseEnter={() => setHoveredTool(tool.key)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => setSelectedTool(tool)}
                className="group cursor-pointer perspective-1000"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className={`
                    relative ${viewMode === "grid" ? "h-80" : "h-40 flex items-center gap-6"} 
                    rounded-2xl p-6 backdrop-blur-xl border border-white/10
                    bg-gradient-to-br ${tool.color.secondary} hover:border-white/30
                    transition-all duration-500 
                    shadow-2xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)]
                    before:absolute before:inset-0 before:rounded-2xl 
                    before:bg-gradient-to-br before:${tool.color.primary} 
                    before:opacity-0 before:transition-opacity before:duration-500
                    hover:before:opacity-15
                    overflow-hidden
                  `}
                  whileHover={animationEnabled ? {
                    boxShadow: `0 25px 50px ${tool.color.glow}`
                  } : {}}
                >
                  {/* Animated Particles Background */}
                  {hoveredTool === tool.key && animationEnabled && (
                    <motion.div
                      className="absolute inset-0 overflow-hidden rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white/30 rounded-full"
                          initial={{
                            x: Math.random() * 100 + "%",
                            y: "100%",
                            opacity: 0
                          }}
                          animate={{
                            y: "-20%",
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                  
                  {/* Glow Effect */}
                  <motion.div 
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                    style={{ 
                      background: `radial-gradient(circle at center, ${tool.color.glow}, transparent 70%)`,
                      transform: 'scale(1.1)'
                    }}
                    animate={hoveredTool === tool.key && animationEnabled ? {
                      scale: [1.1, 1.3, 1.1],
                      opacity: [0.5, 0.8, 0.5]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div className={`relative z-10 ${viewMode === "grid" ? "flex flex-col h-full" : "flex items-center gap-6 w-full"}`}>
                    {viewMode === "grid" ? (
                      <>
                        {/* Grid View Content */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className={`p-2 rounded-lg bg-gradient-to-br ${tool.color.primary} shadow-lg`}
                              whileHover={animationEnabled ? { 
                                rotate: [0, -10, 10, 0],
                                scale: 1.1
                              } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <CategoryIcon size={20} className="text-white" />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                              <p className="text-sm text-slate-400">{tool.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <motion.div
                                animate={animationEnabled ? { rotate: 360 } : {}}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              >
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              </motion.div>
                              <span className="text-sm text-slate-300">{tool.popularity}%</span>
                            </div>
                            <span className="text-xs text-slate-500">Since {tool.year}</span>
                          </div>
                        </div>

                        {/* Logo with Enhanced 3D Effect and Better Rendering */}
                        <div className="flex-1 flex items-center justify-center mb-4">
                          <motion.div 
                            className="logo-container relative w-24 h-24 rounded-2xl shadow-lg"
                            whileHover={animationEnabled ? { 
                              scale: 1.05,
                              transition: { duration: 0.3, ease: "easeOut" }
                            } : {}}
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            {/* Enhanced front side */}
                            <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
                              {/* Subtle glow behind logo */}
                              <div 
                                className="absolute inset-0 rounded-2xl opacity-20"
                                style={{
                                  background: `radial-gradient(circle at center, ${tool.color.glow}, transparent 60%)`
                                }}
                              />
                              <Image
                                src={tool.logo}
                                alt={`${tool.title} logo`}
                                width={80}
                                height={80}
                                className={`logo-image object-contain relative z-10 ${tool.key === 'git' ? 'git-logo-size' : ''}`}
                                priority
                                quality={100}
                              />
                              {/* Shine overlay */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"
                                animate={hoveredTool === tool.key ? {
                                  x: ["-100%", "100%"]
                                } : {}}
                                transition={{ duration: 1, ease: "easeInOut" }}
                              />
                            </div>
                            
                            {/* Enhanced back side of the card */}
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/30 shadow-2xl"
                              style={{ 
                                rotateY: "180deg",
                                backfaceVisibility: "hidden",
                                transformStyle: "preserve-3d"
                              }}
                            >
                              <div className="relative">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Zap className="w-10 h-10 text-white drop-shadow-lg" />
                                </motion.div>
                                {/* Pulsing glow */}
                                <motion.div
                                  className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </div>
                            </motion.div>
                          </motion.div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-300 line-clamp-3 mb-4">
                          {tool.description}
                        </p>

                        {/* Enhanced Footer */}
                        <div className="flex items-center justify-between">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${difficultyColors[tool.difficulty]} text-white shadow-lg`}>
                            {tool.difficulty}
                          </div>
                          <motion.div
                            whileHover={animationEnabled ? { x: 5, scale: 1.1 } : {}}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                          </motion.div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Enhanced List View Content */}
                        <motion.div 
                          className={`p-4 rounded-xl bg-gradient-to-br ${tool.color.primary} shadow-lg shrink-0 relative overflow-hidden`}
                          whileHover={animationEnabled ? { rotate: 360, scale: 1.1 } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Background glow */}
                          <div 
                            className="absolute inset-0 opacity-30"
                            style={{
                              background: `radial-gradient(circle at center, ${tool.color.glow}, transparent 70%)`
                            }}
                          />
                          <Image
                            src={tool.logo}
                            alt={`${tool.title} logo`}
                            width={48}
                            height={48}
                            className={`logo-image object-contain relative z-10 ${tool.key === 'git' ? 'git-logo-size' : ''}`}
                            priority
                            quality={100}
                          />
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                            animate={hoveredTool === tool.key ? {
                              x: ["-100%", "100%"]
                            } : {}}
                            transition={{ duration: 1, ease: "easeInOut" }}
                          />
                        </motion.div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                            <span className="text-sm text-slate-400">{tool.category}</span>
                            <div className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${difficultyColors[tool.difficulty]} text-white`}>
                              {tool.difficulty}
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-slate-300">{tool.popularity}%</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Detailed View Modal with Advanced Features */}
        <AnimatePresence>
          {selectedTool && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedTool(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 300,
                  duration: 0.6
                }}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated Background Pattern */}
                <motion.div
                  className="absolute inset-0 rounded-3xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 20%, ${selectedTool.color.glow} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${selectedTool.color.glow} 0%, transparent 50%)`,
                      animation: "pulse 4s ease-in-out infinite"
                    }}
                  />
                </motion.div>

                {/* Enhanced Header */}
                <motion.div 
                  className="flex items-start justify-between mb-8 relative z-10"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className={`p-5 rounded-3xl bg-gradient-to-br ${selectedTool.color.primary} shadow-2xl relative overflow-hidden border border-white/20`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Enhanced background glow */}
                      <div 
                        className="absolute inset-0 opacity-40"
                        style={{
                          background: `radial-gradient(circle at center, ${selectedTool.color.glow}, transparent 60%)`
                        }}
                      />
                      
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      />
                      
                      {/* Pulsing border */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl border-2 border-white/40"
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <Image
                        src={selectedTool.logo}
                        alt={`${selectedTool.title} logo`}
                        width={80}
                        height={80}
                        className={`logo-image object-contain relative z-10 ${selectedTool.key === 'git' ? 'git-logo-size' : ''}`}
                        priority
                        quality={100}
                      />
                    </motion.div>
                    <div>
                      <motion.h2 
                        className="text-4xl font-bold text-white mb-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {selectedTool.title}
                      </motion.h2>
                      <motion.p 
                        className="text-xl text-slate-400"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {selectedTool.category}
                      </motion.p>
                      
                      {/* Animated Stats */}
                      <motion.div 
                        className="flex gap-4 mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-300">{selectedTool.popularity}% Popular</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[selectedTool.difficulty]} text-white text-sm font-medium`}>
                          {selectedTool.difficulty}
                        </div>
                        <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm">
                          Since {selectedTool.year}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setSelectedTool(null)}
                    className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle className="w-6 h-6 text-slate-400" />
                  </motion.button>
                </motion.div>

                {/* Enhanced Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Overview with Animation */}
                    <motion.div 
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                          <Info className="w-5 h-5" />
                        </motion.div>
                        Overview
                      </h3>
                      <p className="text-slate-300 leading-relaxed">{selectedTool.description}</p>
                    </motion.div>

                    {/* Why Use with Enhanced Animation */}
                    <motion.div 
                      className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20 backdrop-blur-sm"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.02, borderColor: "rgba(245, 158, 11, 0.4)" }}
                    >
                      <h3 className="text-xl font-semibold text-amber-200 mb-4 flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Award className="w-5 h-5" />
                        </motion.div>
                        Why Use This?
                      </h3>
                      <p className="text-amber-100 leading-relaxed">{selectedTool.whyUse}</p>
                    </motion.div>

                    {/* Features with Staggered Animation */}
                    <motion.div 
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {selectedTool.features.map((feature, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center gap-3 text-slate-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                            </motion.div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Pros & Cons with Advanced Styling */}
                    <div className="grid grid-cols-1 gap-4">
                      <motion.div 
                        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.4)" }}
                      >
                        <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Pros
                        </h3>
                        <ul className="space-y-2">
                          {selectedTool.pros.map((pro, index) => (
                            <motion.li 
                              key={index} 
                              className="text-sm text-green-200 flex items-start gap-2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                            >
                              <span className="w-1 h-1 bg-green-400 rounded-full mt-2 shrink-0" />
                              {pro}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div 
                        className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-6 border border-red-500/20 backdrop-blur-sm"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(239, 68, 68, 0.4)" }}
                      >
                        <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Cons
                        </h3>
                        <ul className="space-y-2">
                          {selectedTool.cons.map((con, index) => (
                            <motion.li 
                              key={index} 
                              className="text-sm text-red-200 flex items-start gap-2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                            >
                              <span className="w-1 h-1 bg-red-400 rounded-full mt-2 shrink-0" />
                              {con}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Use Cases */}
                    <motion.div 
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Workflow className="w-5 h-5 text-purple-400" />
                        Perfect For
                      </h3>
                      <ul className="space-y-3">
                        {selectedTool.useCases.map((useCase, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center gap-3 text-slate-300"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                            {useCase}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Advanced Capabilities */}
                    <motion.div 
                      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.02, borderColor: "rgba(147, 51, 234, 0.4)" }}
                    >
                      <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Shield className="w-5 h-5" />
                        </motion.div>
                        Advanced Capabilities
                      </h3>
                      <ul className="space-y-3">
                        {selectedTool.moreWithThis.map((capability, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center gap-3 text-purple-100"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 + index * 0.1 }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                            >
                              <Star className="w-4 h-4 text-purple-400 shrink-0" />
                            </motion.div>
                            {capability}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
