import type { IAdminPortfolioEditor } from "@/interfaces/admin.interface";
import { validateAdminProfileUpdate } from "@/lib/adminProfileValidation";

function currentProfile(): IAdminPortfolioEditor {
  return {
    user: {
      id: 1,
      name: "Sai Kiran",
      email: "sai@example.com",
      avatarUrl: "",
      headline: "Backend Engineer",
      summary: "Profile summary",
      copyrights: "",
      location: "Hyderabad, India",
      phone: "",
      socials: { github: "https://github.com/sai", linkedin: "", portfolio: "" },
    },
    repoData: {
      nestJSGitRepo: "",
      nestJSDeployedServer: "",
      nestJSSwaggerUrl: "",
      nextJSGitRepo: "",
      nextJSDeployedServer: "",
      postgresDeployedServer: "",
    },
    bottomHeadlines: [],
    homepageProjects: [],
    skills: [{ name: "NestJS", category: "Backend", level: "Advanced", order: 0 }],
    experiences: [],
    projects: [{
      title: "Portfolio",
      description: "Personal portfolio",
      projectUrl: "",
      repoUrl: "https://github.com/sai/portfolio",
      liveUrl: "",
      type: "Independent project",
      isVisible: true,
      tech: ["NextJS"],
      highlights: [],
      startDate: "2025-01-01",
      endDate: "",
      order: 0,
    }],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    scanReports: [],
  };
}

describe("validateAdminProfileUpdate", () => {
  it("sanitizes submitted text and preserves omitted fields", () => {
    const result = validateAdminProfileUpdate(
      { user: { headline: "  Backend\u0000 and AI Engineer  " } },
      currentProfile(),
    );

    expect(result.success).toBe(true);
    expect(result.data?.user.headline).toBe("Backend and AI Engineer");
    expect(result.data?.projects).toHaveLength(1);
    expect(result.data?.user.email).toBe("sai@example.com");
  });

  it("rejects unsupported fields and unsafe URL protocols", () => {
    const result = validateAdminProfileUpdate(
      {
        user: {
          admin: true,
          socials: { github: "javascript:alert(1)" },
        },
      },
      currentProfile(),
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors["user.admin"]).toBe("Unsupported field");
    expect(result.fieldErrors["user.socials.github"]).toMatch(/HTTP or HTTPS/);
  });

  it("returns field-specific errors for invalid structured values", () => {
    const result = validateAdminProfileUpdate(
      { user: { email: "not-an-email" }, projects: "invalid" },
      currentProfile(),
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors["user.email"]).toBe("Must be a valid email address");
    expect(result.fieldErrors.projects).toBe("Must be an array");
  });
});
