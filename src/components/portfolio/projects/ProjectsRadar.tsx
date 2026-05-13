"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

export type ProjectsRadarItem = {
  title: string;
  url: string;
  type?: string | null;
};

const TICK_COUNT = 17;
const ticks = Array.from({ length: TICK_COUNT }, (_, index) => index);

function getScrollProgress() {
  if (typeof window === "undefined") {
    return 0;
  }

  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  const scrollable = Math.max(documentHeight - window.innerHeight, 1);

  return Math.min(Math.max(window.scrollY / scrollable, 0), 1);
}

export default function ProjectsRadar({
  projects,
}: {
  projects: ProjectsRadarItem[];
}) {
  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.title.trim() && project.url.trim(),
      ),
    [projects],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (visibleProjects.length <= 1) {
      setActiveIndex(0);
      return;
    }

    let frame = 0;

    const updateActiveProject = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextIndex = Math.min(
          visibleProjects.length - 1,
          Math.floor(getScrollProgress() * visibleProjects.length),
        );
        setActiveIndex(nextIndex);
      });
    };

    updateActiveProject();
    window.addEventListener("scroll", updateActiveProject, { passive: true });
    window.addEventListener("resize", updateActiveProject);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveProject);
      window.removeEventListener("resize", updateActiveProject);
    };
  }, [visibleProjects.length]);

  if (!visibleProjects.length) {
    return null;
  }

  const activeProject = visibleProjects[activeIndex] ?? visibleProjects[0];
  const ariaLabel = `Open project: ${activeProject.title}`;

  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <div className="projects-radar-wrap intro-gate pointer-events-auto absolute left-1/2 top-[calc(var(--safe-top)+1.45rem)] z-30 -translate-x-1/2 sm:top-[calc(var(--safe-top)+1.65rem)]">
      <a
        href={activeProject.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="projects-radar group"
      >
        <span className="projects-radar-ticks" aria-hidden="true">
          {ticks.map((tick) => {
            const angle = -80 + (160 / (TICK_COUNT - 1)) * tick;
            const isMajor = tick % 4 === 0;

            return (
              <span
                key={tick}
                className={isMajor ? "projects-radar-tick is-major" : "projects-radar-tick"}
                style={
                  {
                    "--radar-angle": `${angle}deg`,
                  } as CSSProperties
                }
              />
            );
          })}
        </span>
        <span className="projects-radar-copy">
          <span className="projects-radar-label">Projects</span>
          <span className="projects-radar-title">
            {activeProject.title}
          </span>
          {activeProject.type ? (
            <span className="projects-radar-type">{activeProject.type}</span>
          ) : null}
        </span>
      </a>
    </div>
  );
}
