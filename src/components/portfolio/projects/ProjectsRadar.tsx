"use client";

import { useId, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { projectShowcaseContent } from "@/content/projects";
import type { IProjects } from "@/interfaces/user.interface";

export type ProjectsRadarItem = IProjects;

function displayTitle(title: string) {
  return title
    .replace(/\s*\(Accenture Client\)\s*/i, "")
    .replace(/Qurate Retail group/i, "Qurate Retail Group")
    .replace(/Microsoft Minecraft/i, "Minecraft · Microsoft");
}

function projectSummary(project: IProjects) {
  if (project.description.length <= 260) return project.description;
  const excerpt = project.description.slice(0, 257);
  const finalSpace = excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0, finalSpace > 210 ? finalSpace : 257).trim()}…`;
}

function projectType(project: IProjects) {
  if (project.type?.trim()) return project.type.trim();
  return /Accenture Client/i.test(project.title)
    ? projectShowcaseContent.labels.professionalProject
    : projectShowcaseContent.labels.independentProject;
}

function projectPeriod(project: IProjects) {
  const formatter = new Intl.DateTimeFormat("en", { year: "numeric", month: "short" });
  const start = project.startDate ? formatter.format(project.startDate) : null;
  const end = project.endDate ? formatter.format(project.endDate) : "Ongoing";
  return start ? `${start} — ${end}` : end;
}

function projectHref(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function ProjectPanel({ project, index }: { project: IProjects; index: number }) {
  const liveUrl = projectHref(project.liveUrl || project.projectUrl);
  const repoUrl = projectHref(project.repoUrl);

  return (
    <article className="project-panel project-panel-enter">
      <div className="project-preview" aria-hidden="true">
        <div className="preview-grid" />
        <span className="preview-index">0{index + 1}</span>
        <div className="preview-system">
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className="preview-caption">
          <span>System / {String(index + 1).padStart(2, "0")}</span>
          <strong>{project.tech?.[0] || "Engineering"}</strong>
        </div>
      </div>

      <div className="project-panel-copy">
        <div className="project-panel-heading">
          <div>
            <p className="section-kicker">{projectType(project)} / {projectPeriod(project)}</p>
            <h3>{displayTitle(project.title)}</h3>
          </div>
          <span className="project-status">
            {project.endDate
              ? projectShowcaseContent.labels.completedProject
              : projectShowcaseContent.labels.currentProject}
          </span>
        </div>

        <p className="project-summary">{projectSummary(project)}</p>

        {project.highlights?.length ? (
          <div className="project-contribution">
            <p>{projectShowcaseContent.labels.contribution}</p>
            <ul>
              {project.highlights.slice(0, 4).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.tech?.length ? (
          <p className="project-stack"><span>{projectShowcaseContent.labels.technologies}</span>{project.tech.join(" · ")}</p>
        ) : null}

        {liveUrl || repoUrl ? (
          <div className="project-actions">
            {liveUrl ? (
              <a className="button button-primary" href={liveUrl} target="_blank" rel="noreferrer">
                Open project <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
            {repoUrl ? (
              <a className="button button-ghost" href={repoUrl} target="_blank" rel="noreferrer">
                <Github aria-hidden="true" /> Repository
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function ProjectsRadar({ projects }: { projects: IProjects[] }) {
  const baseId = useId();
  const visibleProjects = useMemo(
    () => projects.filter((project) => project.isVisible !== false && project.title.trim()),
    [projects],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, visibleProjects.length - 1));
  const activeProject = visibleProjects[safeIndex];

  if (!activeProject) return null;

  const selectFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % visibleProjects.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + visibleProjects.length) % visibleProjects.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = visibleProjects.length - 1;
    else return;

    event.preventDefault();
    setActiveIndex(nextIndex);
    document.getElementById(`${baseId}-tab-${nextIndex}`)?.focus();
  };

  return (
    <section id="projects" className="projects-section content-shell" aria-labelledby="projects-title">
      <div className="section-heading section-heading-simple">
        <h2 id="projects-title">{projectShowcaseContent.title}</h2>
      </div>

      <div className="project-explorer">
        <div className="project-tabs" role="tablist" aria-label="Select project" aria-orientation="vertical">
          {visibleProjects.map((project, index) => (
            <button
              key={project.title}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={safeIndex === index}
              aria-controls={`${baseId}-panel`}
              tabIndex={safeIndex === index ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => selectFromKeyboard(event, index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{displayTitle(project.title)}</strong>
              <small>{project.tech?.slice(0, 2).join(" / ") || "Project"}</small>
            </button>
          ))}
        </div>

        <div
          id={`${baseId}-panel`}
          className="project-active"
          key={activeProject.title}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${safeIndex}`}
        >
          <ProjectPanel project={activeProject} index={safeIndex} />
        </div>
      </div>

      <div className="project-accordion" aria-label="Projects">
        {visibleProjects.map((project, index) => {
          const expanded = safeIndex === index;
          return (
            <div className="project-accordion-item" key={project.title}>
              <button
                id={`${baseId}-mobile-tab-${index}`}
                type="button"
                aria-expanded={expanded}
                aria-controls={`${baseId}-mobile-panel-${index}`}
                onClick={() => setActiveIndex(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{displayTitle(project.title)}</strong>
                <i aria-hidden="true">{expanded ? "−" : "+"}</i>
              </button>
              {expanded ? (
                <div
                  id={`${baseId}-mobile-panel-${index}`}
                  role="region"
                  aria-labelledby={`${baseId}-mobile-tab-${index}`}
                >
                  <ProjectPanel project={project} index={index} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
