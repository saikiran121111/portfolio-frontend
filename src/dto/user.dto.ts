// User-level / atomic DTOs (raw API shapes) used across portfolio domain
// All date-like fields are ISO strings here.

export interface SkillDto {
  name: string;
  category: string;
  level: string;
}

export interface ExperienceDto {
  title: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate?: string | null;
  description: string | null;
  bullets: string[];
  techStack: string[];
}

export interface ProjectDto {
  title: string;
  description: string;
  repoUrl: string | null;
  liveUrl: string | null;
  tech: string[];
  highlights: string[];
  startDate: string | null;
  endDate: string | null;
}

export interface EducationDto {
  institution: string;
  degree: string;
  field: string | null;
  startDate: string;
  endDate: string | null;
  description?: string | null;
}

export interface CertificationDto {
  title: string;
  issuer: string;
  date: string;
  link: string | null;
}

export interface AchievementDto {
  title: string;
  date: string | null;
  link: string | null;
}

export interface LanguageDto {
  name: string;
  level: string;
}

export interface SummaryDto {
  bugs?: number;
  codeSmells?: number;
  qualityGate?: string;
  vulnerabilities?: number;
  coverage?: number;
  low?: number;
  medium?: number;
  high?: number;
}

export interface ScanReportDto {
  type: string;
  commitSha: string | null;
  runAt: string;
  artifactUrl: string | null;
  summary: SummaryDto | null;
}

export interface SocialsDto {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}
