import {
  ArrowUpRight,
  CalendarDays,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { profileContent } from "@/content/profile";
import {
  groupRecruiterSkills,
  resolveProfessionalSummary,
  selectAiSkills,
  selectRecruiterAchievements,
  selectRelevantCertifications,
} from "@/content/selectors";
import { siteContent } from "@/content/site";
import SmoothSectionLink from "@/components/portfolio/navigation/SmoothSectionLink";
import type { IPortfolio } from "@/interfaces/portfolio.interface";
import type { IProjects } from "@/interfaces/user.interface";

function formatDate(date?: Date | null) {
  if (!date) return "Present";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function cleanTitle(title: string) {
  return title.replace(/SWE\s*-\s*/i, "Software Engineer / ");
}

function cleanProjectTitle(title: string) {
  return title.replace(/\s*\(Accenture Client\)/i, "");
}

function projectLink(project: IProjects) {
  return project.liveUrl || project.projectUrl || project.repoUrl;
}

export default function ProfileView({ data }: { data: IPortfolio }) {
  const skillGroups = groupRecruiterSkills(data.skills);
  const aiSkills = selectAiSkills(data.skills);
  const certifications = selectRelevantCertifications(data.certifications);
  const achievements = selectRecruiterAchievements(data.achievements);
  const visibleProjects = data.projects?.filter((project) => project.isVisible !== false) ?? [];
  const github = data.socials?.github || siteContent.links.github;
  const linkedin = data.socials?.linkedin || siteContent.links.linkedin;

  return (
    <div className="profile-page content-shell">
      <header className="profile-hero" id="profile-overview">
        <div className="profile-hero-copy">
          <p className="section-kicker">{profileContent.eyebrow}</p>
          <h1>{data.name}</h1>
          <p className="profile-headline">{siteContent.identity.professionalTitle}</p>
          <p className="profile-transition">{siteContent.identity.transitionLabel}</p>
          <p className="profile-summary">{resolveProfessionalSummary(data.summary)}</p>
          {data.headline ? <p className="profile-specialization">{data.headline}</p> : null}
          <div className="target-role-list" aria-label="Target roles">
            <span>Target roles</span>
            <p>{siteContent.targetRoles.join(" · ")}</p>
          </div>
          <div className="profile-contact-row">
            {data.location ? <span><MapPin aria-hidden="true" /> {data.location}</span> : null}
            <a href={`mailto:${data.email}`}><Mail aria-hidden="true" /> {data.email}</a>
          </div>
          <div className="profile-actions">
            <a className="button button-primary" href={siteContent.links.resume}>
              <Download aria-hidden="true" /> Download résumé
            </a>
            <a className="button button-secondary" href={linkedin} target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" /> LinkedIn <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="text-link" href={github} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" /> GitHub <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <dl className="profile-snapshot" aria-label="Profile summary">
          <div><dt>Experience</dt><dd>{siteContent.identity.experienceLabel}</dd></div>
          <div><dt>Professional roles</dt><dd>{data.experiences.length}</dd></div>
          <div><dt>Selected projects</dt><dd>{visibleProjects.length}</dd></div>
          <div><dt>Current direction</dt><dd>AI engineering</dd></div>
        </dl>
      </header>

      <div className="profile-layout">
        <aside className="profile-index" aria-label={profileContent.indexLabel}>
          <p>{profileContent.indexLabel}</p>
          <SmoothSectionLink href="#experience">{profileContent.sections.experience}</SmoothSectionLink>
          {aiSkills.length ? <SmoothSectionLink href="#ai-direction">{profileContent.sections.aiDirection}</SmoothSectionLink> : null}
          <SmoothSectionLink href="#strengths">{profileContent.sections.strengths}</SmoothSectionLink>
          <SmoothSectionLink href="#profile-projects">{profileContent.sections.projects}</SmoothSectionLink>
          <SmoothSectionLink href="#education">{profileContent.sections.education}</SmoothSectionLink>
          <SmoothSectionLink href="#credentials">{profileContent.sections.credentials}</SmoothSectionLink>
        </aside>

        <div className="profile-content">
          <section className="resume-section" id="experience" aria-labelledby="experience-title">
            <div className="resume-section-heading">
              <p className="section-kicker">01 / {profileContent.sections.experience}</p>
              <h2 id="experience-title">Professional experience</h2>
            </div>
            <div className="timeline">
              {data.experiences.map((experience) => (
                <article className="timeline-entry" key={`${experience.company}-${experience.startDate.toISOString()}`}>
                  <div className="timeline-meta">
                    <span><CalendarDays aria-hidden="true" /> {formatDate(experience.startDate)} – {formatDate(experience.endDate)}</span>
                    {experience.location ? <span>{experience.location}</span> : null}
                  </div>
                  <div className="timeline-copy">
                    <h3>{cleanTitle(experience.title)}</h3>
                    <p className="timeline-company">{experience.company}</p>
                    {experience.description ? <p>{experience.description}</p> : null}
                    <ul>{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                    <p className="profile-stack"><span>Technologies</span>{experience.techStack.join(" / ")}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {aiSkills.length ? (
            <section className="resume-section" id="ai-direction" aria-labelledby="ai-direction-title">
              <div className="resume-section-heading">
                <p className="section-kicker">02 / {profileContent.sections.aiDirection}</p>
                <h2 id="ai-direction-title">{siteContent.aiFocus.title}</h2>
              </div>
              <div className="ai-profile-focus">
                <div>
                  <p className="direction-label">Positioning</p>
                  <h3>{siteContent.aiFocus.status}</h3>
                  <p>{siteContent.aiFocus.summary}</p>
                </div>
                <ul aria-label="AI engineering technologies listed in profile data">
                  {aiSkills.map((skill) => (
                    <li key={skill.name}><span>{skill.name}</span><small>{skill.level}</small></li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <section className="resume-section" id="strengths" aria-labelledby="strengths-title">
            <div className="resume-section-heading">
              <p className="section-kicker">03 / Strengths</p>
              <h2 id="strengths-title">Technical strengths</h2>
            </div>
            <div className="skills-groups">
              {skillGroups.map((group) => (
                <div className="skill-group" key={group.category}>
                  <h3>{group.label}</h3>
                  <ul>{group.skills.map((skill) => <li key={skill.name}><span>{skill.name}</span><small>{skill.level}</small></li>)}</ul>
                </div>
              ))}
            </div>
          </section>

          {visibleProjects.length ? (
            <section className="resume-section" id="profile-projects" aria-labelledby="profile-projects-title">
              <div className="resume-section-heading">
                <p className="section-kicker">04 / {profileContent.sections.projects}</p>
                <h2 id="profile-projects-title">Selected engineering work</h2>
              </div>
              <div className="resume-project-list">
                {visibleProjects.map((project, index) => {
                  const href = projectLink(project);
                  return (
                    <article className="resume-project" key={project.title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{cleanProjectTitle(project.title)}</h3>
                        {project.type ? <p className="resume-project-type">{project.type}</p> : null}
                        <p>{project.description}</p>
                        {project.highlights.length ? (
                          <ul>{project.highlights.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                        ) : null}
                        <p className="profile-stack"><span>Technologies</span>{project.tech.join(" / ")}</p>
                      </div>
                      {href ? <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${cleanProjectTitle(project.title)}`}><ArrowUpRight aria-hidden="true" /></a> : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="resume-section" id="education" aria-labelledby="education-title">
            <div className="resume-section-heading">
              <p className="section-kicker">05 / {profileContent.sections.education}</p>
              <h2 id="education-title">Education</h2>
            </div>
            <div className="education-list">
              {data.education.map((education) => (
                <article key={`${education.institution}-${education.degree}`}>
                  <p>{formatDate(education.startDate)} – {formatDate(education.endDate)}</p>
                  <h3>{education.degree}{education.field ? ` / ${education.field}` : ""}</h3>
                  <span>{education.institution}</span>
                  {education.description ? <p>{education.description}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="resume-section" id="credentials" aria-labelledby="credentials-title">
            <div className="resume-section-heading">
              <p className="section-kicker">06 / {profileContent.sections.credentials}</p>
              <h2 id="credentials-title">Relevant credentials and recognition</h2>
            </div>
            <div className="credentials-grid">
              <div>
                <h3>Selected certifications</h3>
                {certifications.length ? certifications.map((item) => (
                  <p key={item.title}>{item.link ? <a href={item.link} target="_blank" rel="noreferrer">{item.title} <ArrowUpRight aria-hidden="true" /></a> : item.title}<span>{item.issuer} / {formatDate(item.date)}</span></p>
                )) : <p>No certifications listed.</p>}
              </div>
              <div>
                <h3>Engineering achievements</h3>
                {achievements.length ? achievements.map((item) => <p key={item.title}>{item.title}{item.date ? <span>{formatDate(item.date)}</span> : null}</p>) : <p>No achievements listed.</p>}
              </div>
              <div>
                <h3>Languages</h3>
                {data.languages?.length ? data.languages.map((item) => <p key={item.name}>{item.name}<span>{item.level}</span></p>) : <p>No languages listed.</p>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
