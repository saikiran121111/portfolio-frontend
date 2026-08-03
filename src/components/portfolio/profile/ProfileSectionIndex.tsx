"use client";

import { useEffect, useMemo, useState } from "react";
import SmoothSectionLink from "@/components/portfolio/navigation/SmoothSectionLink";
import { profileContent } from "@/content/profile";

function profileSections(hasAiSkills: boolean) {
  return [
    { id: "experience", label: profileContent.sections.experience },
    ...(hasAiSkills
      ? [{ id: "ai-direction", label: profileContent.sections.aiDirection }]
      : []),
    { id: "strengths", label: profileContent.sections.strengths },
    { id: "profile-projects", label: profileContent.sections.projects },
    { id: "education", label: profileContent.sections.education },
    { id: "credentials", label: profileContent.sections.credentials },
  ];
}

export default function ProfileSectionIndex({
  hasAiSkills,
}: {
  hasAiSkills: boolean;
}) {
  const [activeSection, setActiveSection] = useState("experience");
  const sections = useMemo(() => profileSections(hasAiSkills), [hasAiSkills]);

  useEffect(() => {
    const syncHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (sections.some((section) => section.id === id)) setActiveSection(id);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    if (!("IntersectionObserver" in window)) {
      return () => window.removeEventListener("hashchange", syncHash);
    }

    const observer = new IntersectionObserver(
      () => {
        const activationLine = window.innerHeight * 0.21;
        const positions = sections
          .map((section) => ({
            id: section.id,
            rect: document.getElementById(section.id)?.getBoundingClientRect(),
          }))
          .filter(
            (section): section is { id: string; rect: DOMRect } =>
              section.rect !== undefined,
          );
        const current =
          positions.find(
            (section) =>
              section.rect.top <= activationLine &&
              section.rect.bottom > activationLine,
          ) ??
          positions.filter((section) => section.rect.top <= activationLine).at(-1) ??
          positions[0];

        if (current) setActiveSection(current.id);
      },
      { rootMargin: "-20% 0px -79%", threshold: 0 },
    );

    sections.forEach((section) => {
      const target = document.getElementById(section.id);
      if (target) observer.observe(target);
    });

    return () => {
      window.removeEventListener("hashchange", syncHash);
      observer.disconnect();
    };
  }, [sections]);

  return (
    <aside className="profile-index">
      <p>{profileContent.indexLabel}</p>
      <nav aria-label={profileContent.indexLabel}>
        {sections.map((section, index) => (
          <SmoothSectionLink
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? "location" : undefined}
            onClick={() => setActiveSection(section.id)}
            key={section.id}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {section.label}
          </SmoothSectionLink>
        ))}
      </nav>
    </aside>
  );
}
