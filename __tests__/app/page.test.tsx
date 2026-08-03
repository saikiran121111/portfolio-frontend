import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@/components/portfolio/profile/ProfileLink", () => ({ label = "View profile" }: { label?: string }) => <a href="/profile">{label}</a>);
jest.mock("@/components/portfolio/projects/ProjectsRadar", () => ({ projects }: { projects: unknown[] }) => <div>Projects: {projects.length}</div>);
jest.mock("@/services/portfolio.service", () => ({ fetchUserPortfolio: jest.fn() }));

describe("Home", () => {
  it("renders factual introduction, actions, and API-backed projects", async () => {
    (fetchUserPortfolio as jest.MockedFunction<typeof fetchUserPortfolio>).mockResolvedValue({
      name: "Phani Venkata Sai Kiran",
      email: "sai@example.com",
      headline: "Backend engineer expanding into AI engineering",
      summary: "API-provided professional summary.",
      location: "Hyderabad, India",
      skills: [
        { name: "NestJS", category: "Backend", level: "Advanced" },
        { name: "LangChain", category: "AI", level: "Intermediate" },
      ],
      experiences: [],
      education: [],
      projects: [{ title: "Portfolio Website", description: "Portfolio", repoUrl: null, liveUrl: "https://example.com", tech: [], highlights: [], startDate: null, endDate: null }],
    });

    render(await Home());
    expect(screen.getByRole("heading", { name: "Phani Venkata Sai Kiran" })).toBeInTheDocument();
    expect(screen.getByText("Backend engineer expanding into AI engineering")).toBeInTheDocument();
    expect(screen.getByText("API-provided professional summary.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore projects/i })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("button", { name: /view resume/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /profile/i })[0]).toHaveAttribute("href", "/profile");
    expect(screen.getByText("Projects: 1")).toBeInTheDocument();
    expect(screen.getByText("Engineering path")).toBeInTheDocument();
  });
});
