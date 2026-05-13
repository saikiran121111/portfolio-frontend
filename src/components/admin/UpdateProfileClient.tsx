"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Clock3,
  Database,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type {
  IAdminAchievementEditor,
  IAdminBottomHeadlineEditor,
  IAdminCertificationEditor,
  IAdminEducationEditor,
  IAdminExperienceEditor,
  IAdminLanguageEditor,
  IAdminHomepageProjectEditor,
  IAdminPortfolioEditor,
  IAdminProjectEditor,
  IAdminScanReportEditor,
  IAdminSessionResponse,
  IAdminSkillEditor,
} from "@/interfaces/admin.interface";
import {
  fetchAdminPortfolio,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  saveAdminPortfolio,
} from "@/services/admin.service";

type MessageState = {
  tone: "success" | "error" | "info";
  text: string;
};

type CollectionKey =
  | "bottomHeadlines"
  | "skills"
  | "experiences"
  | "projects"
  | "education"
  | "certifications"
  | "achievements"
  | "languages"
  | "scanReports"
  | "homepageProjects";

type ExperienceListField = "bullets" | "techStack";
type ProjectListField = "tech" | "highlights";

const panelClassName =
  "rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_30px_80px_rgba(3,10,24,0.35)] backdrop-blur-xl";

function createEmptyBottomHeadline(): IAdminBottomHeadlineEditor {
  return {
    text: "",
    order: 0,
  };
}

function createEmptySkill(): IAdminSkillEditor {
  return {
    name: "",
    category: "",
    level: "",
    order: 0,
  };
}

function createEmptyExperience(): IAdminExperienceEditor {
  return {
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    bullets: [""],
    techStack: [""],
    order: 0,
  };
}

function createEmptyProject(): IAdminProjectEditor {
  return {
    title: "",
    description: "",
    projectUrl: "",
    repoUrl: "",
    liveUrl: "",
    type: "Other",
    isVisible: true,
    tech: [""],
    highlights: [""],
    startDate: "",
    endDate: "",
    order: 0,
  };
}

function createEmptyEducation(): IAdminEducationEditor {
  return {
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    order: 0,
  };
}

function createEmptyCertification(): IAdminCertificationEditor {
  return {
    title: "",
    issuer: "",
    date: "",
    link: "",
    order: 0,
  };
}

function createEmptyAchievement(): IAdminAchievementEditor {
  return {
    title: "",
    date: "",
    link: "",
    order: 0,
  };
}

function createEmptyLanguage(): IAdminLanguageEditor {
  return {
    name: "",
    level: "",
  };
}

function createEmptyHomepageProject(): IAdminHomepageProjectEditor {
  return {
    title: "",
    url: "",
    order: 0,
  };
}

function createEmptyScanReport(): IAdminScanReportEditor {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return {
    type: "",
    commitSha: "",
    runAt: `${year}-${month}-${day}T${hours}:${minutes}`,
    summaryText: "{\n  \n}",
    artifactUrl: "",
  };
}

function formatSessionExpiry(session: IAdminSessionResponse | null): string {
  if (!session?.expiresAt) {
    return "No active session";
  }

  const expiresAt = new Date(session.expiresAt);
  if (Number.isNaN(expiresAt.getTime())) {
    return "Session active";
  }

  return expiresAt.toLocaleString();
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong";
}

function isUnauthorizedMessage(message: string): boolean {
  return message.toLowerCase().includes("unauthorized");
}

export default function UpdateProfileClient() {
  const [session, setSession] = useState<IAdminSessionResponse | null>(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [data, setData] = useState<IAdminPortfolioEditor | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const isAuthenticated = Boolean(session?.authenticated);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const nextSession = await getAdminSession();
        if (!mounted) {
          return;
        }

        setSession(nextSession);
        if (nextSession.authenticated) {
          await loadProfile();
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        setMessage({
          tone: "error",
          text: getErrorMessage(error),
        });
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    async function loadProfile() {
      setLoadingProfile(true);
      try {
        const nextData = await fetchAdminPortfolio();
        if (!mounted) {
          return;
        }

        setData(nextData);
      } catch (error) {
        if (!mounted) {
          return;
        }

        const errorMessage = getErrorMessage(error);
        if (isUnauthorizedMessage(errorMessage)) {
          setSession({
            authenticated: false,
            expiresAt: null,
          });
          setData(null);
          setMessage({
            tone: "info",
            text: "Your admin session expired. Please sign in again.",
          });
          return;
        }

        setMessage({
          tone: "error",
          text: errorMessage,
        });
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    }

    void initialize();

    return () => {
      mounted = false;
    };
  }, []);

  async function refreshProfile() {
    setLoadingProfile(true);
    setMessage(null);

    try {
      const nextData = await fetchAdminPortfolio();
      setData(nextData);
      setMessage({
        tone: "info",
        text: "Reloaded the latest values from the database.",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (isUnauthorizedMessage(errorMessage)) {
        setSession({
          authenticated: false,
          expiresAt: null,
        });
        setData(null);
        setMessage({
          tone: "info",
          text: "Your admin session expired. Please sign in again.",
        });
      } else {
        setMessage({
          tone: "error",
          text: errorMessage,
        });
      }
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthSubmitting(true);
    setMessage(null);

    try {
      const nextSession = await loginAdmin(credentials);
      setSession(nextSession);
      setCredentials({
        email: "",
        password: "",
      });

      setLoadingProfile(true);
      const nextData = await fetchAdminPortfolio();
      setData(nextData);
      setMessage({
        tone: "success",
        text: "Signed in. Your edit session will stay active for 7 days.",
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setAuthSubmitting(false);
      setLoadingProfile(false);
      setCheckingSession(false);
    }
  }

  async function handleLogout() {
    setAuthSubmitting(true);
    setMessage(null);

    try {
      await logoutAdmin();
      setSession({
        authenticated: false,
        expiresAt: null,
      });
      setData(null);
      setMessage({
        tone: "info",
        text: "Signed out of the admin editor.",
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const saved = await saveAdminPortfolio(data);
      setData(saved);
      setMessage({
        tone: "success",
        text: "Portfolio data saved successfully.",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (isUnauthorizedMessage(errorMessage)) {
        setSession({
          authenticated: false,
          expiresAt: null,
        });
        setData(null);
        setMessage({
          tone: "info",
          text: "Your admin session expired. Please sign in again.",
        });
      } else {
        setMessage({
          tone: "error",
          text: errorMessage,
        });
      }
    } finally {
      setSaving(false);
    }
  }

  function updateUserField(
    field: keyof IAdminPortfolioEditor["user"],
    value: string,
  ) {
    setData((current) =>
      current
        ? {
            ...current,
            user: {
              ...current.user,
              [field]: value,
            },
          }
        : current,
    );
  }

  function updateSocialField(
    field: keyof IAdminPortfolioEditor["user"]["socials"],
    value: string,
  ) {
    setData((current) =>
      current
        ? {
            ...current,
            user: {
              ...current.user,
              socials: {
                ...current.user.socials,
                [field]: value,
              },
            },
          }
        : current,
    );
  }

  function updateRepoField(
    field: keyof IAdminPortfolioEditor["repoData"],
    value: string,
  ) {
    setData((current) =>
      current
        ? {
            ...current,
            repoData: {
              ...current.repoData,
              [field]: value,
            },
          }
        : current,
    );
  }

  function updateCollectionItem(
    key: CollectionKey,
    index: number,
    field: string,
    value: string | boolean,
  ) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...(current[key] as unknown[])];
      const currentItem = items[index] as Record<string, unknown> | undefined;
      if (!currentItem) {
        return current;
      }

      items[index] = {
        ...currentItem,
        [field]: value,
      };

      return {
        ...current,
        [key]: items,
      } as IAdminPortfolioEditor;
    });
  }

  function addCollectionItem(key: CollectionKey, item: unknown) {
    setData((current) =>
      current
        ? ({
            ...current,
            [key]: [...(current[key] as unknown[]), item],
          } as IAdminPortfolioEditor)
        : current,
    );
  }

  function removeCollectionItem(key: CollectionKey, index: number) {
    setData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: (current[key] as unknown[]).filter((_, itemIndex) => itemIndex !== index),
      } as IAdminPortfolioEditor;
    });
  }

  function moveCollectionItem(key: CollectionKey, index: number, direction: -1 | 1) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...(current[key] as unknown[])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= items.length) {
        return current;
      }

      [items[index], items[targetIndex]] = [items[targetIndex], items[index]];

      return {
        ...current,
        [key]: items,
      } as IAdminPortfolioEditor;
    });
  }

  function updateExperienceListValue(
    index: number,
    field: ExperienceListField,
    listIndex: number,
    value: string,
  ) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...current.experiences];
      const experience = items[index];
      if (!experience) {
        return current;
      }

      const values = [...experience[field]];
      values[listIndex] = value;

      items[index] = {
        ...experience,
        [field]: values,
      };

      return {
        ...current,
        experiences: items,
      };
    });
  }

  function addExperienceListValue(index: number, field: ExperienceListField) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...current.experiences];
      const experience = items[index];
      if (!experience) {
        return current;
      }

      items[index] = {
        ...experience,
        [field]: [...experience[field], ""],
      };

      return {
        ...current,
        experiences: items,
      };
    });
  }

  function removeExperienceListValue(
    index: number,
    field: ExperienceListField,
    listIndex: number,
  ) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...current.experiences];
      const experience = items[index];
      if (!experience) {
        return current;
      }

      items[index] = {
        ...experience,
        [field]: experience[field].filter(
          (_, currentIndex) => currentIndex !== listIndex,
        ),
      };

      return {
        ...current,
        experiences: items,
      };
    });
  }

  function updateProjectListValue(
    index: number,
    field: ProjectListField,
    listIndex: number,
    value: string,
  ) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...current.projects];
      const project = items[index];
      if (!project) {
        return current;
      }

      const values = [...project[field]];
      values[listIndex] = value;

      items[index] = {
        ...project,
        [field]: values,
      };

      return {
        ...current,
        projects: items,
      };
    });
  }

  function addProjectListValue(index: number, field: ProjectListField) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...current.projects];
      const project = items[index];
      if (!project) {
        return current;
      }

      items[index] = {
        ...project,
        [field]: [...project[field], ""],
      };

      return {
        ...current,
        projects: items,
      };
    });
  }

  function removeProjectListValue(
    index: number,
    field: ProjectListField,
    listIndex: number,
  ) {
    setData((current) => {
      if (!current) {
        return current;
      }

      const items = [...current.projects];
      const project = items[index];
      if (!project) {
        return current;
      }

      items[index] = {
        ...project,
        [field]: project[field].filter(
          (_, currentIndex) => currentIndex !== listIndex,
        ),
      };

      return {
        ...current,
        projects: items,
      };
    });
  }

  if (checkingSession) {
    return (
      <div className={`${panelClassName} min-h-[320px] animate-pulse`}>
        <div className="h-6 w-40 rounded-full bg-white/10" />
        <div className="mt-4 h-4 w-72 rounded-full bg-white/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <section className={`${panelClassName} overflow-hidden`}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.14),transparent_35%)]" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              <ShieldCheck className="size-4" />
              Admin Editor
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Update portfolio data without opening the database
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
                This page reads the current profile values, lets you update or
                remove them, and writes the full portfolio document back after
                you save.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Clock3 className="size-4 text-cyan-300" />
                Session
              </div>
              <p className="mt-2 text-sm text-white/60">
                Expires: {formatSessionExpiry(session)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Database className="size-4 text-amber-300" />
                Scope
              </div>
              <p className="mt-2 text-sm text-white/60">
                Core profile, repo links, skills, experience, projects,
                education, languages, and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            message.tone === "success"
              ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-50"
              : message.tone === "error"
                ? "border-rose-300/30 bg-rose-300/10 text-rose-50"
                : "border-cyan-300/30 bg-cyan-300/10 text-cyan-50"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <section className={`${panelClassName} mx-auto max-w-xl`}>
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Sign in to edit portfolio data
            </h2>
            <p className="text-sm leading-6 text-white/65">
              The editor stores a secure session cookie for 7 days. After that,
              you&apos;ll need to sign in again before making more changes.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <TextField
              label="Admin email"
              value={credentials.email}
              onChange={(value) =>
                setCredentials((current) => ({ ...current, email: value }))
              }
              placeholder="Enter your admin email"
            />
            <TextField
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(value) =>
                setCredentials((current) => ({ ...current, password: value }))
              }
              placeholder="Enter your password"
            />
            <button
              type="submit"
              disabled={authSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/60"
            >
              <ShieldCheck className="size-4" />
              {authSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      ) : (
        <form className="space-y-6" onSubmit={handleSave}>
          <section className={`${panelClassName}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Editing workspace
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Refresh to pull current database values, then save once you&apos;re
                  done updating fields.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={refreshProfile}
                  disabled={loadingProfile || saving || authSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className="size-4" />
                  {loadingProfile ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  type="submit"
                  disabled={loadingProfile || saving || authSubmitting || !data}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-emerald-300/60"
                >
                  <Save className="size-4" />
                  {saving ? "Saving..." : "Save all changes"}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loadingProfile || saving || authSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-2.5 text-sm font-medium text-rose-50 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="size-4" />
                  {authSubmitting ? "Signing out..." : "Logout"}
                </button>
              </div>
            </div>
          </section>

          {loadingProfile && !data ? (
            <div className="grid gap-6">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className={`${panelClassName} h-44 animate-pulse bg-white/[0.04]`}
                />
              ))}
            </div>
          ) : data ? (
            <>
              <SectionCard
                title="Hero / Intro"
                description="Name, headline, and visual identity used by the landing hero."
                defaultOpen
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Full name"
                    value={data.user.name}
                    onChange={(value) => updateUserField("name", value)}
                    placeholder="Portfolio owner name"
                    required
                  />
                  <TextField
                    label="Public email"
                    value={data.user.email}
                    onChange={(value) => updateUserField("email", value)}
                    placeholder="Public contact email"
                    required
                  />
                  <TextField
                    label="Avatar URL"
                    value={data.user.avatarUrl}
                    onChange={(value) => updateUserField("avatarUrl", value)}
                    placeholder="https://..."
                  />
                  <TextField
                    label="Headline"
                    value={data.user.headline}
                    onChange={(value) => updateUserField("headline", value)}
                    placeholder="Short professional headline"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="About"
                description="Contact details, profile summary, and footer copy."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Phone"
                    value={data.user.phone}
                    onChange={(value) => updateUserField("phone", value)}
                    placeholder="Phone number"
                  />
                  <TextField
                    label="Location"
                    value={data.user.location}
                    onChange={(value) => updateUserField("location", value)}
                    placeholder="City, country"
                  />
                </div>
                <div className="mt-4 grid gap-4">
                  <TextAreaField
                    label="Summary"
                    value={data.user.summary}
                    onChange={(value) => updateUserField("summary", value)}
                    rows={5}
                    placeholder="Profile summary"
                  />
                  <TextField
                    label="Copyright text"
                    value={data.user.copyrights}
                    onChange={(value) => updateUserField("copyrights", value)}
                    placeholder="Footer copyright"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Social Links"
                description="These values map directly to the contact/social area."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <TextField
                    label="GitHub"
                    value={data.user.socials.github}
                    onChange={(value) => updateSocialField("github", value)}
                    placeholder="https://github.com/..."
                  />
                  <TextField
                    label="LinkedIn"
                    value={data.user.socials.linkedin}
                    onChange={(value) => updateSocialField("linkedin", value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <TextField
                    label="Portfolio"
                    value={data.user.socials.portfolio}
                    onChange={(value) => updateSocialField("portfolio", value)}
                    placeholder="https://your-site.com"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="SEO / Settings"
                description="Repository and deployment references used across tools and metadata surfaces."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="NestJS Git repository"
                    value={data.repoData.nestJSGitRepo}
                    onChange={(value) => updateRepoField("nestJSGitRepo", value)}
                    placeholder="https://github.com/..."
                  />
                  <TextField
                    label="NestJS deployed server"
                    value={data.repoData.nestJSDeployedServer}
                    onChange={(value) =>
                      updateRepoField("nestJSDeployedServer", value)
                    }
                    placeholder="https://..."
                  />
                  <TextField
                    label="NestJS Swagger URL"
                    value={data.repoData.nestJSSwaggerUrl}
                    onChange={(value) =>
                      updateRepoField("nestJSSwaggerUrl", value)
                    }
                    placeholder="https://..."
                  />
                  <TextField
                    label="NextJS Git repository"
                    value={data.repoData.nextJSGitRepo}
                    onChange={(value) => updateRepoField("nextJSGitRepo", value)}
                    placeholder="https://github.com/..."
                  />
                  <TextField
                    label="NextJS deployed server"
                    value={data.repoData.nextJSDeployedServer}
                    onChange={(value) =>
                      updateRepoField("nextJSDeployedServer", value)
                    }
                    placeholder="https://..."
                  />
                  <TextField
                    label="PostgreSQL deployed server"
                    value={data.repoData.postgresDeployedServer}
                    onChange={(value) =>
                      updateRepoField("postgresDeployedServer", value)
                    }
                    placeholder="Database host or dashboard URL"
                  />
                </div>
              </SectionCard>

              <RepeatableSection
                title="Hero rotating subtitles"
                description="Short rotating lines shown in the landing hero."
                count={data.bottomHeadlines.length}
                addLabel="Add headline"
                onAdd={() =>
                  addCollectionItem("bottomHeadlines", createEmptyBottomHeadline())
                }
              >
                {data.bottomHeadlines.map((item, index) => (
                  <ItemCard
                    key={`bottom-headline-${item.id ?? index}`}
                    title={`Headline ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("bottomHeadlines", index, -1)}
                    onMoveDown={() =>
                      moveCollectionItem("bottomHeadlines", index, 1)
                    }
                    onRemove={() => removeCollectionItem("bottomHeadlines", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.bottomHeadlines.length - 1}
                  >
                    <TextField
                      label="Text"
                      value={item.text}
                      onChange={(value) =>
                        updateCollectionItem("bottomHeadlines", index, "text", value)
                      }
                      placeholder={
                        "Ship confidently \u00b7 Pipelines, environments, rollbacks"
                      }
                    />
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Homepage Projects"
                description="Rotating projects shown in the homepage header component."
                count={data.homepageProjects.length}
                addLabel="Add project"
                onAdd={() =>
                  addCollectionItem("homepageProjects", createEmptyHomepageProject())
                }
              >
                {data.homepageProjects.map((item, index) => (
                  <ItemCard
                    key={`homepage-project-${item.id ?? index}`}
                    title={`Project ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("homepageProjects", index, -1)}
                    onMoveDown={() =>
                      moveCollectionItem("homepageProjects", index, 1)
                    }
                    onRemove={() => removeCollectionItem("homepageProjects", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.homepageProjects.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateCollectionItem("homepageProjects", index, "title", value)
                        }
                        placeholder="Project Name"
                      />
                      <TextField
                        label="URL"
                        value={item.url}
                        onChange={(value) =>
                          updateCollectionItem("homepageProjects", index, "url", value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Skills"
                description="Skill cards and categories shown on the profile page."
                count={data.skills.length}
                addLabel="Add skill"
                onAdd={() => addCollectionItem("skills", createEmptySkill())}
              >
                {data.skills.map((item, index) => (
                  <ItemCard
                    key={`skill-${item.id ?? index}`}
                    title={`Skill ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("skills", index, -1)}
                    onMoveDown={() => moveCollectionItem("skills", index, 1)}
                    onRemove={() => removeCollectionItem("skills", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.skills.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-3">
                      <TextField
                        label="Name"
                        value={item.name}
                        onChange={(value) =>
                          updateCollectionItem("skills", index, "name", value)
                        }
                        placeholder="TypeScript"
                      />
                      <TextField
                        label="Category"
                        value={item.category}
                        onChange={(value) =>
                          updateCollectionItem("skills", index, "category", value)
                        }
                        placeholder="Backend"
                      />
                      <TextField
                        label="Level"
                        value={item.level}
                        onChange={(value) =>
                          updateCollectionItem("skills", index, "level", value)
                        }
                        placeholder="Advanced"
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Experience"
                description="Roles, dates, stack tags, and bullet points."
                count={data.experiences.length}
                addLabel="Add experience"
                onAdd={() => addCollectionItem("experiences", createEmptyExperience())}
              >
                {data.experiences.map((item, index) => (
                  <ItemCard
                    key={`experience-${item.id ?? index}`}
                    title={item.title || `Experience ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("experiences", index, -1)}
                    onMoveDown={() => moveCollectionItem("experiences", index, 1)}
                    onRemove={() => removeCollectionItem("experiences", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.experiences.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateCollectionItem("experiences", index, "title", value)
                        }
                        placeholder="Senior Backend Developer"
                      />
                      <TextField
                        label="Company"
                        value={item.company}
                        onChange={(value) =>
                          updateCollectionItem("experiences", index, "company", value)
                        }
                        placeholder="Company name"
                      />
                      <TextField
                        label="Location"
                        value={item.location}
                        onChange={(value) =>
                          updateCollectionItem("experiences", index, "location", value)
                        }
                        placeholder="Location"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                          label="Start date"
                          type="date"
                          value={item.startDate}
                          onChange={(value) =>
                            updateCollectionItem(
                              "experiences",
                              index,
                              "startDate",
                              value,
                            )
                          }
                        />
                        <TextField
                          label="End date"
                          type="date"
                          value={item.endDate}
                          onChange={(value) =>
                            updateCollectionItem("experiences", index, "endDate", value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateCollectionItem(
                            "experiences",
                            index,
                            "description",
                            value,
                          )
                        }
                        rows={4}
                        placeholder="Short role description"
                      />
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <StringListEditor
                        label="Bullets"
                        values={item.bullets}
                        onChange={(listIndex, value) =>
                          updateExperienceListValue(
                            index,
                            "bullets",
                            listIndex,
                            value,
                          )
                        }
                        onAdd={() => addExperienceListValue(index, "bullets")}
                        onRemove={(listIndex) =>
                          removeExperienceListValue(index, "bullets", listIndex)
                        }
                      />
                      <StringListEditor
                        label="Tech stack"
                        values={item.techStack}
                        onChange={(listIndex, value) =>
                          updateExperienceListValue(
                            index,
                            "techStack",
                            listIndex,
                            value,
                          )
                        }
                        onAdd={() => addExperienceListValue(index, "techStack")}
                        onRemove={(listIndex) =>
                          removeExperienceListValue(index, "techStack", listIndex)
                        }
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Projects"
                description="Projects, display URL, visibility, tech tags, and highlights."
                count={data.projects.length}
                addLabel="Add project"
                defaultOpen
                onAdd={() => addCollectionItem("projects", createEmptyProject())}
              >
                {data.projects.map((item, index) => (
                  <ItemCard
                    key={`project-${item.id ?? index}`}
                    title={item.title || `Project ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("projects", index, -1)}
                    onMoveDown={() => moveCollectionItem("projects", index, 1)}
                    onRemove={() => removeCollectionItem("projects", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.projects.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateCollectionItem("projects", index, "title", value)
                        }
                        placeholder="Project title"
                      />
                      <TextField
                        label="Project URL"
                        value={item.projectUrl}
                        onChange={(value) =>
                          updateCollectionItem("projects", index, "projectUrl", value)
                        }
                        placeholder="https://..."
                      />
                      <SelectField
                        label="Type"
                        value={item.type}
                        options={["Live Demo", "GitHub", "Other"]}
                        onChange={(value) =>
                          updateCollectionItem("projects", index, "type", value)
                        }
                      />
                      <ToggleField
                        label="Visible on homepage/profile"
                        checked={item.isVisible}
                        onChange={(value) =>
                          updateCollectionItem("projects", index, "isVisible", value)
                        }
                      />
                      <TextField
                        label="Repository URL"
                        value={item.repoUrl}
                        onChange={(value) =>
                          updateCollectionItem("projects", index, "repoUrl", value)
                        }
                        placeholder="https://github.com/..."
                      />
                      <TextField
                        label="Live URL"
                        value={item.liveUrl}
                        onChange={(value) =>
                          updateCollectionItem("projects", index, "liveUrl", value)
                        }
                        placeholder="https://..."
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                          label="Start date"
                          type="date"
                          value={item.startDate}
                          onChange={(value) =>
                            updateCollectionItem("projects", index, "startDate", value)
                          }
                        />
                        <TextField
                          label="End date"
                          type="date"
                          value={item.endDate}
                          onChange={(value) =>
                            updateCollectionItem("projects", index, "endDate", value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateCollectionItem("projects", index, "description", value)
                        }
                        rows={4}
                        placeholder="Project summary"
                      />
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <StringListEditor
                        label="Tech tags"
                        values={item.tech}
                        onChange={(listIndex, value) =>
                          updateProjectListValue(index, "tech", listIndex, value)
                        }
                        onAdd={() => addProjectListValue(index, "tech")}
                        onRemove={(listIndex) =>
                          removeProjectListValue(index, "tech", listIndex)
                        }
                      />
                      <StringListEditor
                        label="Highlights"
                        values={item.highlights}
                        onChange={(listIndex, value) =>
                          updateProjectListValue(
                            index,
                            "highlights",
                            listIndex,
                            value,
                          )
                        }
                        onAdd={() => addProjectListValue(index, "highlights")}
                        onRemove={(listIndex) =>
                          removeProjectListValue(index, "highlights", listIndex)
                        }
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Education"
                description="Degrees, institutions, date range, and descriptions."
                count={data.education.length}
                addLabel="Add education"
                onAdd={() => addCollectionItem("education", createEmptyEducation())}
              >
                {data.education.map((item, index) => (
                  <ItemCard
                    key={`education-${item.id ?? index}`}
                    title={item.degree || `Education ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("education", index, -1)}
                    onMoveDown={() => moveCollectionItem("education", index, 1)}
                    onRemove={() => removeCollectionItem("education", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.education.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Institution"
                        value={item.institution}
                        onChange={(value) =>
                          updateCollectionItem("education", index, "institution", value)
                        }
                        placeholder="Institution"
                      />
                      <TextField
                        label="Degree"
                        value={item.degree}
                        onChange={(value) =>
                          updateCollectionItem("education", index, "degree", value)
                        }
                        placeholder="Degree"
                      />
                      <TextField
                        label="Field"
                        value={item.field}
                        onChange={(value) =>
                          updateCollectionItem("education", index, "field", value)
                        }
                        placeholder="Field of study"
                      />
                      <TextField
                        label="Location"
                        value={item.location}
                        onChange={(value) =>
                          updateCollectionItem("education", index, "location", value)
                        }
                        placeholder="Location"
                      />
                      <TextField
                        label="Start date"
                        type="date"
                        value={item.startDate}
                        onChange={(value) =>
                          updateCollectionItem("education", index, "startDate", value)
                        }
                      />
                      <TextField
                        label="End date"
                        type="date"
                        value={item.endDate}
                        onChange={(value) =>
                          updateCollectionItem("education", index, "endDate", value)
                        }
                      />
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateCollectionItem(
                            "education",
                            index,
                            "description",
                            value,
                          )
                        }
                        rows={4}
                        placeholder="Education notes"
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Certifications"
                description="Certifications, issuers, dates, and links."
                count={data.certifications.length}
                addLabel="Add certification"
                onAdd={() =>
                  addCollectionItem("certifications", createEmptyCertification())
                }
              >
                {data.certifications.map((item, index) => (
                  <ItemCard
                    key={`certification-${item.id ?? index}`}
                    title={item.title || `Certification ${index + 1}`}
                    onMoveUp={() =>
                      moveCollectionItem("certifications", index, -1)
                    }
                    onMoveDown={() =>
                      moveCollectionItem("certifications", index, 1)
                    }
                    onRemove={() => removeCollectionItem("certifications", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.certifications.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateCollectionItem(
                            "certifications",
                            index,
                            "title",
                            value,
                          )
                        }
                        placeholder="Certification title"
                      />
                      <TextField
                        label="Issuer"
                        value={item.issuer}
                        onChange={(value) =>
                          updateCollectionItem(
                            "certifications",
                            index,
                            "issuer",
                            value,
                          )
                        }
                        placeholder="Issuer"
                      />
                      <TextField
                        label="Date"
                        type="date"
                        value={item.date}
                        onChange={(value) =>
                          updateCollectionItem("certifications", index, "date", value)
                        }
                      />
                      <TextField
                        label="Link"
                        value={item.link}
                        onChange={(value) =>
                          updateCollectionItem("certifications", index, "link", value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Achievements"
                description="Awards, milestones, and optional links."
                count={data.achievements.length}
                addLabel="Add achievement"
                onAdd={() =>
                  addCollectionItem("achievements", createEmptyAchievement())
                }
              >
                {data.achievements.map((item, index) => (
                  <ItemCard
                    key={`achievement-${item.id ?? index}`}
                    title={item.title || `Achievement ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("achievements", index, -1)}
                    onMoveDown={() => moveCollectionItem("achievements", index, 1)}
                    onRemove={() => removeCollectionItem("achievements", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.achievements.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-3">
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateCollectionItem("achievements", index, "title", value)
                        }
                        placeholder="Achievement title"
                      />
                      <TextField
                        label="Date"
                        type="date"
                        value={item.date}
                        onChange={(value) =>
                          updateCollectionItem("achievements", index, "date", value)
                        }
                      />
                      <TextField
                        label="Link"
                        value={item.link}
                        onChange={(value) =>
                          updateCollectionItem("achievements", index, "link", value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Languages"
                description="Languages and proficiency levels."
                count={data.languages.length}
                addLabel="Add language"
                onAdd={() => addCollectionItem("languages", createEmptyLanguage())}
              >
                {data.languages.map((item, index) => (
                  <ItemCard
                    key={`language-${item.id ?? index}`}
                    title={item.name || `Language ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("languages", index, -1)}
                    onMoveDown={() => moveCollectionItem("languages", index, 1)}
                    onRemove={() => removeCollectionItem("languages", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.languages.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Language"
                        value={item.name}
                        onChange={(value) =>
                          updateCollectionItem("languages", index, "name", value)
                        }
                        placeholder="English"
                      />
                      <TextField
                        label="Level"
                        value={item.level}
                        onChange={(value) =>
                          updateCollectionItem("languages", index, "level", value)
                        }
                        placeholder="Fluent"
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Scan reports"
                description="Security, quality, coverage, or any other report snapshots."
                count={data.scanReports.length}
                addLabel="Add scan report"
                onAdd={() => addCollectionItem("scanReports", createEmptyScanReport())}
              >
                {data.scanReports.map((item, index) => (
                  <ItemCard
                    key={`scan-report-${item.id ?? index}`}
                    title={item.type || `Scan report ${index + 1}`}
                    onMoveUp={() => moveCollectionItem("scanReports", index, -1)}
                    onMoveDown={() => moveCollectionItem("scanReports", index, 1)}
                    onRemove={() => removeCollectionItem("scanReports", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.scanReports.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Type"
                        value={item.type}
                        onChange={(value) =>
                          updateCollectionItem("scanReports", index, "type", value)
                        }
                        placeholder="security / sonar / coverage"
                      />
                      <TextField
                        label="Commit SHA"
                        value={item.commitSha}
                        onChange={(value) =>
                          updateCollectionItem(
                            "scanReports",
                            index,
                            "commitSha",
                            value,
                          )
                        }
                        placeholder="abc123"
                      />
                      <TextField
                        label="Run at"
                        type="datetime-local"
                        value={item.runAt}
                        onChange={(value) =>
                          updateCollectionItem("scanReports", index, "runAt", value)
                        }
                      />
                      <TextField
                        label="Artifact URL"
                        value={item.artifactUrl}
                        onChange={(value) =>
                          updateCollectionItem(
                            "scanReports",
                            index,
                            "artifactUrl",
                            value,
                          )
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Summary JSON"
                        value={item.summaryText}
                        onChange={(value) =>
                          updateCollectionItem(
                            "scanReports",
                            index,
                            "summaryText",
                            value,
                          )
                        }
                        rows={8}
                        placeholder='{"coverage": 95}'
                        monospace
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>
            </>
          ) : null}
        </form>
      )}
    </div>
  );
}

function SectionCard({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={panelClassName}>
      <details
        className="group"
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm leading-6 text-white/60">{description}</p>
          </div>
          <ChevronDown className="mt-1 size-5 shrink-0 text-white/50 transition group-open:rotate-180" />
        </summary>
        <div className="mt-5">{children}</div>
      </details>
    </section>
  );
}

function RepeatableSection({
  title,
  description,
  count,
  addLabel,
  onAdd,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={panelClassName}>
      <details
        className="group"
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                {count}
              </span>
            </div>
            <p className="text-sm leading-6 text-white/60">{description}</p>
          </div>
          <ChevronDown className="mt-1 size-5 shrink-0 text-white/50 transition group-open:rotate-180" />
        </summary>
        <div className="mt-5 space-y-4">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            <Plus className="size-4" />
            {addLabel}
          </button>
          <div className="space-y-4">{children}</div>
        </div>
      </details>
    </section>
  );
}

function ItemCard({
  title,
  onMoveUp,
  onMoveDown,
  onRemove,
  disableMoveUp,
  disableMoveDown,
  children,
}: {
  title: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  disableMoveUp: boolean;
  disableMoveDown: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={disableMoveUp}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="size-3.5" />
            Up
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={disableMoveDown}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowDown className="size-3.5" />
            Down
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-xl border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-xs font-medium text-rose-50 transition hover:bg-rose-300/20"
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40 focus:bg-slate-950/70"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:bg-slate-950/70"
      >
        <option value="">Select type</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const Icon = checked ? Eye : EyeOff;

  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <span className="inline-flex min-h-[46px] items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white/80">
        <span className="inline-flex items-center gap-2">
          <Icon className="size-4 text-cyan-200" />
          {checked ? "Enabled" : "Disabled"}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-5 accent-cyan-300"
        />
      </span>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows,
  monospace = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
  monospace?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40 focus:bg-slate-950/70 ${
          monospace ? "font-mono" : ""
        }`}
      />
    </label>
  );
}

function StringListEditor({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  values: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  const listValues = values.length ? values : [""];

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/75">{label}</span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10"
        >
          <Plus className="size-3.5" />
          Add item
        </button>
      </div>
      <div className="space-y-3">
        {listValues.map((value, index) => (
          <div key={`${label}-${index}`} className="flex gap-3">
            <input
              value={value}
              onChange={(event) => onChange(index, event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40 focus:bg-slate-950/70"
              placeholder={`${label} ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="inline-flex items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-300/10 px-3 text-rose-50 transition hover:bg-rose-300/20"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
