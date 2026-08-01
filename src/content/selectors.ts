import type { IPortfolio } from "@/interfaces/portfolio.interface";
import type {
  IAchievements,
  ICertifications,
  IProjects,
  ISkill,
} from "@/interfaces/user.interface";
import { projectShowcaseContent } from "./projects";
import { siteContent } from "./site";
import { skillContent } from "./skills";

export function selectFeaturedProjects(projects: IProjects[] = []): IProjects[] {
  const visible = projects.filter(
    (project) => project.isVisible !== false && project.title.trim(),
  );
  const byTitle = new Map(visible.map((project) => [project.title, project]));
  const selected = projectShowcaseContent.featuredTitles
    .map((title) => byTitle.get(title))
    .filter((project): project is IProjects => Boolean(project));

  for (const project of visible) {
    if (selected.length >= 3) break;
    if (!selected.includes(project)) selected.push(project);
  }

  return selected;
}

export function selectAiSkills(skills: ISkill[] = []): ISkill[] {
  const byName = new Map(skills.map((skill) => [skill.name.toLowerCase(), skill]));
  return siteContent.aiFocus.skillPriority
    .map((name) => byName.get(name.toLowerCase()))
    .filter((skill): skill is ISkill => Boolean(skill));
}

export function selectStrongestSkills(skills: ISkill[] = []): ISkill[] {
  const byName = new Map(skills.map((skill) => [skill.name.toLowerCase(), skill]));
  return siteContent.strongestTechnologies
    .map((name) => byName.get(name.toLowerCase()))
    .filter((skill): skill is ISkill => Boolean(skill));
}

export function resolveCandidateIdentity(portfolio: IPortfolio | null) {
  return {
    name: portfolio?.name || siteContent.identity.fullName,
    email: portfolio?.email || siteContent.identity.email,
    location: portfolio?.location || siteContent.identity.location,
    github: portfolio?.socials?.github || siteContent.links.github,
    linkedin: portfolio?.socials?.linkedin || siteContent.links.linkedin,
  };
}

export function resolveProfessionalSummary(summary?: string) {
  const normalized = summary?.trim();
  if (!normalized || /^Hi, I[’']m Sai Kiran\b/i.test(normalized)) {
    return siteContent.identity.summary;
  }
  return normalized;
}

export function groupRecruiterSkills(skills: ISkill[] = []) {
  return skillContent.categoryOrder
    .map((category) => ({
      category,
      label: skillContent.categoryLabels[category] || category,
      skills: skills.filter((skill) => skill.category === category),
    }))
    .filter((group) => group.skills.length);
}

export function selectRelevantCertifications(
  certifications: ICertifications[] = [],
) {
  return certifications
    .filter((item) => !/sales accredit/i.test(item.title))
    .slice(0, 8);
}

export function selectRecruiterAchievements(
  achievements: IAchievements[] = [],
) {
  return achievements
    .filter((item) => !/client retention|sales accredit|zero escalation/i.test(item.title))
    .slice(0, 8);
}
