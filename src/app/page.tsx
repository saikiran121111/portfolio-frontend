import Spline from "@splinetool/react-spline/next";
import BottomHeadline from "@/components/portfolio/bottomHeadline/BottomHeadline";
import Logo from "@/components/portfolio/logo/Logo";
import IntroLoader from "@/components/portfolio/intro/IntroLoader";
import ProfileLink from "@/components/portfolio/profile/ProfileLink";
import ProjectsRadar, {
  type ProjectsRadarItem,
} from "@/components/portfolio/projects/ProjectsRadar";
import ToolsLink from "@/components/portfolio/tool/ToolsLink";
import { fetchUserPortfolio } from "@/services/portfolio.service";

const HOME_SCENE =
  "https://prod.spline.design/EpgWOnq1XVRNVaXu/scene.splinecode";

function splitNameForHero(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 2) return [name];
  if (parts.length === 3) return [parts[0], parts.slice(1).join(" ")];
  if (parts.length === 4) return [parts[0], parts[1], parts.slice(2).join(" ")];

  const midpoint = Math.ceil(parts.length / 2);
  return [parts.slice(0, midpoint).join(" "), parts.slice(midpoint).join(" ")];
}

function normalizeHeroSubtitle(text: string) {
  const normalized = text
    .replace(/\bPipllines\b/gi, "Pipelines")
    .replace(/\bPiplines\b/gi, "Pipelines")
    .replace(/\benviroments\b/gi, "environments")
    .replace(/\benviornments\b/gi, "environments")
    .replace(/\broll backs\b/gi, "rollbacks");

  return normalized.replace(
    /Ship confidently\s*[\u00b7-]\s*Pipelines,\s*environments,\s*rollbacks/i,
    "Ship confidently \u00b7 Pipelines, environments, rollbacks",
  );
}

function getProjectUrl(project: {
  projectUrl?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
}) {
  return project.projectUrl || project.liveUrl || project.repoUrl || "";
}

export default async function Home() {
  const portfolio = await fetchUserPortfolio({ cache: "no-store" }).catch(
    () => null,
  );

  const name = portfolio?.name ?? "Sai Kiran";
  const bottomHeadline =
    portfolio?.bottomHeadline
      ?.filter((item): item is string => Boolean(item && item.trim()))
      .map(normalizeHeroSubtitle) ?? [];
  const nameLines = splitNameForHero(name);
  const projects: ProjectsRadarItem[] =
    portfolio?.projects
      ?.filter((project) => project.isVisible !== false)
      .map((project) => ({
        title: project.title,
        url: getProjectUrl(project),
        type: project.type,
      }))
      .filter((project) => project.title.trim() && project.url.trim()) ?? [];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#020608] text-white">
      <IntroLoader />

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          aria-hidden
          className="hero-aurora absolute -left-[20%] top-[12%] h-[22rem] w-[22rem] sm:-left-[10%] sm:h-[28rem] sm:w-[28rem] lg:left-[3%] lg:top-[16%] lg:h-[32rem] lg:w-[32rem]"
        />
        <div
          aria-hidden
          className="hero-aurora hero-aurora-secondary absolute left-[40%] top-[8%] h-[18rem] w-[18rem] sm:left-[48%] sm:h-[22rem] sm:w-[22rem] lg:left-[46%] lg:top-[18%] lg:h-[24rem] lg:w-[24rem]"
        />
        <div className="home-spline-shell absolute inset-0">
          <div className="home-spline-stage">
            <Spline
              scene={HOME_SCENE}
              className="home-spline h-full w-full"
            />
          </div>
        </div>
        <div
          aria-hidden
          className="hero-bottom-sheen absolute inset-x-[-14%] bottom-[4%] h-40 sm:h-44 lg:bottom-[8%] lg:h-52"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(1,3,4,0.78)_0%,rgba(1,3,4,0.5)_24%,rgba(1,3,4,0.86)_100%)] lg:bg-[linear-gradient(90deg,rgba(1,3,4,0.96)_0%,rgba(1,3,4,0.92)_26%,rgba(1,3,4,0.62)_47%,rgba(1,3,4,0.18)_70%,rgba(1,3,4,0.92)_100%)]" />
        <div className="home-grid pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/90 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 to-transparent" />
      </div>

      <ProjectsRadar projects={portfolio?.homepageProjects || []} />

      <section className="home-hero-section pointer-events-none relative z-10 flex min-h-dvh w-full items-start px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 md:items-center md:px-10 md:pt-24 lg:px-[7vw] lg:pb-20 lg:pt-20 xl:px-[7.5vw]">
        <div className="hero-copy-stack relative w-full max-w-[18rem] sm:max-w-[24rem] md:max-w-[32rem] lg:max-w-[46rem]">
          <div className="hero-copy-glow absolute -inset-x-8 -inset-y-10 sm:-inset-x-10 sm:-inset-y-12" />
          <div className="intro-gate relative">
            <h1 className="hero-name text-[3.05rem] font-[320] leading-[0.92] tracking-normal text-white sm:text-[4.1rem] md:text-[4.8rem] lg:text-[5.45rem] xl:text-[5.95rem] 2xl:text-[6.35rem]">
              {nameLines.map((line) => (
                <span
                  key={line}
                  className="hero-name-line block"
                >
                  {line}
                </span>
              ))}
              <span className="hero-portfolio mt-1 block">
                Portfolio
              </span>
            </h1>

            {bottomHeadline.length > 0 ? (
              <div className="hero-headline-wrap mt-5 max-w-[16rem] sm:mt-7 sm:max-w-[22rem] md:max-w-[26rem] lg:mt-8 lg:max-w-[32rem]">
                <BottomHeadline
                  items={bottomHeadline}
                  v="top"
                  h="left"
                  xsOffsetX={-6}
                  xsOffsetY={0}
                  offsetX={-8}
                  offsetY={0}
                  tabletOffsetX={-10}
                  tabletOffsetY={0}
                  desktopOffsetX={-16}
                  desktopOffsetY={0}
                  xlOffsetX={-16}
                  xlOffsetY={0}
                  showCursor={false}
                  className="hero-rotating-copy !text-left text-[0.92rem] leading-6 text-white/80 sm:text-base sm:leading-7 md:text-[1.02rem] lg:text-lg lg:leading-8"
                />
              </div>
            ) : null}

            <div className="hero-divider mt-7 h-px w-24 sm:mt-9 sm:w-28 lg:mt-10 lg:w-36" />
          </div>
        </div>
      </section>

      <div className="fixed inset-0 z-20 pointer-events-none">
        <Logo
          className="text-white hover:text-cyan-300"
          size={44}
          xsOffsetX={-2}
          xsOffsetY={26}
          offsetX={-2}
          offsetY={34}
          tabletOffsetX={-4}
          tabletOffsetY={34}
          desktopOffsetX={-6}
          desktopOffsetY={38}
          xlOffsetY={38}
          v="top"
          h="left"
          minLeftPx={30}
          xlMinLeftPx={100}
          desktopMinLeftPx={100}
          tabletMinLeftPx={30}
          xsMinLeftPx={8}
        />
      </div>

      <div className="fixed inset-0 z-20 pointer-events-none">
        <ToolsLink
          xsOffsetX={-10}
          xsOffsetY={18}
          offsetX={-12}
          offsetY={22}
          tabletOffsetX={-18}
          tabletOffsetY={24}
          desktopOffsetX={-28}
          desktopOffsetY={36}
          xlOffsetX={-40}
          xlOffsetY={36}
          v="top"
          h="right"
          introGate
          scale={0.72}
          iconSizePx={30}
        />
      </div>

      <div className="fixed inset-0 z-20 pointer-events-none">
        <ProfileLink
          xsOffsetX={-10}
          xsOffsetY={-10}
          offsetX={-12}
          offsetY={-12}
          tabletOffsetX={-18}
          tabletOffsetY={-18}
          desktopOffsetX={-28}
          desktopOffsetY={-32}
          xlOffsetX={-40}
          xlOffsetY={-36}
          v="bottom"
          h="right"
          introGate
          scale={0.72}
        />
      </div>
    </main>
  );
}
