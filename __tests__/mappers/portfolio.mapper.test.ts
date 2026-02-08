import { mapPortfolio } from "@/mappers/portfolio.mapper";
import { PortfolioDto } from "@/dto/portfolio.dto";

describe("mapPortfolio", () => {
    const mockDto: PortfolioDto = {
        name: "John Doe",
        email: "john@example.com",
        headline: "Developer",
        summary: "Summary",
        location: "NY",
        phone: "123",
        socials: { github: "git", linkedin: "in" },
        nestJSGitRepo: "repo",
        nestJSDeployedServer: "server",
        nestJSSwaggerUrl: "swagger",
        nextJSGitRepo: "nextrepo",
        nextJSDeployedServer: "nextserver",
        postgresDeployedServer: "pgserver",
        skills: [{ name: "React", category: "Frontend", level: "Advanced" }],
        experiences: [
            {
                title: "Dev",
                company: "Tech Co",
                location: "NYC",
                startDate: "2020-01-01",
                endDate: "2021-01-01",
                description: "Worked on projects",
                bullets: ["Built features"],
                techStack: ["React", "Node"],
            },
        ],
        projects: [
            {
                title: "Project A",
                startDate: "2020-01-01",
                endDate: "2021-01-01",
                description: "Cool project",
                repoUrl: "https://github.com/repo",
                liveUrl: null,
                tech: ["React"],
                highlights: ["Fast"],
            },
        ],
        education: [
            {
                institution: "Uni",
                degree: "BS",
                field: "CS",
                startDate: "2016-01-01",
                endDate: "2020-01-01",
            },
        ],
        certifications: [
            {
                title: "Cert A",
                issuer: "Issuer",
                date: "2022-01-01",
                link: "https://cert.com",
            },
        ],
        achievements: [
            {
                title: "Award",
                date: "2023-01-01",
                link: "https://award.com",
            },
        ],
        languages: [{ name: "English", level: "Native" }],
        scanReports: [
            {
                type: "Snyk",
                runAt: "2023-01-01",
                commitSha: "abc123",
                artifactUrl: null,
                summary: { bugs: 0, vulnerabilities: 0 },
            },
        ],
        bottomHeadline: ["Line 1"],
        copyrights: "Copy",
        toolDocs: [
            { key: "tool-a", title: "Tool A", icon: "a.png", content: "Content A", order: 2 },
            { key: "tool-b", title: "Tool B", icon: "b.png", content: "Content B", order: 1 },
        ],
    };

    it("maps basic fields correctly", () => {
        const result = mapPortfolio(mockDto);
        expect(result.name).toBe(mockDto.name);
        expect(result.email).toBe(mockDto.email);
        expect(result.socials).toEqual(mockDto.socials);
    });

    it("transforms dates correctly in experiences", () => {
        const result = mapPortfolio(mockDto);
        expect(result.experiences[0].startDate).toBeInstanceOf(Date);
        expect(result.experiences[0].endDate).toBeInstanceOf(Date);
        expect(result.experiences[0].startDate.getFullYear()).toBe(2020);
    });

    it("handles null end dates", () => {
        const dtoWithNullEnds = {
            ...mockDto,
            experiences: [{ ...mockDto.experiences[0], endDate: undefined }],
        } as any; // Type casting for test flexibility

        const result = mapPortfolio(dtoWithNullEnds);
        expect(result.experiences[0].endDate).toBeNull();
    });

    it("sorts toolDocs by order", () => {
        const result = mapPortfolio(mockDto);
        expect(result.toolDocs?.[0].title).toBe("Tool B"); // Order 1
        expect(result.toolDocs?.[1].title).toBe("Tool A"); // Order 2
    });

    it("handles optional arrays being undefined", () => {
        const minimalDto: PortfolioDto = {
            name: "John",
            email: "john@example.com",
            skills: [],
            experiences: [],
            education: [],
            // Missing optional arrays
        };
        const result = mapPortfolio(minimalDto);
        expect(result.projects).toBeUndefined();
        expect(result.certifications).toBeUndefined();
    });
});
