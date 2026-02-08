import React from "react";
import { render, screen } from "@testing-library/react";
import ExperienceSection from "@/components/portfolio/profile/sections/ExperienceSection";

const mockExperiences = [
    {
        title: "Dev",
        company: "Co",
        startDate: new Date("2020-01-01"),
        endDate: new Date("2021-01-01"),
        description: "Desc",
        techStack: ["React"],
    }
];

describe("ExperienceSection", () => {
    it("renders experiences", () => {
        render(<ExperienceSection experiences={mockExperiences} />);
        expect(screen.getByText("Dev")).toBeInTheDocument();
        expect(screen.getByText("Co")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("renders nothing if empty", () => {
        const { container } = render(<ExperienceSection experiences={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
