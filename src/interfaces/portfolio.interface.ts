import type {
  IAchievements,
  ICertifications,
  IEducation,
  IExperience,
  ILanguages,
  IProjects,
  ISkill,
  IscanReports,
} from '@/interfaces/user.interface';


export interface IPortfolio {
  name: string;
  email: string;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  socials?: ISocials;
  skills: ISkill[];
  experiences: IExperience[];
  projects?: IProjects[];
  education: IEducation[];
  certifications?: ICertifications[];
  achievements?: IAchievements[];
  languages?: ILanguages[];
  scanReports?: IscanReports[];
  bottomHeadline?: string[]; // NEW
}

export interface ISocials {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}