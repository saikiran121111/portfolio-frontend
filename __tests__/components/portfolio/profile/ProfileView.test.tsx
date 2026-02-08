import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProfileView from "@/components/portfolio/profile/ProfileView";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@/services/portfolio.service");

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
} as any;

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe("ProfileView", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading state initially", () => {
        (fetchUserPortfolio as jest.Mock).mockReturnValue(new Promise(() => { }));
        const { container } = render(<ProfileView />);
        expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("renders error state when fetch fails", async () => {
        (fetchUserPortfolio as jest.Mock).mockRejectedValue(new Error("Network Error"));
        render(<ProfileView />);

        await waitFor(() => {
            expect(screen.getByText("Network Error")).toBeInTheDocument();
        });
    });

    it("renders error with default message for non-Error exceptions", async () => {
        (fetchUserPortfolio as jest.Mock).mockRejectedValue("Unknown error");
        render(<ProfileView />);

        await waitFor(() => {
            expect(screen.getByText("Failed to load profile")).toBeInTheDocument();
        });
    });

    it("renders profile content when loaded successfully", async () => {
        const mockData = {
            name: "Test User",
            email: "test@example.com",
            skills: [{ name: "React", category: "Frontend", level: "Expert" }],
            experiences: [],
            education: [],
        };
        (fetchUserPortfolio as jest.Mock).mockResolvedValue(mockData);
        render(<ProfileView />);

        await waitFor(() => {
            expect(screen.getByText("Test User")).toBeInTheDocument();
        });
    });

    it("renders with experiences section", async () => {
        const mockData = {
            name: "Test User",
            email: "test@example.com",
            skills: [],
            experiences: [
                {
                    title: "Developer",
                    company: "Tech Co",
                    location: "NYC",
                    startDate: new Date("2020-01-01"),
                    endDate: new Date("2023-01-01"),
                    description: "Built apps",
                    bullets: [],
                    techStack: [],
                },
            ],
            education: [],
        };
        (fetchUserPortfolio as jest.Mock).mockResolvedValue(mockData);
        render(<ProfileView />);

        await waitFor(() => {
            expect(screen.getByText("Developer")).toBeInTheDocument();
        });
    });

    it("returns null when data is null", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue(null);
        const { container } = render(<ProfileView />);

        await waitFor(() => {
            expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
        });
    });
});
