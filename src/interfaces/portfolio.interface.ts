import type {
  IAchievements,
  ICertifications,
  IEducation,
  IExperience,
  ILanguages,
  IProjects,
  ISkill,
} from '@/interfaces/user.interface';


export interface IPortfolio {
  name: string;
  email: string;
  headline?: string;
  summary?: string;
  location?: string;
  socials?: ISocials;
  skills: ISkill[];
  experiences: IExperience[];
  projects?: IProjects[];
  education: IEducation[];
  certifications?: ICertifications[];
  achievements?: IAchievements[];
  languages?: ILanguages[];
  bottomHeadline?: string[];
  homepageProjects?: IHomepageProject[];
}

export interface ISocials {
  github?: string;
  linkedin?: string;
}

export interface IHomepageProject {
  id?: number;
  title: string;
  url: string;
  order: number;
}
