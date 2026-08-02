import type { Metadata } from "next";
import ProfileView from "@/components/portfolio/profile/ProfileView";
import ResumeViewButton from "@/components/portfolio/resume/ResumeViewButton";
import { siteContent } from "@/content/site";
import { fetchUserPortfolio } from "@/services/portfolio.service";

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await fetchUserPortfolio({ cache: "no-store" }).catch(() => null);
  const name = portfolio?.name || siteContent.identity.fullName;
  return {
    title: "Profile",
    description: `${name}'s engineering experience, projects, skills, education, and credentials.`,
  };
}

export default async function ProfilePage() {
  const portfolio = await fetchUserPortfolio({ cache: "no-store" }).catch(() => null);

  return (
    <main id="main-content" className="profile-main" tabIndex={-1}>
      {portfolio ? (
        <ProfileView data={portfolio} />
      ) : (
        <section className="profile-error content-shell">
          <p className="section-kicker">Profile unavailable</p>
          <h1>The profile data could not be loaded.</h1>
          <p>Please try again shortly or use the Resume for an offline review.</p>
          <ResumeViewButton />
        </section>
      )}
    </main>
  );
}
