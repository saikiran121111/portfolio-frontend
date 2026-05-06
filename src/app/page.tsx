import Spline from "@splinetool/react-spline/next";
import BottomHeadline from "@/components/portfolio/bottomHeadline/BottomHeadline";
import Logo from "@/components/portfolio/logo/Logo";
import IntroLoader from "@/components/portfolio/intro/IntroLoader";
import ProfileLink from "@/components/portfolio/profile/ProfileLink";
import ToolsLink from "@/components/portfolio/tool/ToolsLink";
import { fetchUserPortfolio } from "@/services/portfolio.service";

const HOME_SCENE =
  "https://prod.spline.design/EpgWOnq1XVRNVaXu/scene.splinecode";

function splitNameForHero(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 2) return [name];
  if (parts.length === 3) return [parts.slice(0, 2).join(" "), parts[2]];

  const midpoint = Math.ceil(parts.length / 2);
  return [parts.slice(0, midpoint).join(" "), parts.slice(midpoint).join(" ")];
}

export default async function Home() {
  const portfolio = await fetchUserPortfolio({ cache: "no-store" }).catch(
    () => null,
  );

  const name = portfolio?.name ?? "Sai Kiran";
  const bottomHeadline =
    portfolio?.bottomHeadline?.filter(
      (item): item is string => Boolean(item && item.trim()),
    ) ?? [];
  const nameLines = splitNameForHero(name);

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
        <div
          data-cursor-expand
          className="home-spline-shell absolute -right-[38%] top-[8%] h-[54vh] w-[128vw] sm:-right-[24%] sm:top-[10%] sm:h-[58vh] sm:w-[104vw] md:-right-[10%] md:top-[8%] md:h-[66vh] md:w-[78vw] lg:left-[47%] lg:right-auto lg:top-[5%] lg:h-[88vh] lg:w-[46vw] xl:left-[49%] xl:top-[4%] xl:h-[90vh] xl:w-[43vw] 2xl:left-[50%] 2xl:w-[40vw]"
        >
          <Spline
            scene={HOME_SCENE}
            className="home-spline h-full w-full"
          />
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

      <section className="pointer-events-none relative z-10 mx-auto flex min-h-dvh w-full max-w-[94rem] items-center px-5 pb-24 pt-24 sm:px-8 sm:pt-28 lg:px-8 lg:pb-20 lg:pt-20 xl:px-10">
        <div className="hero-copy-stack relative max-w-[35rem] sm:max-w-[38rem] lg:ml-7 lg:max-w-[42rem] xl:ml-10">
          <div className="hero-copy-glow absolute -inset-x-8 -inset-y-10 sm:-inset-x-10 sm:-inset-y-12" />
          <div className="intro-gate relative">
            <h1 className="hero-name max-w-[9.1ch] text-[3rem] font-[350] leading-[0.87] tracking-[-0.085em] text-white sm:text-[4.3rem] lg:text-[6.05rem] xl:text-[6.55rem]">
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
              <div className="mt-6 max-w-[32rem] sm:mt-8">
                <BottomHeadline
                  items={bottomHeadline}
                  v="top"
                  h="left"
                  xsOffsetX={-16}
                  xsOffsetY={0}
                  offsetX={-16}
                  offsetY={0}
                  tabletOffsetX={-16}
                  tabletOffsetY={0}
                  desktopOffsetX={-16}
                  desktopOffsetY={0}
                  xlOffsetX={-16}
                  xlOffsetY={0}
                  showCursor={false}
                  className="hero-rotating-copy !text-left text-[0.96rem] leading-7 text-white/68 sm:text-lg sm:leading-8"
                />
              </div>
            ) : null}

            <div className="hero-divider mt-8 h-px w-36 sm:mt-10" />
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
          xsOffsetX={-12}
          xsOffsetY={24}
          offsetX={-16}
          offsetY={32}
          tabletOffsetX={-24}
          tabletOffsetY={32}
          desktopOffsetX={-28}
          desktopOffsetY={36}
          xlOffsetX={-40}
          xlOffsetY={36}
          v="top"
          h="right"
          introGate
          scale={0.76}
          iconSizePx={45}
        />
      </div>

      <div className="fixed inset-0 z-20 pointer-events-none">
        <ProfileLink
          xsOffsetX={-12}
          xsOffsetY={-14}
          offsetX={-16}
          offsetY={-20}
          tabletOffsetX={-24}
          tabletOffsetY={-24}
          desktopOffsetX={-28}
          desktopOffsetY={-32}
          xlOffsetX={-40}
          xlOffsetY={-36}
          v="bottom"
          h="right"
          introGate
          scale={0.76}
        />
      </div>
    </main>
  );
}
