// Aggregate Portfolio DTO assembling atomic user-related DTOs
import { 
  SkillDto,
  ExperienceDto,
  ProjectDto,
  EducationDto,
  CertificationDto,
  AchievementDto,
  LanguageDto,
  SocialsDto
} from './user.dto';

export interface PortfolioDto {
  name: string;
  email: string;
  headline?: string;
  summary?: string;
  location?: string;
  socials?: SocialsDto;
  skills: SkillDto[];
  experiences: ExperienceDto[];
  projects?: ProjectDto[];
  education: EducationDto[];
  certifications?: CertificationDto[];
  achievements?: AchievementDto[];
  languages?: LanguageDto[];
  bottomHeadline?: string[];
  homepageProjects?: HomepageProjectDto[];
}


export interface HomepageProjectDto {
  id?: number;
  title: string;
  url: string;
  order: number;
}
