import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import ProfileLink from "@/components/portfolio/profile/ProfileLink";
import ProjectsRadar from "@/components/portfolio/projects/ProjectsRadar";
import ResumeViewButton from "@/components/portfolio/resume/ResumeViewButton";
import SmoothSectionLink from "@/components/portfolio/navigation/SmoothSectionLink";
import {
  aiFocusContent,
  createHomepageSummary,
  currentRole,
  engineeringFocusAreas,
  experienceLabel,
  resolveCandidateIdentity,
  selectAiSkills,
  selectFeaturedProjects,
  selectStrongestSkills,
} from "@/content/selectors";
import { fetchUserPortfolio } from "@/services/portfolio.service";

function experiencePeriod(startDate: Date, endDate?: Date | null) {
  const format = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });
  return `${format.format(startDate)} – ${endDate ? format.format(endDate) : "Present"}`;
}

function roleTitle(title: string) {
  return title.replace(/SWE\s*-\s*/i, "Software Engineer / ");
}

export default async function Home() {
  const portfolio = await fetchUserPortfolio({ cache: "no-store" }).catch(() => null);
  const identity = resolveCandidateIdentity(portfolio);
  const projects = selectFeaturedProjects(
    portfolio?.projects,
    portfolio?.homepageProjects,
  );
  const aiSkills = selectAiSkills(portfolio?.skills);
  const strongestSkills = selectStrongestSkills(portfolio?.skills);
  const aiFocus = aiFocusContent(portfolio?.skills);
  const focusAreas = engineeringFocusAreas(portfolio?.skills);
  const experience = experienceLabel(portfolio?.experiences);
  const recentExperience = currentRole(portfolio?.experiences);
  const primaryEducation = portfolio?.education?.[0];
  const certifications = portfolio?.certifications
    ?.filter((item) => !/sales accredit/i.test(item.title))
    .slice(0, 3) ?? [];

  return (
    <main id="main-content" className="portfolio-main" tabIndex={-1}>
      <section className="hero-section content-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="section-kicker hero-reveal hero-reveal-1">
            {recentExperience
              ? `${roleTitle(recentExperience.title)} / ${recentExperience.company}`
              : "Engineering portfolio"}
          </p>
          <h1 id="hero-title" className="hero-reveal hero-reveal-2">{identity.name}</h1>
          <p className="hero-statement hero-reveal hero-reveal-3">
            {identity.headline}
          </p>
          <p className="hero-summary hero-reveal hero-reveal-4">
            {createHomepageSummary(identity.summary)}
          </p>
          {identity.availability ? (
            <p className="hero-availability hero-reveal hero-reveal-4">
              <span aria-hidden="true" /> {identity.availability}
            </p>
          ) : null}

          <div className="hero-actions hero-reveal hero-reveal-5">
            <ResumeViewButton ownerName={identity.name} />
            <SmoothSectionLink className="button button-secondary" href="#projects">
              Explore projects <ArrowDownRight aria-hidden="true" />
            </SmoothSectionLink>
            <ProfileLink />
          </div>

          <div className="hero-socials hero-reveal hero-reveal-5" aria-label="Professional links">
            <a href={identity.github} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" /> GitHub
            </a>
            <a href={identity.linkedin} target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" /> LinkedIn
            </a>
            <a href={`mailto:${identity.email}`}>
              <Mail aria-hidden="true" /> Email
            </a>
          </div>

          <dl className="hero-facts hero-reveal hero-reveal-5">
            {experience ? <div><dt>Experience</dt><dd>{experience}</dd></div> : null}
            {recentExperience ? <div><dt>Latest role</dt><dd>{roleTitle(recentExperience.title)}</dd></div> : null}
            <div><dt>Location</dt><dd>{identity.location}</dd></div>
          </dl>
        </div>

        {focusAreas.length ? <div
          className="hero-visual"
          aria-label="Engineering focus areas from profile data"
        >
          <div className="hero-visual-frame">
            <div className="hero-visual-topline">
              <span>Engineering path</span>
              <span className="live-indicator">Current focus</span>
            </div>
            <ol className="hero-career-path">
              {focusAreas.map((stage, index) => (
                <li className={`hero-career-stage hero-career-stage-${index + 1}`} key={stage.number}>
                  <span className="hero-career-marker" aria-hidden="true">{stage.number}</span>
                  <span className="hero-career-heading">
                    <span>{stage.label}</span>
                    <strong>{stage.title}</strong>
                  </span>
                  <small>{stage.detail}</small>
                </li>
              ))}
            </ol>
            <p className="hero-visual-summary">
              {experience ? <span>{experience} in production engineering</span> : null}
              <strong>{portfolio?.skills.length ?? 0} skills in the current profile</strong>
            </p>
          </div>
        </div> : null}
      </section>

      {focusAreas.length ? <section className="focus-strip" aria-label="Engineering focus areas">
        <ol className="content-shell focus-grid">
          {focusAreas.map((area, index) => (
            <li
              className={`focus-item${index === focusAreas.length - 1 ? " focus-item-current" : ""}`}
              key={area.number}
            >
              <span className="focus-marker" aria-hidden="true">{area.number}</span>
              <div className="focus-copy">
                <h2>{area.title}</h2>
                <p>{area.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section> : null}

      <section className="direction-section content-shell" aria-labelledby="direction-title">
        <div className="section-heading section-heading-simple">
          <h2 id="direction-title">Engineering direction</h2>
        </div>

        <div className="direction-grid">
          <div>
            <p className="direction-label">Engineering foundation</p>
            <h3>Backend engineering</h3>
            {strongestSkills.length ? (
              <p>{strongestSkills.map((skill) => skill.name).join(", ")}.</p>
            ) : null}
            <ul className="inline-skill-list" aria-label="Strongest technologies">
              {strongestSkills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
            </ul>
          </div>
          <div>
            <p className="direction-label">AI engineering focus</p>
            <h3>{aiFocus.status}</h3>
            {aiFocus.summary ? <p>{aiFocus.summary}</p> : null}
            {aiSkills.length ? (
              <ul className="inline-skill-list" aria-label="Current AI technologies">
                {aiSkills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <ProjectsRadar projects={projects} />

      <section id="experience" className="profile-preview content-shell" aria-labelledby="profile-preview-title">
        <div className="section-heading section-heading-simple section-heading-actions">
          <h2 id="profile-preview-title">Experience</h2>
          <ProfileLink label="View full experience" />
        </div>

        {recentExperience ? (
          <article className="experience-preview experience-preview-wide">
            <p className="section-kicker">Most recent role</p>
            <div className="experience-preview-heading">
              <h3>{recentExperience.title.replace(/SWE\s*-\s*/i, "Software Engineer / ")}</h3>
              <span>{experiencePeriod(recentExperience.startDate, recentExperience.endDate)}</span>
            </div>
            <p>{recentExperience.company} / {recentExperience.location}</p>
            <ul>
              {recentExperience.bullets.slice(0, 3).map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </article>
        ) : null}
      </section>

      {(primaryEducation || certifications.length) ? (
        <section className="evidence-section content-shell" aria-labelledby="evidence-title">
          <div className="section-heading section-heading-simple">
            <h2 id="evidence-title">Education &amp; certifications</h2>
          </div>
          <div className="evidence-grid">
            {primaryEducation ? (
              <article>
                <p className="direction-label">Education</p>
                <h3>{primaryEducation.degree}</h3>
                <p>{primaryEducation.field}</p>
                <span>{primaryEducation.institution}</span>
              </article>
            ) : null}
            {certifications.length ? (
              <div>
                <p className="direction-label">Selected credentials</p>
                <ul>
                  {certifications.map((item) => (
                    <li key={item.title}>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer">
                          {item.title} <ArrowUpRight aria-hidden="true" />
                        </a>
                      ) : item.title}
                      <span>{item.issuer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

    </main>
  );
}
