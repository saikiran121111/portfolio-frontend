import { PortfolioDto } from "@/dto/portfolio.dto";
import { IPortfolio } from "@/interfaces/portfolio.interface";

function safePublicUrl(value?: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const usesHttp = parsed.protocol === "https:" || parsed.protocol === "http:";
    return usesHttp && !parsed.username && !parsed.password ? trimmed : null;
  } catch {
    return null;
  }
}

export function mapPortfolio(dto: PortfolioDto): IPortfolio {
  return {
    name: dto.name,
    email: dto.email,
    headline: dto.headline,
    summary: dto.summary,
    location: dto.location,
    socials: dto.socials
      ? {
          github: safePublicUrl(dto.socials.github) ?? undefined,
          linkedin: safePublicUrl(dto.socials.linkedin) ?? undefined,
        }
      : undefined,
    skills: dto.skills.map((skill) => ({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    })),
    experiences: dto.experiences.map((experience) => ({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: new Date(experience.startDate),
      endDate: experience.endDate ? new Date(experience.endDate) : null,
      description: experience.description,
      bullets: [...experience.bullets],
      techStack: [...experience.techStack],
    })),
    projects: dto.projects
      ?.filter((project) => project.isVisible !== false)
      .map((project) => ({
        title: project.title,
        description: project.description,
        projectUrl: safePublicUrl(project.projectUrl),
        repoUrl: safePublicUrl(project.repoUrl),
        liveUrl: safePublicUrl(project.liveUrl),
        type: project.type,
        isVisible: project.isVisible,
        tech: [...project.tech],
        highlights: [...project.highlights],
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
      })),
    education: dto.education.map((education) => ({
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      startDate: new Date(education.startDate),
      endDate: education.endDate ? new Date(education.endDate) : null,
      description: education.description,
    })),
    certifications: dto.certifications?.map((certification) => ({
      title: certification.title,
      issuer: certification.issuer,
      date: new Date(certification.date),
      link: safePublicUrl(certification.link),
    })),
    achievements: dto.achievements?.map((achievement) => ({
      title: achievement.title,
      date: achievement.date ? new Date(achievement.date) : null,
    })),
    languages: dto.languages?.map((language) => ({
      name: language.name,
      level: language.level,
    })),
    bottomHeadline: dto.bottomHeadline
      ? [...dto.bottomHeadline]
      : undefined,
    homepageProjects: dto.homepageProjects?.map((project) => ({
      title: project.title,
      url: safePublicUrl(project.url) ?? "",
      order: project.order,
    })),
  };
}
