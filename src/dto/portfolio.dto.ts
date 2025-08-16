// Aggregate Portfolio DTO assembling atomic user-related DTOs
import { 
  SkillDto,
  ExperienceDto,
  ProjectDto,
  EducationDto,
  CertificationDto,
  AchievementDto,
  LanguageDto,
  ScanReportDto,
  SocialsDto,
  ToolDocDto
} from './user.dto';

export interface PortfolioDto {
  name: string;
  email: string;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  socials?: SocialsDto;
  skills: SkillDto[];
  experiences: ExperienceDto[];
  projects?: ProjectDto[];
  education: EducationDto[];
  certifications?: CertificationDto[];
  achievements?: AchievementDto[];
  languages?: LanguageDto[];
  scanReports?: ScanReportDto[];
  bottomHeadline?: string[];
  copyrights?: string;
  toolDocs?: ToolDocDto[]; 
}
