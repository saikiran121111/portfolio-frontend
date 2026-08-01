export interface SiteLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FocusArea {
  number: string;
  title: string;
  detail: string;
}

export interface CareerStage {
  number: string;
  label: string;
  title: string;
  detail: string;
}

export const siteContent = {
  identity: {
    fullName: "Phani Venkata Sai Kiran",
    shortName: "Sai Kiran",
    email: "saikiranvsk3@gmail.com",
    location: "Hyderabad, India",
    experienceLabel: "4+ years",
    professionalTitle: "Backend & Full-Stack Engineer",
    transitionLabel: "Moving into AI engineering",
    headline: "Backend foundations. AI engineering direction.",
    summary:
      "Backend and full-stack engineer with 4+ years of experience building APIs, content platforms, integrations, and production workflows. Now extending that foundation into practical AI engineering.",
    availability: "Seeking backend, full-stack, and AI-focused engineering roles",
  },
  targetRoles: [
    "Backend Engineer",
    "Full-Stack Engineer",
    "AI Engineering — transitioning",
  ],
  strongestTechnologies: [
    "Java",
    "NestJS",
    "TypeScript",
    "GraphQL",
    "PostgreSQL",
    "AEM",
  ],
  focusAreas: [
    {
      number: "01",
      title: "Backend engineering",
      detail: "Java, Spring Boot, NestJS, GraphQL",
    },
    {
      number: "02",
      title: "Full-stack delivery",
      detail: "Next.js, integrations, content platforms",
    },
    {
      number: "03",
      title: "AI engineering focus",
      detail: "Current learning and practical project work",
    },
  ] satisfies FocusArea[],
  careerPath: [
    {
      number: "01",
      label: "Foundation",
      title: "Backend systems",
      detail: "Java, Spring Boot, AEM, and APIs",
    },
    {
      number: "02",
      label: "Production delivery",
      title: "Full-stack engineering",
      detail: "NestJS, Next.js, GraphQL, and integrations",
    },
    {
      number: "03",
      label: "Current direction",
      title: "AI engineering",
      detail: "Learning and practical project development",
    },
  ] satisfies CareerStage[],
  aiFocus: {
    eyebrow: "Current direction",
    title: "Building from backend systems toward AI engineering.",
    summary:
      "Developing practical AI engineering skills on top of an established backend foundation. Current portfolio data lists LangChain, LlamaIndex, vector databases, and Ollama as learning and project-development tools.",
    status: "Learning and project development",
    skillPriority: ["LangChain", "LlamaIndex", "Vector Database", "Ollama"],
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Profile", href: "/profile" },
    { label: "Resume", href: "/api/download-resume" },
  ] satisfies SiteLink[],
  links: {
    resume: "/api/download-resume",
    profile: "/profile",
    github: "https://github.com/saikiran121111",
    linkedin: "https://www.linkedin.com/in/saikiran1211/",
  },
  metadata: {
    baseUrl: "https://portfolio-sai-kiran.vercel.app",
    title: "Sai Kiran — Backend & Full-Stack Engineer",
    description:
      "Backend and full-stack engineer with 4+ years of experience, moving toward AI engineering. Explore selected projects, experience, skills, and résumé.",
  },
} as const;

export type SiteContent = typeof siteContent;
