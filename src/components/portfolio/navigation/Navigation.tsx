"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Github, Linkedin, Menu, X } from "lucide-react";
import Logo from "@/components/portfolio/logo/Logo";
import { siteContent } from "@/content/site";

function activeHrefForLocation(pathname: string, hash = "") {
  if (pathname.startsWith("/profile")) return siteContent.links.profile;
  if (pathname !== "/") return "";

  const sectionHref = siteContent.navigation.find(
    (link) => link.href.includes("#") && link.href.endsWith(hash),
  );

  return hash && sectionHref ? sectionHref.href : "/";
}

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(() =>
    activeHrefForLocation(pathname),
  );

  useEffect(() => setOpen(false), [pathname]);

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
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-nav-shell">
        <div className="nav-reveal nav-reveal-1">
          <Logo size={38} animate={false} introGate={false} mobileShell={false} />
        </div>

        <button
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
          id="site-navigation"
          className={open ? "site-navigation is-open" : "site-navigation"}
          aria-label="Primary navigation"
        >
          {siteContent.navigation.map((link) => {
            const active = activeHref === link.href;
            const isDownload = link.href === siteContent.links.resume;
            const className = isDownload ? "nav-resume" : undefined;

            if (isDownload) {
              return (
                <a key={link.href} className={className} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
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
          <span className="nav-utilities" role="group" aria-label="Professional profiles">
            <a href={siteContent.links.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <Github aria-hidden="true" />
            </a>
            <a href={siteContent.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
              <Linkedin aria-hidden="true" />
            </a>
          </span>
        </nav>
      </div>
    </header>
  );
}
