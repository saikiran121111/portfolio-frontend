import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import HeroCanvasLoader from "@/components/portfolio/hero/HeroCanvasLoader";
import ProfileLink from "@/components/portfolio/profile/ProfileLink";
import ProjectsRadar from "@/components/portfolio/projects/ProjectsRadar";
import { profileContent } from "@/content/profile";
import {
  resolveCandidateIdentity,
  selectAiSkills,
  selectFeaturedProjects,
  selectStrongestSkills,
} from "@/content/selectors";
import { siteContent } from "@/content/site";
import { fetchUserPortfolio } from "@/services/portfolio.service";

function experiencePeriod(startDate: Date, endDate?: Date | null) {
  const format = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });
  return `${format.format(startDate)} – ${endDate ? format.format(endDate) : "Present"}`;
}

export default async function Home() {
  const portfolio = await fetchUserPortfolio({ cache: "no-store" }).catch(() => null);
  const identity = resolveCandidateIdentity(portfolio);
  const projects = selectFeaturedProjects(portfolio?.projects);
  const aiSkills = selectAiSkills(portfolio?.skills);
  const strongestSkills = selectStrongestSkills(portfolio?.skills);
  const recentExperience = portfolio?.experiences?.[0];
  const primaryEducation = portfolio?.education?.[0];
  const certifications = portfolio?.certifications
    ?.filter((item) => !/sales accredit/i.test(item.title))
    .slice(0, 3) ?? [];

  return (
    <main id="main-content" className="portfolio-main" tabIndex={-1}>
      <section className="hero-section content-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="section-kicker hero-reveal hero-reveal-1">
            {siteContent.identity.professionalTitle}
          </p>
          <h1 id="hero-title" className="hero-reveal hero-reveal-2">{identity.name}</h1>
          <p className="hero-statement hero-reveal hero-reveal-3">
            {siteContent.identity.headline}
          </p>
          <p className="hero-summary hero-reveal hero-reveal-4">
            {siteContent.identity.summary}
          </p>
          <p className="hero-availability hero-reveal hero-reveal-4">
            <span aria-hidden="true" /> {siteContent.identity.availability}
          </p>

          <div className="hero-actions hero-reveal hero-reveal-5">
            <a className="button button-primary" href={siteContent.links.resume}>
              <Download aria-hidden="true" /> View résumé
            </a>
            <a className="button button-secondary" href="#projects">
              Explore projects <ArrowDownRight aria-hidden="true" />
            </a>
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
            <div><dt>Experience</dt><dd>{siteContent.identity.experienceLabel}</dd></div>
            <div><dt>Target</dt><dd>Backend / Full-stack / AI</dd></div>
            <div><dt>Location</dt><dd>{identity.location}</dd></div>
          </dl>
        </div>

        <div className="hero-visual hero-reveal hero-reveal-canvas" aria-label="Abstract engineering signal visualization">
          <div className="hero-visual-frame" aria-hidden="true">
            <div className="hero-visual-topline">
              <span>Career trajectory</span>
              <span className="live-indicator">Active</span>
            </div>
            <div className="hero-fallback-network">
              <span /><span /><span /><span /><span /><span />
            </div>
            <div className="hero-visual-readout">
              <span>Foundation</span><strong>Backend systems</strong>
              <span>Direction</span><strong>AI engineering</strong>
              <span>Focus</span><strong>Practical systems</strong>
            </div>
          </div>
          <HeroCanvasLoader />
        </div>
      </section>

      <section className="focus-strip" aria-label="Target roles and engineering direction">
        <div className="content-shell focus-grid">
          {siteContent.focusAreas.map((area) => (
            <div className="focus-item" key={area.number}>
              <span>{area.number}</span>
              <div><h2>{area.title}</h2><p>{area.detail}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="direction-section content-shell" aria-labelledby="direction-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{siteContent.aiFocus.eyebrow}</p>
            <h2 id="direction-title">{siteContent.aiFocus.title}</h2>
          </div>
          <p>{siteContent.aiFocus.summary}</p>
        </div>

        <div className="direction-grid">
          <div>
            <p className="direction-label">Engineering foundation</p>
            <h3>{siteContent.identity.professionalTitle}</h3>
            <p>Reliable APIs, enterprise content platforms, integrations, testing, and production delivery.</p>
            <ul className="inline-skill-list" aria-label="Strongest technologies">
              {(strongestSkills.length
                ? strongestSkills.map((skill) => skill.name)
                : siteContent.strongestTechnologies
              ).map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
          <div>
            <p className="direction-label">AI engineering focus</p>
            <h3>{siteContent.aiFocus.status}</h3>
            <p>Current focus is learning and project development, grounded in existing backend and data experience.</p>
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
        <div className="section-heading">
          <div>
            <p className="section-kicker">{profileContent.experiencePreview.eyebrow}</p>
            <h2 id="profile-preview-title">{profileContent.experiencePreview.title}</h2>
          </div>
          <p>{profileContent.experiencePreview.summary}</p>
        </div>

        <div className="profile-preview-grid">
          <div className="profile-preview-intro">
            <p>{profileContent.experiencePreview.supportingCopy}</p>
            <ProfileLink label="Review full experience" />
          </div>

          {recentExperience ? (
            <article className="experience-preview">
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
        </div>
      </section>

      {(primaryEducation || certifications.length) ? (
        <section className="evidence-section content-shell" aria-labelledby="evidence-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Education &amp; credentials</p>
              <h2 id="evidence-title">Relevant academic and professional foundation.</h2>
            </div>
            <p>Concise evidence for application review. Full details remain available in the profile.</p>
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

      <section className="recruiter-resources content-shell" aria-labelledby="resources-title">
        <div>
          <p className="section-kicker">{profileContent.recruiterActions.eyebrow}</p>
          <h2 id="resources-title">{profileContent.recruiterActions.title}</h2>
          <p>{profileContent.recruiterActions.summary}</p>
        </div>
        <div className="resource-actions">
          <a className="button button-primary" href={siteContent.links.resume}>
            <Download aria-hidden="true" /> View résumé
          </a>
          <ProfileLink label="View full profile" />
          <a className="text-link" href={identity.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
