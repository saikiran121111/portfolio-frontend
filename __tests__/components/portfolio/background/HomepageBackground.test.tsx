import React from "react";
import { render } from "@testing-library/react";
import HomepageBackground from "@/components/portfolio/background/HomepageBackground";

// Mock next/image
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

describe("HomepageBackground", () => {
    it("renders simplified images", () => {
        const { container } = render(<HomepageBackground />);
        const images = container.querySelectorAll("img");
        expect(images.length).toBe(2); // Mobile and Desktop
    });

    it("applies passed className", () => {
        const { container } = render(<HomepageBackground className="test-class" />);
        expect(container.firstChild).toHaveClass("test-class");
    });
});
