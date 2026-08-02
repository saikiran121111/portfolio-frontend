import {
  aiFocusContent,
  engineeringFocusAreas,
  experienceLabel,
  groupRecruiterSkills,
  selectAiSkills,
  selectFeaturedProjects,
} from "@/content/selectors";
import type { IProjects, ISkill } from "@/interfaces/user.interface";

const skills: ISkill[] = [
  { name: "NestJS", category: "Backend", level: "Advanced" },
  { name: "NextJS", category: "FrontEnd", level: "Intermediate" },
  { name: "LangChain", category: "AI", level: "Intermediate" },
  { name: "Ollama", category: "AI", level: "Advanced" },
  { name: "Custom Tool", category: "Emerging", level: "Beginner" },
];

function project(title: string): IProjects {
  return {
    title,
    description: `${title} description`,
    repoUrl: null,
    liveUrl: null,
    tech: [],
    highlights: [],
    startDate: null,
    endDate: null,
  };
}

describe("portfolio data selectors", () => {
  it("derives AI content from every skill in the API AI category", () => {
    expect(selectAiSkills(skills).map((skill) => skill.name)).toEqual([
      "LangChain",
      "Ollama",
    ]);
    expect(aiFocusContent(skills).summary).toBe("LangChain and Ollama.");
  });

  it("derives focus details and retains new database categories", () => {
    expect(engineeringFocusAreas(skills).map((area) => area.detail)).toEqual([
      "NestJS",
      "NextJS",
      "LangChain, Ollama",
    ]);
    expect(groupRecruiterSkills(skills).map((group) => group.category)).toContain(
      "Emerging",
    );
  });

  it("uses the database homepage order before visible-project fallback", () => {
    const selected = selectFeaturedProjects(
      [project("One"), project("Two"), project("Three")],
      [{ title: "Two", url: "https://example.com/two", order: 0 }],
    );
    expect(selected.map((item) => item.title)).toEqual(["Two", "One", "Three"]);
  });

  it("keeps a homepage project selected when its database title changes", () => {
    const renamedProject = {
      ...project("Renamed portfolio"),
      liveUrl: "https://example.com/portfolio/",
    };

    const selected = selectFeaturedProjects(
      [project("One"), renamedProject, project("Three")],
      [{
        title: "Previous portfolio title",
        url: "https://example.com/portfolio",
        order: 0,
      }],
    );

    expect(selected.map((item) => item.title)).toEqual([
      "Renamed portfolio",
      "One",
      "Three",
    ]);
  });

  it("calculates experience from database date ranges", () => {
    expect(experienceLabel([
      {
        title: "Engineer",
        company: "Company",
        location: null,
        startDate: new Date("2021-01-01"),
        endDate: new Date("2025-06-01"),
        description: null,
        bullets: [],
        techStack: [],
      },
    ], new Date("2026-01-01"))).toBe("4+ years");
  });
});
