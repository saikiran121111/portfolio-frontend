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
      location: "Hyderabad, India",
      skills: [],
      experiences: [],
      education: [],
      projects: [{ title: "Portfolio Website", description: "Portfolio", repoUrl: null, liveUrl: "https://example.com", tech: [], highlights: [], startDate: null, endDate: null }],
    });

    render(await Home());
    expect(screen.getByRole("heading", { name: "Phani Venkata Sai Kiran" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore projects/i })).toHaveAttribute("href", "#projects");
    expect(screen.getAllByRole("link", { name: /view resume/i })[0]).toHaveAttribute("href", "/api/download-resume");
    expect(screen.getAllByRole("link", { name: /profile/i })[0]).toHaveAttribute("href", "/profile");
    expect(screen.getByText("Projects: 1")).toBeInTheDocument();
    expect(screen.getByText("Engineering path")).toBeInTheDocument();
  });
});
