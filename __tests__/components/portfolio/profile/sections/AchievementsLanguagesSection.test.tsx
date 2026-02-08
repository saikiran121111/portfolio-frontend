import React from "react";
import { render, screen } from "@testing-library/react";
import AchievementsLanguagesSection from "@/components/portfolio/profile/sections/AchievementsLanguagesSection";

describe("AchievementsLanguagesSection", () => {
    it("renders achievements with title", () => {
        const achievements = [{ title: "Won Award", date: new Date("2023-01-01"), link: null }];
        render(<AchievementsLanguagesSection achievements={achievements} languages={[]} />);
        expect(screen.getByText("Won Award")).toBeInTheDocument();
    });

    it("renders achievements with link", () => {
        const achievements = [{ title: "Award with Link", date: new Date(), link: "https://award.com" }];
        render(<AchievementsLanguagesSection achievements={achievements} languages={[]} />);
        expect(screen.getByText("Award with Link")).toBeInTheDocument();
        expect(screen.getByTitle("View Achievement")).toHaveAttribute("href", "https://award.com");
    });

    it("renders achievements without date", () => {
        const achievements = [{ title: "Timeless Award", date: null, link: null }];
        render(<AchievementsLanguagesSection achievements={achievements} languages={[]} />);
        expect(screen.getByText("Timeless Award")).toBeInTheDocument();
    });

    it("renders languages with Native proficiency", () => {
        const languages = [{ name: "English", level: "Native" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("English")).toBeInTheDocument();
        expect(screen.getByText("Native")).toBeInTheDocument();
    });

    it("renders languages with Fluent proficiency", () => {
        const languages = [{ name: "Spanish", level: "Fluent" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("Spanish")).toBeInTheDocument();
    });

    it("renders languages with Advanced proficiency", () => {
        const languages = [{ name: "French", level: "Advanced" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("French")).toBeInTheDocument();
    });

    it("renders languages with Proficient proficiency", () => {
        const languages = [{ name: "German", level: "Proficient" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("German")).toBeInTheDocument();
    });

    it("renders languages with Intermediate proficiency", () => {
        const languages = [{ name: "Italian", level: "Intermediate" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("Italian")).toBeInTheDocument();
    });

    it("renders languages with Basic proficiency", () => {
        const languages = [{ name: "Japanese", level: "Basic" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("Japanese")).toBeInTheDocument();
    });

    it("renders languages with Beginner proficiency", () => {
        const languages = [{ name: "Chinese", level: "Beginner" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("Chinese")).toBeInTheDocument();
    });

    it("renders languages with unknown proficiency", () => {
        const languages = [{ name: "Klingon", level: "Unknown" }];
        render(<AchievementsLanguagesSection achievements={[]} languages={languages} />);
        expect(screen.getByText("Klingon")).toBeInTheDocument();
    });

    it("renders both achievements and languages together", () => {
        const achievements = [{ title: "Best Award", date: new Date(), link: null }];
        const languages = [{ name: "English", level: "Native" }];
        render(<AchievementsLanguagesSection achievements={achievements} languages={languages} />);
        expect(screen.getByText("Best Award")).toBeInTheDocument();
        expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("renders nothing if both arrays are empty", () => {
        const { container } = render(<AchievementsLanguagesSection achievements={[]} languages={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
