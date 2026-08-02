"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import styles from "./UpdateProfileClient.module.css";
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

const panelClassName = styles.panel;

function isOpportunityHeadline(text: string) {
  return /\b(open to|seeking)\b/i.test(text);
}

function createEmptyBottomHeadline(): IAdminBottomHeadlineEditor {
  return {
    text: "",
    order: 0,
  };
}

function createEmptyOpportunityHeadline(): IAdminBottomHeadlineEditor {
  return {
    text: "Seeking ",
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
  const [showHiddenFields, setShowHiddenFields] = useState(false);

  const isAuthenticated = Boolean(session?.authenticated);
  const opportunityHeadlineIndex = data?.bottomHeadlines.findIndex((item) =>
    isOpportunityHeadline(item.text),
  ) ?? -1;
  const legacyHeadlineEntries = data?.bottomHeadlines
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index !== opportunityHeadlineIndex) ?? [];
  const hiddenFieldCount = data
    ? 4
      + Object.keys(data.repoData).length
      + legacyHeadlineEntries.length
      + data.education.length
      + data.achievements.length
      + data.scanReports.length
    : 0;

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
      <div className={`${panelClassName} ${styles.loadingPanel}`} aria-label="Loading admin editor">
        <div className={styles.loadingLineLarge} />
        <div className={styles.loadingLine} />
        <div className={styles.loadingGrid}>
          <div />
          <div />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      <section className={`${panelClassName} ${styles.introPanel}`}>
        <div className={styles.introLayout}>
          <div>
            <p className={styles.eyebrow}>Portfolio content console</p>
            <h1>Update portfolio data</h1>
            <p className={styles.introCopy}>
              Edit the information shown on the public portfolio. Fields that are
              stored by the API but not currently displayed are separated at the end.
            </p>
          </div>

          <dl className={styles.introFacts}>
            <div>
              <dt>Session expires</dt>
              <dd>{formatSessionExpiry(session)}</dd>
            </div>
            <div>
              <dt>Editing source</dt>
              <dd>Live database records</dd>
            </div>
          </dl>
        </div>
      </section>

      {message ? (
        <div
          role={message.tone === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`${styles.message} ${
            message.tone === "success"
              ? styles.messageSuccess
              : message.tone === "error"
                ? styles.messageError
                : styles.messageInfo
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <section className={`${panelClassName} ${styles.loginPanel}`}>
          <div className={styles.loginHeading}>
            <p className={styles.eyebrow}>Protected workspace</p>
            <h2>Sign in to edit</h2>
            <p>
              The editor stores a secure session cookie for 7 days. After that,
              you&apos;ll need to sign in again before making more changes.
            </p>
          </div>

          <form className={styles.loginForm} onSubmit={handleLogin}>
            <TextField
              label="Admin email"
              type="email"
              autoComplete="email"
              value={credentials.email}
              onChange={(value) =>
                setCredentials((current) => ({ ...current, email: value }))
              }
              placeholder="Enter your admin email"
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={(value) =>
                setCredentials((current) => ({ ...current, password: value }))
              }
              placeholder="Enter your password"
            />
            <button
              type="submit"
              disabled={authSubmitting}
              className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonWide}`}
            >
              {authSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      ) : (
        <form className={styles.workspace} onSubmit={handleSave}>
          <section className={`${panelClassName} ${styles.actionBar}`}>
            <div className={styles.actionBarLayout}>
              <div>
                <h2>Editing public content</h2>
                <p>
                  Save once after completing your changes. Refresh discards unsaved edits.
                </p>
              </div>
              <div className={styles.actionButtons}>
                <button
                  type="button"
                  onClick={refreshProfile}
                  disabled={loadingProfile || saving || authSubmitting}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  <RefreshCw className="size-4" />
                  {loadingProfile ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  type="submit"
                  disabled={loadingProfile || saving || authSubmitting || !data}
                  className={`${styles.button} ${styles.buttonSave}`}
                >
                  <Save className="size-4" />
                  {saving ? "Saving..." : "Save all changes"}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loadingProfile || saving || authSubmitting}
                  className={`${styles.button} ${styles.buttonDanger}`}
                >
                  <LogOut className="size-4" />
                  {authSubmitting ? "Signing out..." : "Logout"}
                </button>
              </div>
            </div>
          </section>

          {loadingProfile && !data ? (
            <div className={styles.loadingSections}>
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className={`${panelClassName} ${styles.loadingSection}`}
                />
              ))}
            </div>
          ) : data ? (
            <>
              <SectionCard
                title="Candidate identity"
                description="Name, public email, and the headline shown on the homepage and profile."
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
                  <div className="md:col-span-2">
                    <TextField
                      label="Professional headline"
                      value={data.user.headline}
                      onChange={(value) => updateUserField("headline", value)}
                      placeholder="Short professional headline"
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Professional summary"
                description="Location and summary shown across the public portfolio."
              >
                <div className="grid gap-4">
                  <TextField
                    label="Location"
                    value={data.user.location}
                    onChange={(value) => updateUserField("location", value)}
                    placeholder="City, country"
                  />
                  <TextAreaField
                    label="Summary"
                    value={data.user.summary}
                    onChange={(value) => updateUserField("summary", value)}
                    rows={5}
                    placeholder="Profile summary"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Professional links"
                description="GitHub and LinkedIn links displayed throughout the portfolio."
              >
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>
              </SectionCard>

              <SectionCard
                title="Opportunity status"
                description="The first line containing seeking or open to is displayed on the homepage and profile."
              >
                {opportunityHeadlineIndex >= 0 ? (
                  <TextField
                    label="Public opportunity message"
                    value={data.bottomHeadlines[opportunityHeadlineIndex].text}
                    onChange={(value) =>
                      updateCollectionItem(
                        "bottomHeadlines",
                        opportunityHeadlineIndex,
                        "text",
                        value,
                      )
                    }
                    placeholder="Seeking backend and full-stack engineering roles"
                  />
                ) : (
                  <div className={styles.emptyFieldState}>
                    <p>No public opportunity message is configured.</p>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonSecondary}`}
                      onClick={() =>
                        addCollectionItem(
                          "bottomHeadlines",
                          createEmptyOpportunityHeadline(),
                        )
                      }
                    >
                      Add opportunity message
                    </button>
                  </div>
                )}
              </SectionCard>

              <RepeatableSection
                title="Homepage project selection"
                description="Order projects featured on the homepage. Use the title or URL from an existing Projects record."
                count={data.homepageProjects.length}
                addLabel="Add project"
                onAdd={() =>
                  addCollectionItem("homepageProjects", createEmptyHomepageProject())
                }
              >
                {data.homepageProjects.map((item, index) => (
                  <ItemCard
                    key={`homepage-project-${item.id ?? index}`}
                    title={item.title || `Homepage project ${index + 1}`}
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
                description="Names, categories, and proficiency levels used across the homepage and profile."
                count={data.skills.length}
                addLabel="Add skill"
                onAdd={() => addCollectionItem("skills", createEmptySkill())}
              >
                {data.skills.map((item, index) => (
                  <ItemCard
                    key={`skill-${item.id ?? index}`}
                    title={item.name || `Skill ${index + 1}`}
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
                description="Degrees, institutions, date ranges, and descriptions shown on the profile."
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
                description="Awards and milestones shown in profile credentials."
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
                    <div className="grid gap-4 md:grid-cols-2">
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

              <section className={styles.hiddenRegion} aria-labelledby="hidden-fields-title">
                <div className={styles.hiddenRegionSummary}>
                  <div>
                    <p className={styles.eyebrow}>Not shown publicly</p>
                    <h2 id="hidden-fields-title">Unused API fields</h2>
                    <p>
                      These values remain supported by the database and save API, but the
                      current public portfolio does not render them.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.hiddenToggle}
                    aria-expanded={showHiddenFields}
                    aria-controls="hidden-fields-content"
                    onClick={() => setShowHiddenFields((current) => !current)}
                  >
                    {showHiddenFields ? "Hide hidden fields" : "Show hidden fields"}
                    <span>{hiddenFieldCount}</span>
                  </button>
                </div>

                {showHiddenFields ? (
                  <div id="hidden-fields-content" className={styles.hiddenContent}>
                    <p className={styles.hiddenNotice}>
                      Greyed fields are intentionally separated from public content. They
                      remain fully editable and are saved normally.
                    </p>

                    <SectionCard
                      title="Unused profile fields"
                      description="Stored identity and contact values not rendered by the current portfolio."
                      tone="muted"
                      defaultOpen
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                          label="Avatar URL"
                          value={data.user.avatarUrl}
                          onChange={(value) => updateUserField("avatarUrl", value)}
                          placeholder="https://..."
                        />
                        <TextField
                          label="Phone"
                          value={data.user.phone}
                          onChange={(value) => updateUserField("phone", value)}
                          placeholder="Phone number"
                        />
                        <TextField
                          label="Copyright text"
                          value={data.user.copyrights}
                          onChange={(value) => updateUserField("copyrights", value)}
                          placeholder="Footer copyright"
                        />
                        <TextField
                          label="Portfolio URL"
                          value={data.user.socials.portfolio}
                          onChange={(value) => updateSocialField("portfolio", value)}
                          placeholder="https://your-site.com"
                        />
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Repository and deployment references"
                      description="Stored backend references that are not linked from public pages."
                      tone="muted"
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
                          onChange={(value) => updateRepoField("nestJSDeployedServer", value)}
                          placeholder="https://..."
                        />
                        <TextField
                          label="NestJS Swagger URL"
                          value={data.repoData.nestJSSwaggerUrl}
                          onChange={(value) => updateRepoField("nestJSSwaggerUrl", value)}
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
                          onChange={(value) => updateRepoField("nextJSDeployedServer", value)}
                          placeholder="https://..."
                        />
                        <TextField
                          label="PostgreSQL deployed server"
                          value={data.repoData.postgresDeployedServer}
                          onChange={(value) => updateRepoField("postgresDeployedServer", value)}
                          placeholder="Database host or dashboard URL"
                        />
                      </div>
                    </SectionCard>

                    <RepeatableSection
                      title="Legacy headline records"
                      description="Stored headline rows that do not drive the current opportunity message."
                      count={legacyHeadlineEntries.length}
                      addLabel="Add legacy headline"
                      onAdd={() =>
                        addCollectionItem("bottomHeadlines", createEmptyBottomHeadline())
                      }
                      tone="muted"
                    >
                      {legacyHeadlineEntries.map(({ item, index }) => (
                        <ItemCard
                          key={`bottom-headline-${item.id ?? index}`}
                          title={`Headline ${index + 1}`}
                          onMoveUp={() => moveCollectionItem("bottomHeadlines", index, -1)}
                          onMoveDown={() => moveCollectionItem("bottomHeadlines", index, 1)}
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
                            placeholder="Stored headline"
                          />
                        </ItemCard>
                      ))}
                    </RepeatableSection>

                    <SectionCard
                      title="Education locations"
                      description="Locations are stored for education entries but not shown publicly."
                      tone="muted"
                    >
                      <div className={styles.hiddenFieldRows}>
                        {data.education.map((item, index) => (
                          <div key={`education-location-${item.id ?? index}`}>
                            <h4>{item.degree || `Education ${index + 1}`}</h4>
                            <TextField
                              label="Location"
                              value={item.location}
                              onChange={(value) =>
                                updateCollectionItem("education", index, "location", value)
                              }
                              placeholder="Location"
                            />
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Achievement links"
                      description="Links are stored with achievements but are not linked by the public profile."
                      tone="muted"
                    >
                      <div className={styles.hiddenFieldRows}>
                        {data.achievements.map((item, index) => (
                          <div key={`achievement-link-${item.id ?? index}`}>
                            <h4>{item.title || `Achievement ${index + 1}`}</h4>
                            <TextField
                              label="Link"
                              value={item.link}
                              onChange={(value) =>
                                updateCollectionItem("achievements", index, "link", value)
                              }
                              placeholder="https://..."
                            />
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    <RepeatableSection
                      title="Scan reports"
                      description="Stored quality and security snapshots not rendered on public pages."
                      count={data.scanReports.length}
                      addLabel="Add scan report"
                      onAdd={() => addCollectionItem("scanReports", createEmptyScanReport())}
                      tone="muted"
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
                                updateCollectionItem("scanReports", index, "commitSha", value)
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
                                updateCollectionItem("scanReports", index, "artifactUrl", value)
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="mt-4">
                            <TextAreaField
                              label="Summary JSON"
                              value={item.summaryText}
                              onChange={(value) =>
                                updateCollectionItem("scanReports", index, "summaryText", value)
                              }
                              rows={8}
                              placeholder='{"coverage": 95}'
                              monospace
                            />
                          </div>
                        </ItemCard>
                      ))}
                    </RepeatableSection>
                  </div>
                ) : null}
              </section>
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
  tone = "public",
  children,
}: {
  title: string;
  description: string;
  defaultOpen?: boolean;
  tone?: "public" | "muted";
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={`${panelClassName} ${styles.sectionCard} ${tone === "muted" ? styles.sectionMuted : ""}`}>
      <details
        className={styles.sectionDetails}
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className={styles.sectionSummary}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionTitleRow}>
              <h3>{title}</h3>
              <span className={tone === "muted" ? styles.storedBadge : styles.publicBadge}>
                {tone === "muted" ? "Stored only" : "Public"}
              </span>
            </div>
            <p>{description}</p>
          </div>
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </summary>
        <div className={styles.sectionBody}>{children}</div>
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
  tone = "public",
  children,
}: {
  title: string;
  description: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  defaultOpen?: boolean;
  tone?: "public" | "muted";
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={`${panelClassName} ${styles.sectionCard} ${tone === "muted" ? styles.sectionMuted : ""}`}>
      <details
        className={styles.sectionDetails}
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className={styles.sectionSummary}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionTitleRow}>
              <h3>{title}</h3>
              <span className={styles.countBadge}>{count}</span>
              <span className={tone === "muted" ? styles.storedBadge : styles.publicBadge}>
                {tone === "muted" ? "Stored only" : "Public"}
              </span>
            </div>
            <p>{description}</p>
          </div>
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </summary>
        <div className={styles.sectionBody}>
          <button
            type="button"
            onClick={onAdd}
            className={`${styles.button} ${styles.buttonSecondary} ${styles.addButton}`}
          >
            <Plus className="size-4" />
            {addLabel}
          </button>
          <div className={styles.itemList}>{children}</div>
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
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <h4>{title}</h4>
        <div className={styles.itemActions}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={disableMoveUp}
            className={styles.itemAction}
            aria-label={`Move ${title} up`}
          >
            <ArrowUp className="size-3.5" />
            Up
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={disableMoveDown}
            className={styles.itemAction}
            aria-label={`Move ${title} down`}
          >
            <ArrowDown className="size-3.5" />
            Down
          </button>
          <button
            type="button"
            onClick={onRemove}
            className={`${styles.itemAction} ${styles.itemRemove}`}
            aria-label={`Remove ${title}`}
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
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={styles.input}
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
    <label className={styles.field}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.input}
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
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <span className={styles.toggleField}>
        <span>{checked ? "Visible" : "Hidden"}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className={styles.toggleInput}
        />
        <span className={styles.toggleTrack} aria-hidden="true"><span /></span>
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
    <label className={styles.field}>
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${styles.input} ${styles.textarea} ${monospace ? styles.monospace : ""}`}
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
    <div className={styles.listEditor}>
      <div className={styles.listEditorHeader}>
        <span>{label}</span>
        <button
          type="button"
          onClick={onAdd}
          className={styles.smallButton}
        >
          <Plus className="size-3.5" />
          Add item
        </button>
      </div>
      <div className={styles.listValues}>
        {listValues.map((value, index) => (
          <div key={`${label}-${index}`} className={styles.listValue}>
            <input
              value={value}
              onChange={(event) => onChange(index, event.target.value)}
              className={styles.input}
              placeholder={`${label} ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className={styles.listRemove}
              aria-label={`Remove ${label} ${index + 1}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
