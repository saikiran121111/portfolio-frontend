import type {
  IAdminAchievementApi,
  IAdminAchievementEditor,
  IAdminBottomHeadlineApi,
  IAdminBottomHeadlineEditor,
  IAdminCertificationApi,
  IAdminCertificationEditor,
  IAdminEducationApi,
  IAdminEducationEditor,
  IAdminExperienceApi,
  IAdminExperienceEditor,
  IAdminLanguageApi,
  IAdminLanguageEditor,
  IAdminPortfolioApi,
  IAdminPortfolioEditor,
  IAdminProjectApi,
  IAdminProjectEditor,
  IAdminScanReportApi,
  IAdminScanReportEditor,
  IAdminSkillApi,
  IAdminSkillEditor,
} from "@/interfaces/admin.interface";

const toEditorValue = (value: string | null | undefined) => value ?? "";
const toNullableApiValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

function toDateInputValue(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const normalized = new Date(value);
  if (Number.isNaN(normalized.getTime())) {
    return "";
  }

  return normalized.toISOString().slice(0, 10);
}

function toDateTimeLocalInputValue(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseSummaryText(
  summaryText: string,
  index: number,
): Record<string, unknown> | null {
  const trimmed = summaryText.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Summary must be a JSON object");
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    const suffix =
      error instanceof Error && error.message
        ? `: ${error.message}`
        : "";
    throw new Error(`scanReports[${index}].summaryText is invalid JSON${suffix}`);
  }
}

function toIsoDateTime(value: string, fieldName: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid datetime`);
  }

  return date.toISOString();
}

export function mapAdminPortfolioToEditor(
  payload: IAdminPortfolioApi,
): IAdminPortfolioEditor {
  return {
    user: {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      avatarUrl: toEditorValue(payload.user.avatarUrl),
      headline: toEditorValue(payload.user.headline),
      summary: toEditorValue(payload.user.summary),
      copyrights: toEditorValue(payload.user.copyrights),
      location: toEditorValue(payload.user.location),
      phone: toEditorValue(payload.user.phone),
      socials: {
        github: toEditorValue(payload.user.socials.github),
        linkedin: toEditorValue(payload.user.socials.linkedin),
        portfolio: toEditorValue(payload.user.socials.portfolio),
      },
    },
    repoData: {
      nestJSGitRepo: toEditorValue(payload.repoData.nestJSGitRepo),
      nestJSDeployedServer: toEditorValue(payload.repoData.nestJSDeployedServer),
      nestJSSwaggerUrl: toEditorValue(payload.repoData.nestJSSwaggerUrl),
      nextJSGitRepo: toEditorValue(payload.repoData.nextJSGitRepo),
      nextJSDeployedServer: toEditorValue(payload.repoData.nextJSDeployedServer),
      postgresDeployedServer: toEditorValue(
        payload.repoData.postgresDeployedServer,
      ),
    },
    bottomHeadlines: payload.bottomHeadlines.map(
      (item: IAdminBottomHeadlineApi): IAdminBottomHeadlineEditor => ({
        id: item.id,
        text: item.text,
        order: item.order,
      }),
    ),
    skills: payload.skills.map(
      (item: IAdminSkillApi): IAdminSkillEditor => ({
        id: item.id,
        name: item.name,
        category: item.category,
        level: item.level,
        order: item.order,
      }),
    ),
    experiences: payload.experiences.map(
      (item: IAdminExperienceApi): IAdminExperienceEditor => ({
        id: item.id,
        title: item.title,
        company: item.company,
        location: toEditorValue(item.location),
        startDate: toDateInputValue(item.startDate),
        endDate: toDateInputValue(item.endDate),
        description: toEditorValue(item.description),
        bullets: item.bullets ?? [],
        techStack: item.techStack ?? [],
        order: item.order,
      }),
    ),
    projects: payload.projects.map(
      (item: IAdminProjectApi): IAdminProjectEditor => ({
        id: item.id,
        title: item.title,
        description: item.description,
        repoUrl: toEditorValue(item.repoUrl),
        liveUrl: toEditorValue(item.liveUrl),
        tech: item.tech ?? [],
        highlights: item.highlights ?? [],
        startDate: toDateInputValue(item.startDate),
        endDate: toDateInputValue(item.endDate),
        order: item.order,
      }),
    ),
    education: payload.education.map(
      (item: IAdminEducationApi): IAdminEducationEditor => ({
        id: item.id,
        institution: item.institution,
        degree: item.degree,
        field: toEditorValue(item.field),
        startDate: toDateInputValue(item.startDate),
        endDate: toDateInputValue(item.endDate),
        location: toEditorValue(item.location),
        description: toEditorValue(item.description),
        order: item.order,
      }),
    ),
    certifications: payload.certifications.map(
      (item: IAdminCertificationApi): IAdminCertificationEditor => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: toDateInputValue(item.date),
        link: toEditorValue(item.link),
        order: item.order,
      }),
    ),
    achievements: payload.achievements.map(
      (item: IAdminAchievementApi): IAdminAchievementEditor => ({
        id: item.id,
        title: item.title,
        date: toDateInputValue(item.date),
        link: toEditorValue(item.link),
        order: item.order,
      }),
    ),
    languages: payload.languages.map(
      (item: IAdminLanguageApi): IAdminLanguageEditor => ({
        id: item.id,
        name: item.name,
        level: item.level,
      }),
    ),
    scanReports: payload.scanReports.map(
      (item: IAdminScanReportApi): IAdminScanReportEditor => ({
        id: item.id,
        type: item.type,
        commitSha: toEditorValue(item.commitSha),
        runAt: toDateTimeLocalInputValue(item.runAt),
        summaryText: JSON.stringify(item.summary ?? {}, null, 2),
        artifactUrl: toEditorValue(item.artifactUrl),
      }),
    ),
  };
}

export function mapEditorPortfolioToApi(
  payload: IAdminPortfolioEditor,
): IAdminPortfolioApi {
  return {
    user: {
      id: payload.user.id,
      name: payload.user.name.trim(),
      email: payload.user.email.trim(),
      avatarUrl: toNullableApiValue(payload.user.avatarUrl),
      headline: toNullableApiValue(payload.user.headline),
      summary: toNullableApiValue(payload.user.summary),
      copyrights: toNullableApiValue(payload.user.copyrights),
      location: toNullableApiValue(payload.user.location),
      phone: toNullableApiValue(payload.user.phone),
      socials: {
        github: toNullableApiValue(payload.user.socials.github),
        linkedin: toNullableApiValue(payload.user.socials.linkedin),
        portfolio: toNullableApiValue(payload.user.socials.portfolio),
      },
    },
    repoData: {
      nestJSGitRepo: toNullableApiValue(payload.repoData.nestJSGitRepo),
      nestJSDeployedServer: toNullableApiValue(
        payload.repoData.nestJSDeployedServer,
      ),
      nestJSSwaggerUrl: toNullableApiValue(payload.repoData.nestJSSwaggerUrl),
      nextJSGitRepo: toNullableApiValue(payload.repoData.nextJSGitRepo),
      nextJSDeployedServer: toNullableApiValue(
        payload.repoData.nextJSDeployedServer,
      ),
      postgresDeployedServer: toNullableApiValue(
        payload.repoData.postgresDeployedServer,
      ),
    },
    bottomHeadlines: payload.bottomHeadlines.map((item, index) => ({
      id: item.id,
      text: item.text,
      order: index,
    })),
    skills: payload.skills.map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      level: item.level,
      order: index,
    })),
    experiences: payload.experiences.map((item, index) => ({
      id: item.id,
      title: item.title,
      company: item.company,
      location: toNullableApiValue(item.location),
      startDate: item.startDate.trim(),
      endDate: toNullableApiValue(item.endDate),
      description: toNullableApiValue(item.description),
      bullets: item.bullets,
      techStack: item.techStack,
      order: index,
    })),
    projects: payload.projects.map((item, index) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      repoUrl: toNullableApiValue(item.repoUrl),
      liveUrl: toNullableApiValue(item.liveUrl),
      tech: item.tech,
      highlights: item.highlights,
      startDate: toNullableApiValue(item.startDate),
      endDate: toNullableApiValue(item.endDate),
      order: index,
    })),
    education: payload.education.map((item, index) => ({
      id: item.id,
      institution: item.institution,
      degree: item.degree,
      field: toNullableApiValue(item.field),
      startDate: item.startDate.trim(),
      endDate: toNullableApiValue(item.endDate),
      location: toNullableApiValue(item.location),
      description: toNullableApiValue(item.description),
      order: index,
    })),
    certifications: payload.certifications.map((item, index) => ({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      date: item.date.trim(),
      link: toNullableApiValue(item.link),
      order: index,
    })),
    achievements: payload.achievements.map((item, index) => ({
      id: item.id,
      title: item.title,
      date: toNullableApiValue(item.date),
      link: toNullableApiValue(item.link),
      order: index,
    })),
    languages: payload.languages.map((item) => ({
      id: item.id,
      name: item.name,
      level: item.level,
    })),
    scanReports: payload.scanReports.map((item, index) => ({
      id: item.id,
      type: item.type,
      commitSha: toNullableApiValue(item.commitSha),
      runAt: toIsoDateTime(item.runAt, `scanReports[${index}].runAt`),
      summary: parseSummaryText(item.summaryText, index),
      artifactUrl: toNullableApiValue(item.artifactUrl),
    })),
  };
}
