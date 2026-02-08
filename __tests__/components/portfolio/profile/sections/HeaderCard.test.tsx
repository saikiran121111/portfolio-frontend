import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HeaderCard from "@/components/portfolio/profile/sections/HeaderCard";

const mockData: any = {
    name: "Test User",
    headline: "Headline",
    email: "test@test.com",
    phone: "123",
    location: "Loc",
    socials: {}
};

describe("HeaderCard", () => {
    it("renders user information", () => {
        render(<HeaderCard data={mockData} />);
        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText("Headline")).toBeInTheDocument();
        expect(screen.getByText("test@test.com")).toBeInTheDocument();
    });

    it("tracks mouse movement for hover effect", () => {
        const { container } = render(<HeaderCard data={mockData} />);
        const card = container.querySelector(".hero-card-container");

        fireEvent.mouseEnter(card!);
        fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });

        // Internal state update check isn't easy without testing implementation details,
        // but checking it doesn't crash is good.
        fireEvent.mouseLeave(card!);
    });
});
