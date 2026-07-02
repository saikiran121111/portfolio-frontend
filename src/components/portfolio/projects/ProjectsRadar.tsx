"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

export type ProjectsRadarItem = {
  title: string;
  url: string;
  type?: string | null;
};

const WHEEL_THROTTLE_MS = 140;
const URL_PATTERN = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

function formatUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "#";
  return URL_PATTERN.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function getInitial(title: string) {
  return title.trim().charAt(0).toUpperCase() || "P";
}

export default function ProjectsRadar({
  projects,
}: {
  projects: ProjectsRadarItem[];
}) {
  const visibleProjects = useMemo(
    () =>
      projects
        .map((project) => ({
          ...project,
          title: project.title.trim(),
          url: project.url.trim(),
          type: project.type?.trim() || null,
        }))
        .filter((project) => project.title && project.url),
    [projects]
  );

  const total = visibleProjects.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!total) return;
    setActiveIndex((prev) => Math.min(prev, total - 1));
  }, [total]);

  const cycleProject = useCallback(
    (direction: number) => {
      if (total <= 1) return;
      setActiveIndex((prev) => (prev + direction + total) % total);
    },
    [total]
  );

  const selectProject = useCallback(
    (index: number) => {
      if (!total) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const activeProject = visibleProjects[activeIndex];

  useEffect(() => {
    const node = rootRef.current;
    if (!node || total <= 1) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (wheelLockRef.current) return;

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (delta === 0) return;

      cycleProject(delta > 0 ? 1 : -1);
      setIsOpen(true);

      wheelLockRef.current = setTimeout(() => {
        wheelLockRef.current = null;
      }, WHEEL_THROTTLE_MS);
    };

    node.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", onWheel);
      if (wheelLockRef.current) {
        clearTimeout(wheelLockRef.current);
        wheelLockRef.current = null;
      }
    };
  }, [cycleProject, total]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!rootRef.current || !target) return;
      if (!rootRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const openActiveProject = useCallback(() => {
    if (!activeProject) return;

    const href = formatUrl(activeProject.url);
    if (href === "#" || typeof window === "undefined") return;

    if (isExternalUrl(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  }, [activeProject]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!total) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        cycleProject(1);
        setIsOpen(true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        cycleProject(-1);
        setIsOpen(true);
        break;
      case "Home":
        event.preventDefault();
        selectProject(0);
        setIsOpen(true);
        break;
      case "End":
        event.preventDefault();
        selectProject(total - 1);
        setIsOpen(true);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        openActiveProject();
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  }

  if (!activeProject) return null;

  const activeHref = formatUrl(activeProject.url);
  const activeExternal = isExternalUrl(activeHref);
  const progressWidth = `${((activeIndex + 1) / total) * 100}%`;

  return (
    <div className="intro-gate pointer-events-auto absolute left-1/2 top-[calc(var(--safe-top)+1rem)] z-40 w-[min(calc(100vw-1rem),42rem)] -translate-x-1/2 sm:w-[min(calc(100vw-2rem),44rem)]">
      <div
        ref={rootRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="outline-none"
      >
        {/* Main top bar */}
        <div className="relative overflow-hidden rounded-[24px] border border-cyan-400/15 bg-black/60 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {/* glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

          <div className="relative p-2.5 sm:p-3">
            <div className="flex items-center gap-2">
              {/* Left label */}
              <div className="hidden shrink-0 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100/75">
                  Projects
                </span>
              </div>

              {/* Active project card */}
              <a
                href={activeHref}
                target={activeExternal ? "_blank" : undefined}
                rel={activeExternal ? "noopener noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
                className="group min-w-0 flex-1 rounded-[18px] border border-white/10 bg-white/[0.04] px-3 py-2.5 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-sm font-semibold text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                    {getInitial(activeProject.title)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.24em] text-cyan-100/80 sm:hidden">
                        Projects
                      </span>
                      <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-100/45 lg:inline">
                        Scroll / arrows to cycle
                      </span>
                    </div>

                    <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-white sm:text-[15px]">
                      {activeProject.title}
                    </p>

                    <p className="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100/55 sm:text-[11px]">
                      {activeProject.type || "Featured project"}
                    </p>
                  </div>

                  <span className="hidden shrink-0 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition group-hover:translate-x-0.5 sm:inline-flex">
                    Open ↗
                  </span>
                </div>
              </a>

              {/* Controls */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous project"
                    onClick={() => {
                      cycleProject(-1);
                      setIsOpen(true);
                    }}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100/75 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07] hover:text-white"
                  >
                    <span className="-translate-x-px text-lg leading-none">‹</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Next project"
                    onClick={() => {
                      cycleProject(1);
                      setIsOpen(true);
                    }}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100/75 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07] hover:text-white"
                  >
                    <span className="translate-x-px text-lg leading-none">›</span>
                  </button>

                  <button
                    type="button"
                    aria-label={isOpen ? "Close project list" : "Open project list"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100/75 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07] hover:text-white"
                  >
                    <span
                      className={`text-sm transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* bottom meta */}
            <div className="mt-3 flex items-center justify-between gap-3 px-1">
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-100/45">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </div>

              <div className="flex-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-cyan-300 via-cyan-200 to-white transition-all duration-300"
                  style={{ width: progressWidth }}
                />
              </div>

              <div className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-100/45 sm:block">
                {total} items
              </div>
            </div>
          </div>
        </div>

        {/* Switcher panel */}
        {total > 1 && (
          <div
            className={`overflow-hidden transition-all duration-250 ease-out ${
              isOpen
                ? "mt-3 max-h-[420px] opacity-100"
                : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-[22px] border border-cyan-400/15 bg-black/65 p-2.5 shadow-[0_10px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between px-1.5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-100/65">
                    Project Switcher
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    Hover to preview. Click to open.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {visibleProjects.slice(0, 6).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Go to project ${index + 1}`}
                      onClick={() => selectProject(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === activeIndex
                          ? "w-7 bg-cyan-200 shadow-[0_0_10px_rgba(165,243,252,0.8)]"
                          : "w-1.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {visibleProjects.map((project, index) => {
                  const href = formatUrl(project.url);
                  const external = isExternalUrl(href);
                  const isActive = index === activeIndex;

                  return (
                    <a
                      key={`${project.title}-${project.url}`}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      onMouseEnter={() => selectProject(index)}
                      onFocus={() => selectProject(index)}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center gap-3 rounded-[18px] border px-3 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
                        isActive
                          ? "border-cyan-300/35 bg-cyan-300/[0.12]"
                          : "border-white/10 bg-white/[0.03] hover:border-cyan-300/20 hover:bg-cyan-300/[0.06]"
                      }`}
                    >
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-[11px] font-bold ${
                          isActive
                            ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                            : "border-white/10 bg-black/30 text-cyan-100/60"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {project.title}
                        </p>
                        <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/50">
                          {project.type || "View project"}
                        </p>
                      </div>

                      <span className="shrink-0 text-cyan-100/45 transition group-hover:text-cyan-100/80">
                        ↗
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}