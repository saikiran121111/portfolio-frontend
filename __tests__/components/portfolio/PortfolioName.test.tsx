import React from "react";
import { render, screen } from "@testing-library/react";
import { PortfolioName } from "@/components/portfolio/PortfolioName";
import { fetchUserPortfolio } from "@/services/portfolio.service";

// Mock the service
jest.mock("@/services/portfolio.service");

describe("PortfolioName", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders portfolio name from API", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue({
            name: "Test Name",
            headline: "Test Headline",
        });

        const Component = await PortfolioName({});
        render(Component);

        expect(screen.getByText("Test Name")).toBeInTheDocument();
        expect(screen.getByText("Test Headline")).toBeInTheDocument();
    });

    it("renders default name on error", async () => {
        (fetchUserPortfolio as jest.Mock).mockRejectedValue(new Error("Failed"));

        const Component = await PortfolioName({});
        render(Component);

        expect(screen.getByText("Portfolio")).toBeInTheDocument();
    });

    it("renders provided portfolioText override", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue({
            name: "Test Name",
        });

        const Component = await PortfolioName({ portfolioText: "Custom Text" });
        render(Component);

        expect(screen.getByText("Custom Text")).toBeInTheDocument();
    });
});
