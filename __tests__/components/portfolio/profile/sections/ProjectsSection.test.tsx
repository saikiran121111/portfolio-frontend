import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectsSection from "@/components/portfolio/profile/sections/ProjectsSection";

const mockProjects = [
    {
        title: "Proj A",
        description: "Desc",
        startDate: new Date(),
        endDate: new Date(),
        tech: ["Node"],
        liveUrl: "http://test.com"
    }
];

describe("ProjectsSection", () => {
    it("renders projects", () => {
        render(<ProjectsSection projects={mockProjects} />);
        expect(screen.getByText("Proj A")).toBeInTheDocument();
        expect(screen.getByText("Node")).toBeInTheDocument();
    });

    it("renders links", () => {
        render(<ProjectsSection projects={mockProjects} />);
        expect(screen.getByTitle("Live Demo")).toHaveAttribute("href", "http://test.com");
    });

    it("renders nothing if empty", () => {
        const { container } = render(<ProjectsSection projects={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
