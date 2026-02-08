import { mapSkillLevelToPercent, formatDate, classNames } from "@/components/portfolio/profile/sections/utils";

describe("profile utils", () => {
    it("mapSkillLevelToPercent returns correct values", () => {
        expect(mapSkillLevelToPercent("Expert")).toBe(92);
        expect(mapSkillLevelToPercent("Beginner")).toBe(25);
        expect(mapSkillLevelToPercent("100")).toBe(100);
        expect(mapSkillLevelToPercent("Unknown")).toBe(65);
    });

    it("formatDate formats correctly", () => {
        const d = new Date("2020-01-01");
        expect(formatDate(d)).toMatch(/Jan 2020/);
        expect(formatDate(null)).toBe("Present");
    });

    it("classNames joins classes", () => {
        expect(classNames("a", "b", false && "c")).toBe("a b");
    });
});
