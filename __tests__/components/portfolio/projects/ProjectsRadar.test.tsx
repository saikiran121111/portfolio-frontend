import { fireEvent, render, screen } from "@testing-library/react";
import ProjectsRadar from "@/components/portfolio/projects/ProjectsRadar";
import type { IProjects } from "@/interfaces/user.interface";

const projects: IProjects[] = [
  { title: "First Project", description: "First purpose", projectUrl: null, repoUrl: null, liveUrl: "https://first.example.com", tech: ["NestJS"], highlights: ["Built an API"], startDate: new Date("2024-01-01"), endDate: new Date("2024-08-01") },
  { title: "Second Project", description: "Second purpose", projectUrl: null, repoUrl: "https://github.com/example/second", liveUrl: null, tech: ["NextJS"], highlights: ["Built an interface"], startDate: new Date("2025-01-01"), endDate: null },
];

describe("ProjectsRadar", () => {
  it("selects projects with pointer input", () => {
    render(<ProjectsRadar projects={projects} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByText("Second purpose").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /repository/i })[0]).toHaveAttribute("href", "https://github.com/example/second");
  });

  it("supports arrow-key project selection", () => {
    render(<ProjectsRadar projects={projects} />);
    const tabs = screen.getAllByRole("tab");
    fireEvent.keyDown(tabs[0], { key: "ArrowDown" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });
});
