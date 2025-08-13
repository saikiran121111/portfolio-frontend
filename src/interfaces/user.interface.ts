export interface ISkill {
  name: string;
  category: string;
  level: string;
}

export interface IExperience {
  title: string;
  company: string;
  location: string | null;
  startDate: Date;
  endDate?: Date | null;
  description: string | null;
  bullets: string[];
  techStack: string[];
}

export interface IProjects{
  title: string;
  description: string;
  repoUrl: string | null;
  liveUrl: string | null;
  tech: string[];
  highlights: string[];
  startDate: Date | null;
  endDate: Date | null;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string | null;
  startDate: Date;
  endDate: Date | null;
  description?: string | null;
}

export interface ICertifications {
  title: string;
  issuer: string;
  date: Date;
  link: string | null;
}

export interface IAchievements {
  title: string;
  date: Date | null;
  link: string | null;
}

export interface ILanguages {
  name: string;
  level: string;
}

export interface IscanReports {
  type: string;
  commitSha: string | null;
  runAt: Date;
  artifactUrl: string | null;
  summary: ISummary | null;
}

export interface ISummary{
  bugs?: number;
  codeSmells?: number;
  qualityGate?: string;
  vulnerabilities?: number;
  coverage?: number;
  low?: number;
  medium?: number;
  high?: number;
}