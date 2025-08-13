import { PortfolioDto } from "@/dto/portfolio.dto";
import { IPortfolio } from "@/interfaces/portfolio.interface";

export function mapPortfolio(dto: PortfolioDto): IPortfolio {
  return {
    name: dto.name,
    email: dto.email,
    headline: dto.headline,
    summary: dto.summary,
    location: dto.location,
    phone: dto.phone,
    socials: dto.socials,
    skills: dto.skills,
    experiences: dto.experiences.map(e => ({
      ...e,
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : null,
    })),
    projects: dto.projects?.map(p => ({
      ...p,
      startDate: p.startDate ? new Date(p.startDate) : null,
      endDate: p.endDate ? new Date(p.endDate) : null,
    })),
    education: dto.education.map(ed => ({
      ...ed,
      startDate: new Date(ed.startDate),
      endDate: ed.endDate ? new Date(ed.endDate) : null,
    })),
    certifications: dto.certifications?.map(c => ({
      ...c,
      date: new Date(c.date),
    })),
    achievements: dto.achievements?.map(a => ({
      ...a,
      date: a.date ? new Date(a.date) : null,
    })),
    languages: dto.languages,
    scanReports: dto.scanReports?.map(r => ({
      ...r,
      runAt: new Date(r.runAt),
    })),
  };
}
