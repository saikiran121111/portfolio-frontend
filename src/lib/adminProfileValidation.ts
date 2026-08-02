import type { IAdminPortfolioEditor } from "@/interfaces/admin.interface";

export interface AdminProfileValidationResult {
  success: boolean;
  data?: IAdminPortfolioEditor;
  fieldErrors: Record<string, string>;
}

type UnknownRecord = Record<string, unknown>;

const ROOT_FIELDS = [
  "user",
  "repoData",
  "bottomHeadlines",
  "skills",
  "experiences",
  "projects",
  "education",
  "certifications",
  "achievements",
  "languages",
  "scanReports",
  "homepageProjects",
] as const;

const OBJECT_FIELDS: Record<string, readonly string[]> = {
  user: ["id", "name", "email", "avatarUrl", "headline", "summary", "copyrights", "location", "phone", "socials"],
  "user.socials": ["github", "linkedin", "portfolio"],
  repoData: ["nestJSGitRepo", "nestJSDeployedServer", "nestJSSwaggerUrl", "nextJSGitRepo", "nextJSDeployedServer", "postgresDeployedServer"],
  bottomHeadlines: ["id", "text", "order"],
  skills: ["id", "name", "category", "level", "order"],
  experiences: ["id", "title", "company", "location", "startDate", "endDate", "description", "bullets", "techStack", "order"],
  projects: ["id", "title", "description", "projectUrl", "repoUrl", "liveUrl", "type", "isVisible", "tech", "highlights", "startDate", "endDate", "order"],
  education: ["id", "institution", "degree", "field", "startDate", "endDate", "location", "description", "order"],
  certifications: ["id", "title", "issuer", "date", "link", "order"],
  achievements: ["id", "title", "date", "link", "order"],
  languages: ["id", "name", "level"],
  scanReports: ["id", "type", "commitSha", "runAt", "summaryText", "artifactUrl"],
  homepageProjects: ["id", "title", "url", "order"],
};

const URL_FIELDS = new Set([
  "user.avatarUrl",
  "user.socials.github",
  "user.socials.linkedin",
  "user.socials.portfolio",
  "repoData.nestJSGitRepo",
  "repoData.nestJSDeployedServer",
  "repoData.nestJSSwaggerUrl",
  "repoData.nextJSGitRepo",
  "repoData.nextJSDeployedServer",
  "repoData.postgresDeployedServer",
]);

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function addError(errors: Record<string, string>, path: string, message: string) {
  if (!errors[path]) errors[path] = message;
}

function rejectUnsupportedFields(
  value: unknown,
  allowed: readonly string[],
  path: string,
  errors: Record<string, string>,
) {
  if (!isRecord(value)) {
    addError(errors, path, "Must be an object");
    return;
  }

  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      addError(errors, path ? `${path}.${key}` : key, "Unsupported field");
    }
  }
}

function checkSubmittedShape(payload: unknown, errors: Record<string, string>) {
  rejectUnsupportedFields(payload, ROOT_FIELDS, "", errors);
  if (!isRecord(payload)) return;

  for (const objectKey of ["user", "repoData"] as const) {
    if (payload[objectKey] === undefined) continue;
    rejectUnsupportedFields(payload[objectKey], OBJECT_FIELDS[objectKey], objectKey, errors);
  }

  if (isRecord(payload.user) && payload.user.socials !== undefined) {
    rejectUnsupportedFields(payload.user.socials, OBJECT_FIELDS["user.socials"], "user.socials", errors);
  }

  for (const collection of ROOT_FIELDS.filter(
    (key) => !["user", "repoData"].includes(key),
  )) {
    const value = payload[collection];
    if (value === undefined) continue;
    if (!Array.isArray(value)) {
      addError(errors, collection, "Must be an array");
      continue;
    }
    value.forEach((item, index) => {
      rejectUnsupportedFields(item, OBJECT_FIELDS[collection], `${collection}[${index}]`, errors);
    });
  }
}

function sanitizeText(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function sanitizeUnknown(value: unknown): unknown {
  if (typeof value === "string") return sanitizeText(value);
  if (Array.isArray(value)) return value.map(sanitizeUnknown);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeUnknown(entry)]),
    );
  }
  return value;
}

function mergeWithCurrent(payload: UnknownRecord, current: IAdminPortfolioEditor) {
  const submittedUser = isRecord(payload.user) ? payload.user : undefined;
  const submittedSocials = submittedUser && isRecord(submittedUser.socials)
    ? submittedUser.socials
    : undefined;
  const submittedRepoData = isRecord(payload.repoData) ? payload.repoData : undefined;

  return {
    ...current,
    ...payload,
    user: {
      ...current.user,
      ...submittedUser,
      socials: {
        ...current.user.socials,
        ...submittedSocials,
      },
    },
    repoData: {
      ...current.repoData,
      ...submittedRepoData,
    },
  };
}

function validateString(
  value: unknown,
  path: string,
  errors: Record<string, string>,
  options: { required?: boolean; max?: number } = {},
) {
  if (typeof value !== "string") {
    addError(errors, path, "Must be text");
    return;
  }
  if (options.required && !value) addError(errors, path, "Required");
  if (value.length > (options.max ?? 500)) {
    addError(errors, path, `Must be ${options.max ?? 500} characters or fewer`);
  }
}

function validateOptionalId(value: unknown, path: string, errors: Record<string, string>) {
  if (value !== undefined && (!Number.isInteger(value) || Number(value) < 1)) {
    addError(errors, path, "Must be a positive integer");
  }
}

function validateOrder(value: unknown, path: string, errors: Record<string, string>) {
  if (!Number.isInteger(value) || Number(value) < 0) {
    addError(errors, path, "Must be a non-negative integer");
  }
}

function validateUrl(value: unknown, path: string, errors: Record<string, string>) {
  validateString(value, path, errors, { max: 2048 });
  if (typeof value !== "string" || !value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
  } catch {
    addError(errors, path, "Must be a valid HTTP or HTTPS URL");
  }
}

function validateDate(value: unknown, path: string, errors: Record<string, string>, required = false) {
  validateString(value, path, errors, { required, max: 30 });
  if (typeof value !== "string" || !value) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())) {
    addError(errors, path, "Must be a valid date in YYYY-MM-DD format");
  }
}

function validateStringList(
  value: unknown,
  path: string,
  errors: Record<string, string>,
  maxItems = 40,
) {
  if (!Array.isArray(value)) {
    addError(errors, path, "Must be an array of text values");
    return;
  }
  if (value.length > maxItems) addError(errors, path, `Must contain ${maxItems} items or fewer`);
  value.forEach((item, index) => validateString(item, `${path}[${index}]`, errors, { required: true, max: 1000 }));
}

function validateCollection(
  value: unknown,
  path: string,
  errors: Record<string, string>,
  validateItem: (item: UnknownRecord, itemPath: string) => void,
) {
  if (!Array.isArray(value)) {
    addError(errors, path, "Must be an array");
    return;
  }
  if (value.length > 100) addError(errors, path, "Must contain 100 items or fewer");
  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(item)) addError(errors, itemPath, "Must be an object");
    else validateItem(item, itemPath);
  });
}

function validateProfile(data: UnknownRecord, errors: Record<string, string>) {
  if (!isRecord(data.user)) addError(errors, "user", "Must be an object");
  else {
    validateOptionalId(data.user.id, "user.id", errors);
    validateString(data.user.name, "user.name", errors, { required: true, max: 120 });
    validateString(data.user.email, "user.email", errors, { required: true, max: 254 });
    if (typeof data.user.email === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user.email)) {
      addError(errors, "user.email", "Must be a valid email address");
    }
    for (const field of ["avatarUrl", "headline", "copyrights", "location", "phone"] as const) {
      validateString(data.user[field], `user.${field}`, errors, { max: field === "headline" ? 180 : 300 });
    }
    validateString(data.user.summary, "user.summary", errors, { max: 5000 });
    if (!isRecord(data.user.socials)) addError(errors, "user.socials", "Must be an object");
    else {
      for (const field of ["github", "linkedin", "portfolio"] as const) {
        validateUrl(data.user.socials[field], `user.socials.${field}`, errors);
      }
    }
  }

  if (!isRecord(data.repoData)) addError(errors, "repoData", "Must be an object");
  else {
    for (const field of OBJECT_FIELDS.repoData) {
      const path = `repoData.${field}`;
      if (URL_FIELDS.has(path)) validateUrl(data.repoData[field], path, errors);
    }
  }

  validateCollection(data.bottomHeadlines, "bottomHeadlines", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    validateString(item.text, `${path}.text`, errors, { required: true, max: 180 });
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.skills, "skills", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    for (const field of ["name", "category", "level"] as const) validateString(item[field], `${path}.${field}`, errors, { required: true, max: 120 });
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.experiences, "experiences", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    for (const field of ["title", "company"] as const) validateString(item[field], `${path}.${field}`, errors, { required: true, max: 180 });
    validateString(item.location, `${path}.location`, errors, { max: 180 });
    validateString(item.description, `${path}.description`, errors, { max: 3000 });
    validateDate(item.startDate, `${path}.startDate`, errors, true);
    validateDate(item.endDate, `${path}.endDate`, errors);
    validateStringList(item.bullets, `${path}.bullets`, errors);
    validateStringList(item.techStack, `${path}.techStack`, errors);
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.projects, "projects", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    validateString(item.title, `${path}.title`, errors, { required: true, max: 180 });
    validateString(item.description, `${path}.description`, errors, { required: true, max: 6000 });
    for (const field of ["projectUrl", "repoUrl", "liveUrl"] as const) validateUrl(item[field], `${path}.${field}`, errors);
    validateString(item.type, `${path}.type`, errors, { max: 120 });
    if (typeof item.isVisible !== "boolean") addError(errors, `${path}.isVisible`, "Must be true or false");
    validateStringList(item.tech, `${path}.tech`, errors);
    validateStringList(item.highlights, `${path}.highlights`, errors);
    validateDate(item.startDate, `${path}.startDate`, errors);
    validateDate(item.endDate, `${path}.endDate`, errors);
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.education, "education", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    for (const field of ["institution", "degree"] as const) validateString(item[field], `${path}.${field}`, errors, { required: true, max: 220 });
    for (const field of ["field", "location"] as const) validateString(item[field], `${path}.${field}`, errors, { max: 220 });
    validateString(item.description, `${path}.description`, errors, { max: 3000 });
    validateDate(item.startDate, `${path}.startDate`, errors, true);
    validateDate(item.endDate, `${path}.endDate`, errors);
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.certifications, "certifications", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    validateString(item.title, `${path}.title`, errors, { required: true, max: 220 });
    validateString(item.issuer, `${path}.issuer`, errors, { required: true, max: 180 });
    validateDate(item.date, `${path}.date`, errors, true);
    validateUrl(item.link, `${path}.link`, errors);
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.achievements, "achievements", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    validateString(item.title, `${path}.title`, errors, { required: true, max: 1000 });
    validateDate(item.date, `${path}.date`, errors);
    validateUrl(item.link, `${path}.link`, errors);
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.languages, "languages", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    validateString(item.name, `${path}.name`, errors, { required: true, max: 120 });
    validateString(item.level, `${path}.level`, errors, { required: true, max: 120 });
  });
  validateCollection(data.homepageProjects, "homepageProjects", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    validateString(item.title, `${path}.title`, errors, { required: true, max: 180 });
    validateUrl(item.url, `${path}.url`, errors);
    validateOrder(item.order, `${path}.order`, errors);
  });
  validateCollection(data.scanReports, "scanReports", errors, (item, path) => {
    validateOptionalId(item.id, `${path}.id`, errors);
    validateString(item.type, `${path}.type`, errors, { required: true, max: 120 });
    validateString(item.commitSha, `${path}.commitSha`, errors, { max: 120 });
    validateString(item.runAt, `${path}.runAt`, errors, { required: true, max: 40 });
    if (typeof item.runAt === "string" && Number.isNaN(new Date(item.runAt).getTime())) addError(errors, `${path}.runAt`, "Must be a valid datetime");
    validateString(item.summaryText, `${path}.summaryText`, errors, { max: 10000 });
    if (typeof item.summaryText === "string" && item.summaryText) {
      try {
        const parsed = JSON.parse(item.summaryText) as unknown;
        if (!isRecord(parsed)) throw new Error();
      } catch {
        addError(errors, `${path}.summaryText`, "Must be a valid JSON object");
      }
    }
    validateUrl(item.artifactUrl, `${path}.artifactUrl`, errors);
  });
}

export function validateAdminProfileUpdate(
  payload: unknown,
  current: IAdminPortfolioEditor,
): AdminProfileValidationResult {
  const fieldErrors: Record<string, string> = {};
  checkSubmittedShape(payload, fieldErrors);
  if (!isRecord(payload)) return { success: false, fieldErrors };

  const sanitized = sanitizeUnknown(mergeWithCurrent(payload, current));
  if (!isRecord(sanitized)) {
    addError(fieldErrors, "profile", "Invalid profile payload");
    return { success: false, fieldErrors };
  }

  validateProfile(sanitized, fieldErrors);
  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };

  return {
    success: true,
    data: sanitized as unknown as IAdminPortfolioEditor,
    fieldErrors,
  };
}
