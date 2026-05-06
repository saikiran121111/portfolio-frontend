import {
  mapAdminPortfolioToEditor,
  mapEditorPortfolioToApi,
} from "@/lib/adminProfileTransforms";

describe("adminProfileTransforms", () => {
  it("maps backend payloads into editor-friendly values", () => {
    const editor = mapAdminPortfolioToEditor({
      user: {
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        avatarUrl: null,
        headline: null,
        summary: null,
        copyrights: null,
        location: null,
        phone: null,
        socials: {
          github: null,
          linkedin: "https://linkedin.com/in/admin",
          portfolio: null,
        },
      },
      repoData: {
        nestJSGitRepo: null,
        nestJSDeployedServer: null,
        nestJSSwaggerUrl: null,
        nextJSGitRepo: null,
        nextJSDeployedServer: null,
        postgresDeployedServer: null,
      },
      bottomHeadlines: [{ text: "Headline", order: 0 }],
      skills: [{ name: "TypeScript", category: "Backend", level: "Advanced", order: 0 }],
      experiences: [],
      projects: [],
      education: [],
      certifications: [],
      achievements: [],
      languages: [],
      scanReports: [
        {
          type: "coverage",
          commitSha: null,
          runAt: "2026-05-06T08:30:00.000Z",
          summary: { coverage: 98 },
          artifactUrl: null,
        },
      ],
    });

    expect(editor.user.avatarUrl).toBe("");
    expect(editor.user.socials.linkedin).toBe(
      "https://linkedin.com/in/admin",
    );
    expect(editor.scanReports[0].summaryText).toContain('"coverage": 98');
    expect(editor.scanReports[0].runAt).toContain("T");
  });

  it("maps editor payloads back into API payloads", () => {
    const payload = mapEditorPortfolioToApi({
      user: {
        name: "Admin",
        email: "admin@example.com",
        avatarUrl: "",
        headline: "",
        summary: "Summary",
        copyrights: "",
        location: "",
        phone: "",
        socials: {
          github: "",
          linkedin: "",
          portfolio: "",
        },
      },
      repoData: {
        nestJSGitRepo: "",
        nestJSDeployedServer: "",
        nestJSSwaggerUrl: "",
        nextJSGitRepo: "",
        nextJSDeployedServer: "",
        postgresDeployedServer: "",
      },
      bottomHeadlines: [{ text: "Headline", order: 0 }],
      skills: [{ name: "TypeScript", category: "Backend", level: "Advanced", order: 0 }],
      experiences: [
        {
          title: "Engineer",
          company: "Acme",
          location: "",
          startDate: "2026-01-01",
          endDate: "",
          description: "",
          bullets: ["Built things"],
          techStack: ["TypeScript"],
          order: 0,
        },
      ],
      projects: [],
      education: [],
      certifications: [],
      achievements: [],
      languages: [{ name: "English", level: "Fluent" }],
      scanReports: [
        {
          type: "coverage",
          commitSha: "",
          runAt: "2026-05-06T14:00",
          summaryText: '{ "coverage": 96 }',
          artifactUrl: "",
        },
      ],
    });

    expect(payload.user.avatarUrl).toBeNull();
    expect(payload.user.summary).toBe("Summary");
    expect(payload.scanReports[0].summary).toEqual({ coverage: 96 });
    expect(payload.scanReports[0].runAt).toMatch(/T/);
  });
});
