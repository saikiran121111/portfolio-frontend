import { render, screen, within } from "@testing-library/react";
import ProfileView from "@/components/portfolio/profile/ProfileView";
import type { IPortfolio } from "@/interfaces/portfolio.interface";

const data: IPortfolio = {
  name: "Sai Kiran",
  email: "sai@example.com",
  location: "Hyderabad, India",
  socials: { github: "https://github.com/sai", linkedin: "https://linkedin.com/in/sai" },
  skills: [{ name: "NestJS", category: "Backend", level: "Advanced" }],
  experiences: [{
    title: "SWE - Analyst",
    company: "Accenture",
    location: "Hyderabad, India",
    startDate: new Date("2023-08-31"),
    endDate: new Date("2025-11-10"),
    description: "Backend development",
    bullets: ["Built documented backend services"],
    techStack: ["NestJS", "PostgreSQL"],
  }],
  projects: [{ title: "Portfolio Website", description: "Personal portfolio", repoUrl: "https://github.com/sai/portfolio", liveUrl: null, tech: ["NextJS"], highlights: [], startDate: null, endDate: null }],
  education: [{ institution: "University", degree: "Bachelor of Technology", field: "Engineering", startDate: new Date("2017-01-01"), endDate: new Date("2021-01-01") }],
  certifications: [{ title: "Certification", issuer: "Issuer", date: new Date("2024-01-01"), link: null }],
  achievements: [{ title: "Achievement", date: null, link: null }],
  languages: [{ name: "English", level: "Fluent" }],
};

describe("ProfileView", () => {
  it("renders the professional chronology and direct actions", () => {
    render(<ProfileView data={data} />);
    expect(screen.getByRole("heading", { name: "Sai Kiran" })).toBeInTheDocument();
    expect(screen.getByText("Software Engineer / Analyst")).toBeInTheDocument();
    expect(
      within(
        screen.getByRole("list", { name: "Technologies used at Accenture" }),
      ).getByText("NestJS"),
    ).toBeInTheDocument();
    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download resume/i })).toHaveAttribute("href", "/api/download-resume");
  });
});
