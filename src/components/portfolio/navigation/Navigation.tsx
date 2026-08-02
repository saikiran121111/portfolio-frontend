"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, Eye, FileText, Github, Linkedin, Menu, X } from "lucide-react";
import Logo from "@/components/portfolio/logo/Logo";
import SmoothSectionLink from "@/components/portfolio/navigation/SmoothSectionLink";
import ResumeViewer from "@/components/portfolio/resume/ResumeViewer";
import ThemeToggle from "@/components/portfolio/theme/ThemeToggle";
import { siteContent } from "@/content/site";
import { cancelSmoothScroll, scrollToElement } from "@/lib/smoothScroll";

function activeHrefForLocation(pathname: string, hash = "") {
  if (pathname.startsWith("/profile")) return siteContent.links.profile;
  if (pathname !== "/") return "";

  const sectionHref = siteContent.navigation.find(
    (link) => link.href.includes("#") && link.href.endsWith(hash),
  );

  return hash && sectionHref ? sectionHref.href : "/";
}

interface NavigationProps {
  profile?: {
    name?: string;
    github?: string;
    linkedin?: string;
  };
}

export default function Navigation({ profile }: NavigationProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const navToggleRef = useRef<HTMLButtonElement>(null);
  const resumeMenuRef = useRef<HTMLDivElement>(null);
  const [activeHref, setActiveHref] = useState(() =>
    activeHrefForLocation(pathname),
  );
  const github = profile?.github || siteContent.links.github;
  const linkedin = profile?.linkedin || siteContent.links.linkedin;

  useEffect(() => {
    setOpen(false);
    setResumeMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncActiveHref = () => {
      setActiveHref(activeHrefForLocation(pathname, window.location.hash));
    };

    syncActiveHref();
    window.addEventListener("hashchange", syncActiveHref);
    window.addEventListener("popstate", syncActiveHref);

    return () => {
      window.removeEventListener("hashchange", syncActiveHref);
      window.removeEventListener("popstate", syncActiveHref);
    };
  }, [pathname]);

  useEffect(() => {
    if (!window.location.hash) return;
    cancelSmoothScroll();
    const id = decodeURIComponent(window.location.hash.slice(1));
    let observer: MutationObserver | null = null;
    let timeout: number | null = null;

    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (!target) return false;
      scrollToElement(target);
      return true;
    };

    const frame = window.requestAnimationFrame(() => {
      if (scrollToTarget()) return;

      observer = new MutationObserver(() => {
        if (!scrollToTarget()) return;
        observer?.disconnect();
        observer = null;
        if (timeout !== null) window.clearTimeout(timeout);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      timeout = window.setTimeout(() => observer?.disconnect(), 10_000);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      if (timeout !== null) window.clearTimeout(timeout);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open && !resumeMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setResumeMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, resumeMenuOpen]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!window.matchMedia("(max-width: 820px)").matches) return;

      const target = event.target as Node;
      if (
        navigationRef.current?.contains(target) ||
        navToggleRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
      setResumeMenuOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!resumeMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (resumeMenuRef.current?.contains(event.target as Node)) return;
      setResumeMenuOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [resumeMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-nav-shell">
        <div className="nav-reveal nav-reveal-1">
          <Logo
            size={38}
            animate={false}
            introGate={false}
            mobileShell={false}
            ownerName={profile?.name}
          />
        </div>

        <button
          ref={navToggleRef}
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          ref={navigationRef}
          id="site-navigation"
          className={open ? "site-navigation is-open" : "site-navigation"}
          aria-label="Primary navigation"
        >
          {siteContent.navigation.map((link) => {
            const active = activeHref === link.href;
            const isResume = link.href === siteContent.links.resume;
            const isSectionLink = link.href.includes("#");
            const isHomeLink = link.href === "/";

            if (isResume) {
              return (
                <div className="nav-resume-menu" ref={resumeMenuRef} key={link.href}>
                  <button
                    type="button"
                    className="nav-resume-trigger"
                    aria-expanded={resumeMenuOpen}
                    aria-controls="resume-options"
                    onClick={() => setResumeMenuOpen((current) => !current)}
                  >
                    <FileText aria-hidden="true" />
                    <span>{link.label}</span>
                    <ChevronDown className="nav-resume-chevron" aria-hidden="true" />
                  </button>

                  {resumeMenuOpen ? (
                    <div id="resume-options" className="nav-resume-options" aria-label="Resume options">
                      <button
                        type="button"
                        className="nav-resume-option"
                        onClick={() => {
                          setResumeMenuOpen(false);
                          setOpen(false);
                          setResumeViewerOpen(true);
                        }}
                      >
                        <span className="nav-resume-option-icon"><Eye aria-hidden="true" /></span>
                        <span><strong>View resume</strong><small>Open full-screen preview</small></span>
                      </button>
                      <a
                        className="nav-resume-option"
                        href={siteContent.links.resume}
                        onClick={() => {
                          setResumeMenuOpen(false);
                          setOpen(false);
                        }}
                      >
                        <span className="nav-resume-option-icon"><Download aria-hidden="true" /></span>
                        <span><strong>Download PDF</strong><small>Save an offline copy</small></span>
                      </a>
                    </div>
                  ) : null}
                </div>
              );
            }

            if (pathname === "/" && (isHomeLink || isSectionLink)) {
              return (
                <SmoothSectionLink
                  key={link.href}
                  href={link.href}
                  aria-current={active ? (isHomeLink ? "page" : "location") : undefined}
                  onClick={() => {
                    setActiveHref(link.href);
                    setOpen(false);
                  }}
                >
                  {link.label}
                </SmoothSectionLink>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                scroll={isSectionLink ? false : undefined}
                aria-current={active ? (link.href.includes("#") ? "location" : "page") : undefined}
                onClick={() => {
                  setActiveHref(link.href);
                  setOpen(false);
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="nav-utilities" role="group" aria-label="Display and professional profiles">
            <ThemeToggle />
            <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <Github aria-hidden="true" />
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
              <Linkedin aria-hidden="true" />
            </a>
          </span>
        </nav>
      </div>
      <ResumeViewer
        open={resumeViewerOpen}
        onOpenChange={setResumeViewerOpen}
        ownerName={profile?.name}
      />
    </header>
  );
}
