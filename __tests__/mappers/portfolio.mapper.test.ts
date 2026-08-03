import { mapPortfolio } from "@/mappers/portfolio.mapper";
import { PortfolioDto } from "@/dto/portfolio.dto";

describe("mapPortfolio", () => {
    const mockDto: PortfolioDto = {
        name: "John Doe",
        email: "john@example.com",
        headline: "Developer",
        summary: "Summary",
        location: "NY",
        socials: {
            github: "https://github.com/john",
            linkedin: "https://linkedin.com/in/john",
        },
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
            },
        ],
        languages: [{ name: "English", level: "Native" }],
        bottomHeadline: ["Line 1"],
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

    it("drops internal and unknown API fields before rendering", () => {
        const dtoWithInternalFields = {
            ...mockDto,
            phone: "private-phone",
            nestJSGitRepo: "private-repository",
            nestJSDeployedServer: "private-backend",
            nestJSSwaggerUrl: "private-swagger",
            nextJSGitRepo: "private-frontend-repository",
            nextJSDeployedServer: "private-frontend-host",
            postgresDeployedServer: "private-database-host",
            copyrights: "private-copyright",
            scanReports: [{ commitSha: "private-sha" }],
            toolDocs: [{ url: "private-tool-url" }],
            skills: [{ ...mockDto.skills[0], internalId: 42 }],
            achievements: [{
                ...mockDto.achievements![0],
                link: "https://private.example/award",
            }],
        } as unknown as PortfolioDto;

        const result = mapPortfolio(dtoWithInternalFields);

        for (const field of [
            "phone",
            "nestJSGitRepo",
            "nestJSDeployedServer",
            "nestJSSwaggerUrl",
            "nextJSGitRepo",
            "nextJSDeployedServer",
            "postgresDeployedServer",
            "copyrights",
            "scanReports",
            "toolDocs",
        ]) {
            expect(result).not.toHaveProperty(field);
        }
        expect(result.skills[0]).toEqual({
            name: "React",
            category: "Frontend",
            level: "Advanced",
        });
        expect(result.achievements?.[0]).toEqual({
            title: "Award",
            date: new Date("2023-01-01"),
        });
    });

    it("drops public URLs that contain embedded credentials", () => {
        const result = mapPortfolio({
            ...mockDto,
            socials: {
                ...mockDto.socials,
                github: "https://token:secret@github.com/john",
            },
            projects: [{
                ...mockDto.projects![0],
                repoUrl: "https://token:secret@github.com/repo",
            }],
            certifications: [{
                ...mockDto.certifications![0],
                link: "https://token:secret@cert.example/result",
            }],
        });

        expect(result.socials?.github).toBeUndefined();
        expect(result.projects?.[0].repoUrl).toBeNull();
        expect(result.certifications?.[0].link).toBeNull();
    });
});
