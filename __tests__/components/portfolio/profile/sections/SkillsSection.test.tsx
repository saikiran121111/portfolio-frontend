import React from "react";
import { render, screen } from "@testing-library/react";
import SkillsSection from "@/components/portfolio/profile/sections/SkillsSection";

describe("SkillsSection", () => {
    it("renders skills by category", () => {
        const skills: Array<[string, any[]]> = [["Frontend", [{ name: "React", level: "Expert" }]]];
        render(<SkillsSection skillsByCat={skills} />);
        expect(screen.getByText("Frontend")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
    });
});
