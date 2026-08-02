import type { IHomepageProject, IPortfolio } from "@/interfaces/portfolio.interface";
import type {
  IAchievements,
  ICertifications,
  IExperience,
  IProjects,
  ISkill,
} from "@/interfaces/user.interface";
import { siteContent } from "./site";
import { skillContent } from "./skills";

export function selectFeaturedProjects(
  projects: IProjects[] = [],
  homepageProjects: IHomepageProject[] = [],
): IProjects[] {
  const visible = projects.filter(
    (project) => project.isVisible !== false && project.title.trim(),
  );
  const normalizedTitle = (value: string) => value.trim().toLowerCase();
  const normalizedUrl = (value: string) =>
    value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const byTitle = new Map(
    visible.map((project) => [normalizedTitle(project.title), project]),
  );
  const selected = [...homepageProjects]
    .sort((left, right) => left.order - right.order)
    .map((item) => {
      const titleMatch = byTitle.get(normalizedTitle(item.title));
      if (titleMatch) return titleMatch;

      const requestedUrl = normalizedUrl(item.url);
      return visible.find((project) =>
        [project.projectUrl, project.liveUrl, project.repoUrl]
          .filter((url): url is string => Boolean(url))
          .some((url) => normalizedUrl(url) === requestedUrl),
      );
    })
    .filter((project): project is IProjects => Boolean(project));

  for (const project of visible) {
    if (selected.length >= 3) break;
    if (!selected.includes(project)) selected.push(project);
  }

  return selected;
}

export function selectAiSkills(skills: ISkill[] = []): ISkill[] {
  return skills.filter(
    (skill) => skill.category.trim().toLowerCase() === "ai" && skill.name.trim(),
  );
}

const foundationCategories = new Set([
  "backend",
  "database",
  "nodeenv",
  "openapi",
  "orm",
]);

const deliveryCategories = new Set([
  "frontend",
  "cloud platform",
  "apache sling",
]);

const skillLevelRank: Record<string, number> = {
  expert: 4,
  advanced: 3,
  intermediate: 2,
  beginner: 1,
};

function rankedSkills(skills: ISkill[]) {
  return skills
    .map((skill, index) => ({ skill, index }))
    .sort((left, right) => {
      const levelDifference =
        (skillLevelRank[right.skill.level.trim().toLowerCase()] ?? 0)
        - (skillLevelRank[left.skill.level.trim().toLowerCase()] ?? 0);
      return levelDifference || left.index - right.index;
    })
    .map(({ skill }) => skill);
}

export function selectStrongestSkills(skills: ISkill[] = []): ISkill[] {
  const foundationSkills = skills.filter((skill) =>
    foundationCategories.has(skill.category.trim().toLowerCase()),
  );
  const candidates = foundationSkills.length
    ? foundationSkills
    : skills.filter((skill) => skill.category.trim().toLowerCase() !== "ai");

  return rankedSkills(candidates).slice(0, 6);
}

export function resolveCandidateIdentity(portfolio: IPortfolio | null) {
  return {
    name: portfolio?.name || siteContent.identity.fullName,
    email: portfolio?.email || siteContent.identity.email,
    location: portfolio?.location || siteContent.identity.location,
    headline: portfolio?.headline?.trim() || siteContent.identity.headline,
    summary: resolveProfessionalSummary(portfolio?.summary),
    availability: portfolio?.bottomHeadline?.find((line) =>
      /\b(open to|seeking)\b/i.test(line),
    ),
    github: portfolio?.socials?.github || siteContent.links.github,
    linkedin: portfolio?.socials?.linkedin || siteContent.links.linkedin,
  };
}

export function resolveProfessionalSummary(summary?: string) {
  return summary?.trim() || siteContent.identity.summary;
}

export function createHomepageSummary(summary: string, maximumLength = 360) {
  if (summary.length <= maximumLength) return summary;

  const sentences = summary.match(/[^.!?]+[.!?]+/g) ?? [];
  const excerpt = sentences
    .reduce<string[]>((selected, sentence) => {
      const candidate = [...selected, sentence.trim()].join(" ");
      return candidate.length <= maximumLength ? [...selected, sentence.trim()] : selected;
    }, [])
    .join(" ");

  if (excerpt) return excerpt;
  const shortened = summary.slice(0, maximumLength);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : maximumLength).trim()}…`;
}

export function experienceLabel(experiences: IExperience[] = [], now = new Date()) {
  if (!experiences.length) return undefined;

  const ranges = experiences
    .map((experience) => ({
      start: experience.startDate.getTime(),
      end: (experience.endDate ?? now).getTime(),
    }))
    .filter((range) => Number.isFinite(range.start) && Number.isFinite(range.end))
    .sort((left, right) => left.start - right.start);

  if (!ranges.length) return undefined;

  const merged = ranges.reduce<Array<{ start: number; end: number }>>((result, range) => {
    const previous = result.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      result.push({ ...range });
    }
    return result;
  }, []);

  const milliseconds = merged.reduce(
    (total, range) => total + Math.max(0, range.end - range.start),
    0,
  );
  const years = Math.floor(milliseconds / (365.2425 * 24 * 60 * 60 * 1000));
  return years > 0 ? `${years}+ years` : "Less than 1 year";
}

export function currentRole(experiences: IExperience[] = []) {
  return [...experiences]
    .sort((left, right) => right.startDate.getTime() - left.startDate.getTime())
    .at(0);
}

function naturalList(values: string[]) {
  if (values.length < 2) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

export function aiFocusContent(skills: ISkill[] = []) {
  const aiSkills = selectAiSkills(skills);
  const category = aiSkills[0]?.category.trim() || "AI";
  return {
    title: `${category} engineering`,
    status: "Current skills",
    summary: aiSkills.length
      ? `${naturalList(aiSkills.map((skill) => skill.name))}.`
      : "",
  };
}

export function engineeringFocusAreas(skills: ISkill[] = []) {
  const foundation = selectStrongestSkills(skills).slice(0, 4);
  const delivery = rankedSkills(
    skills.filter((skill) =>
      deliveryCategories.has(skill.category.trim().toLowerCase()),
    ),
  ).slice(0, 4);
  const ai = selectAiSkills(skills).slice(0, 4);

  return [
    {
      number: "01",
      label: "Foundation",
      title: "Backend engineering",
      detail: foundation.map((skill) => skill.name).join(", "),
    },
    {
      number: "02",
      label: "Production delivery",
      title: "Full-stack delivery",
      detail: delivery.map((skill) => skill.name).join(", "),
    },
    {
      number: "03",
      label: "Current direction",
      title: "AI engineering",
      detail: ai.map((skill) => skill.name).join(", "),
    },
  ].filter((area) => area.detail);
}

export function groupRecruiterSkills(skills: ISkill[] = []) {
  const listedCategories = Array.from(
    new Set(skills.map((skill) => skill.category).filter(Boolean)),
  );
  const preferredCategories = skillContent.categoryOrder.filter((category) =>
    listedCategories.includes(category),
  );
  const preferredCategorySet = new Set<string>(preferredCategories);
  const additionalCategories = listedCategories
    .filter((category) => !preferredCategorySet.has(category))
    .sort((left, right) => left.localeCompare(right));

  return [...preferredCategories, ...additionalCategories]
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
