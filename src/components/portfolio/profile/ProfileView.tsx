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
  aiFocusContent,
  currentRole,
  experienceLabel,
  groupRecruiterSkills,
  resolveProfessionalSummary,
  selectAiSkills,
  selectRecruiterAchievements,
  selectRelevantCertifications,
} from "@/content/selectors";
import { siteContent } from "@/content/site";
import ProfileSectionIndex from "@/components/portfolio/profile/ProfileSectionIndex";
import TechnologyList from "@/components/portfolio/skills/TechnologyList";
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

function ProfileSectionHeading({
  index,
  label,
  title,
  titleId,
}: {
  index: string;
  label: string;
  title: string;
  titleId: string;
}) {
  return (
    <div className="resume-section-heading">
      <p className="section-kicker">
        <span className="section-kicker-number">{index}</span>
        <span className="section-kicker-label">{label}</span>
      </p>
      <h2 id={titleId}>{title}</h2>
    </div>
  );
}

export default function ProfileView({ data }: { data: IPortfolio }) {
  const skillGroups = groupRecruiterSkills(data.skills);
  const aiSkills = selectAiSkills(data.skills);
  const aiFocus = aiFocusContent(data.skills);
  const experience = experienceLabel(data.experiences);
  const recentExperience = currentRole(data.experiences);
  const availability = data.bottomHeadline?.find((line) =>
    /\b(open to|seeking)\b/i.test(line),
  );
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
          {data.headline ? <p className="profile-headline">{data.headline}</p> : null}
          {recentExperience ? (
            <p className="profile-transition">{cleanTitle(recentExperience.title)} / {recentExperience.company}</p>
          ) : null}
          <p className="profile-summary">{resolveProfessionalSummary(data.summary)}</p>
          {availability ? (
            <div className="target-role-list" aria-label="Opportunity focus">
              <span>Opportunity focus</span>
              <p>{availability}</p>
            </div>
          ) : null}
          <div className="profile-contact-row">
            {data.location ? <span><MapPin aria-hidden="true" /> {data.location}</span> : null}
            <a href={`mailto:${data.email}`}><Mail aria-hidden="true" /> {data.email}</a>
          </div>
          <div className="profile-actions">
            <a className="button button-primary" href={siteContent.links.resume}>
              <Download aria-hidden="true" /> Download Resume
            </a>
            <a className="button button-secondary" href={linkedin} target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" /> LinkedIn <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="text-link" href={github} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" /> GitHub <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure
          className="profile-portrait"
          role="group"
          tabIndex={0}
          aria-label={`Professional portrait and profile summary for ${data.name}`}
        >
          <div className="profile-portrait-image" aria-hidden="true" />
          <figcaption className="profile-portrait-overlay">
            <div className="profile-portrait-overlay-heading">
              <span>Profile snapshot</span>
            </div>
            <dl className="profile-snapshot" aria-label="Profile summary">
              {experience ? <div><dt>Experience</dt><dd>{experience}</dd></div> : null}
              {aiSkills.length ? <div><dt>Current direction</dt><dd>{aiFocus.title}</dd></div> : null}
            </dl>
          </figcaption>
        </figure>
      </header>

      <div className="profile-layout">
        <ProfileSectionIndex hasAiSkills={Boolean(aiSkills.length)} />

        <div className="profile-content">
          <section className="resume-section" id="experience" aria-labelledby="experience-title">
            <ProfileSectionHeading
              index="01"
              label={profileContent.sections.experience}
              title="Professional experience"
              titleId="experience-title"
            />
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
                    <TechnologyList
                      items={experience.techStack}
                      label="Technologies used"
                      ariaLabel={`Technologies used at ${experience.company}`}
                      compact
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {aiSkills.length ? (
            <section className="resume-section" id="ai-direction" aria-labelledby="ai-direction-title">
              <ProfileSectionHeading
                index="02"
                label={profileContent.sections.aiDirection}
                title={aiFocus.title}
                titleId="ai-direction-title"
              />
              <div className="ai-profile-focus">
                <div>
                  <p className="direction-label">Positioning</p>
                  <h3>{aiFocus.status}</h3>
                  <p>{aiFocus.summary}</p>
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
            <ProfileSectionHeading
              index="03"
              label="Strengths"
              title="Technical strengths"
              titleId="strengths-title"
            />
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
              <ProfileSectionHeading
                index="04"
                label={profileContent.sections.projects}
                title="Selected engineering work"
                titleId="profile-projects-title"
              />
              <div className="resume-project-list">
                {visibleProjects.map((project, index) => {
                  const href = projectLink(project);
                  return (
                    <article className="resume-project" key={project.title}>
                      <span className="resume-project-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{cleanProjectTitle(project.title)}</h3>
                        {project.type ? <p className="resume-project-type">{project.type}</p> : null}
                        <p>{project.description}</p>
                        {project.highlights.length ? (
                          <ul>{project.highlights.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                        ) : null}
                        <TechnologyList
                          items={project.tech}
                          label="Technologies"
                          ariaLabel={`Technologies used for ${cleanProjectTitle(project.title)}`}
                          compact
                        />
                      </div>
                      {href ? <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${cleanProjectTitle(project.title)}`}><ArrowUpRight aria-hidden="true" /></a> : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="resume-section" id="education" aria-labelledby="education-title">
            <ProfileSectionHeading
              index="05"
              label={profileContent.sections.education}
              title="Education"
              titleId="education-title"
            />
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
            <ProfileSectionHeading
              index="06"
              label={profileContent.sections.credentials}
              title="Relevant credentials and recognition"
              titleId="credentials-title"
            />
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
