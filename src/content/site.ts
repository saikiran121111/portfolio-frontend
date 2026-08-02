export interface SiteLink {
  label: string;
  href: string;
  external?: boolean;
}

export const siteContent = {
  // These values are offline fallbacks only. Public portfolio facts come from the API.
  identity: {
    fullName: "Phani Venkata Sai Kiran",
    shortName: "Sai Kiran",
    email: "saikiranvsk3@gmail.com",
    location: "Hyderabad, India",
    headline: "Backend foundations. AI engineering direction.",
    summary:
      "Backend and full-stack engineer building APIs, content platforms, integrations, and production workflows.",
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
    resumeView: "/api/download-resume?view=1",
    profile: "/profile",
    github: "https://github.com/saikiran121111",
    linkedin: "https://www.linkedin.com/in/saikiran1211/",
  },
  metadata: {
    baseUrl: "https://portfolio-sai-kiran.vercel.app",
    title: "Sai Kiran — Backend & Full-Stack Engineer",
    description:
      "Backend and full-stack engineer moving toward AI engineering. Explore selected projects, experience, skills, and Resume.",
  },
} as const;

export type SiteContent = typeof siteContent;
