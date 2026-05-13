export interface IAdminSocialsApi {
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

export interface IAdminSocialsEditor {
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface IAdminUserApi {
  id?: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  headline: string | null;
  summary: string | null;
  copyrights: string | null;
  location: string | null;
  phone: string | null;
  socials: IAdminSocialsApi;
}

export interface IAdminUserEditor {
  id?: number;
  name: string;
  email: string;
  avatarUrl: string;
  headline: string;
  summary: string;
  copyrights: string;
  location: string;
  phone: string;
  socials: IAdminSocialsEditor;
}

export interface IAdminRepoDataApi {
  nestJSGitRepo: string | null;
  nestJSDeployedServer: string | null;
  nestJSSwaggerUrl: string | null;
  nextJSGitRepo: string | null;
  nextJSDeployedServer: string | null;
  postgresDeployedServer: string | null;
}

export interface IAdminRepoDataEditor {
  nestJSGitRepo: string;
  nestJSDeployedServer: string;
  nestJSSwaggerUrl: string;
  nextJSGitRepo: string;
  nextJSDeployedServer: string;
  postgresDeployedServer: string;
}

export interface IAdminBottomHeadlineApi {
  id?: number;
  text: string;
  order: number;
}

export interface IAdminBottomHeadlineEditor {
  id?: number;
  text: string;
  order: number;
}

export interface IAdminSkillApi {
  id?: number;
  name: string;
  category: string;
  level: string;
  order: number;
}

export interface IAdminSkillEditor {
  id?: number;
  name: string;
  category: string;
  level: string;
  order: number;
}

export interface IAdminExperienceApi {
  id?: number;
  title: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  bullets: string[];
  techStack: string[];
  order: number;
}

export interface IAdminExperienceEditor {
  id?: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
  techStack: string[];
  order: number;
}

export interface IAdminProjectApi {
  id?: number;
  title: string;
  description: string;
  projectUrl?: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  type?: string | null;
  isVisible?: boolean;
  tech: string[];
  highlights: string[];
  startDate: string | null;
  endDate: string | null;
  order: number;
}

export interface IAdminProjectEditor {
  id?: number;
  title: string;
  description: string;
  projectUrl: string;
  repoUrl: string;
  liveUrl: string;
  type: string;
  isVisible: boolean;
  tech: string[];
  highlights: string[];
  startDate: string;
  endDate: string;
  order: number;
}

export interface IAdminEducationApi {
  id?: number;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  description: string | null;
  order: number;
}

export interface IAdminEducationEditor {
  id?: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  order: number;
}

export interface IAdminCertificationApi {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  link: string | null;
  order: number;
}

export interface IAdminCertificationEditor {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  link: string;
  order: number;
}

export interface IAdminAchievementApi {
  id?: number;
  title: string;
  date: string | null;
  link: string | null;
  order: number;
}

export interface IAdminAchievementEditor {
  id?: number;
  title: string;
  date: string;
  link: string;
  order: number;
}

export interface IAdminLanguageApi {
  id?: number;
  name: string;
  level: string;
}

export interface IAdminLanguageEditor {
  id?: number;
  name: string;
  level: string;
}

export interface IAdminScanReportApi {
  id?: number;
  type: string;
  commitSha: string | null;
  runAt: string;
  summary: Record<string, unknown> | null;
  artifactUrl: string | null;
}

export interface IAdminScanReportEditor {
  id?: number;
  type: string;
  commitSha: string;
  runAt: string;
  summaryText: string;
  artifactUrl: string;
}

export interface IAdminPortfolioApi {
  user: IAdminUserApi;
  repoData: IAdminRepoDataApi;
  bottomHeadlines: IAdminBottomHeadlineApi[];
  skills: IAdminSkillApi[];
  experiences: IAdminExperienceApi[];
  projects: IAdminProjectApi[];
  education: IAdminEducationApi[];
  certifications: IAdminCertificationApi[];
  achievements: IAdminAchievementApi[];
  languages: IAdminLanguageApi[];
  scanReports: IAdminScanReportApi[];
}

export interface IAdminPortfolioEditor {
  user: IAdminUserEditor;
  repoData: IAdminRepoDataEditor;
  bottomHeadlines: IAdminBottomHeadlineEditor[];
  skills: IAdminSkillEditor[];
  experiences: IAdminExperienceEditor[];
  projects: IAdminProjectEditor[];
  education: IAdminEducationEditor[];
  certifications: IAdminCertificationEditor[];
  achievements: IAdminAchievementEditor[];
  languages: IAdminLanguageEditor[];
  scanReports: IAdminScanReportEditor[];
}

export interface IAdminSessionResponse {
  authenticated: boolean;
  expiresAt: string | null;
}
