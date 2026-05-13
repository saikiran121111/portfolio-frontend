"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

export type ProjectsRadarItem = {
  title: string;
  url: string;
  type?: string | null;
};

const TICK_COUNT = 21;
const ticks = Array.from({ length: TICK_COUNT }, (_, index) => index);

export default function ProjectsRadar({
  projects,
}: {
  projects: ProjectsRadarItem[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const visibleProjects = projects.filter(
    (project) => project.title.trim() && project.url.trim()
  );
  
  const containerRef = useRef<HTMLAnchorElement>(null);

  const formatUrl = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isHovered || visibleProjects.length <= 1) return;

      e.preventDefault(); // Stop page scrolling when hovered

      if (scrollTimeoutRef.current) return; // Throttle scrolling

      if (e.deltaY > 0) {
        // Scroll down
        setActiveIndex((prev) => (prev + 1) % visibleProjects.length);
      } else if (e.deltaY < 0) {
        // Scroll up
        setActiveIndex(
          (prev) => (prev - 1 + visibleProjects.length) % visibleProjects.length
        );
      }

      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
      }, 150); // Throttle delay
    },
    [isHovered, visibleProjects.length]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [handleWheel]);

  if (!visibleProjects.length) {
    return null;
  }

  // We should still return something even if no projects exist, 
  // but it will just be static "Projects" without hover project cycling.
  const hasProjects = visibleProjects.length > 0;
  const activeProject = hasProjects ? visibleProjects[activeIndex] : null;

  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  function handleClick() {
    setIsHovered(false);
  }

  return (
    <div className="projects-radar-wrap intro-gate pointer-events-auto absolute left-1/2 top-[calc(var(--safe-top)+1.45rem)] z-30 -translate-x-1/2 sm:top-[calc(var(--safe-top)+1.65rem)]">
      <a
        ref={containerRef}
        id="projects-radar-container"
        href={activeProject ? formatUrl(activeProject.url) : "#"}
        target={activeProject ? "_blank" : undefined}
        rel={activeProject ? "noopener noreferrer" : undefined}
        aria-label={activeProject ? `Open project: ${activeProject.title}` : "Projects"}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onMouseEnter={() => hasProjects && setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveIndex(0);
        }}
        className={`projects-radar group ${isHovered ? "is-hovered !cursor-none" : ""}`}
        style={isHovered ? { cursor: "none" } : {}}
      >
        <div className={`projects-radar-inner ${isHovered ? "!cursor-none pointer-events-none" : ""}`}>
          <span className="projects-radar-ticks" aria-hidden="true">
            {ticks.map((tick) => {
              const angle = -75 + (150 / (TICK_COUNT - 1)) * tick;
              const isMajor = tick % 5 === 0;

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
            <span className="projects-radar-label" style={{ opacity: isHovered ? 0 : 1, transform: isHovered ? 'translateY(10px)' : 'translateY(0)' }}>
              Projects
            </span>
            {hasProjects && (
              <span className="projects-radar-title" style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(-10px)' }}>
                {activeProject?.title}
              </span>
            )}
          </span>
        </div>
      </a>
    </div>
  );
}
