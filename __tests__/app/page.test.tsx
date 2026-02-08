import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock child components to avoid complex rendering
jest.mock("@/components/portfolio/PortfolioName", () => ({ PortfolioName: () => <div>PortfolioName</div> }));
jest.mock("@/components/portfolio/bottomHeadline/BottomHeadline", () => () => <div>BottomHeadline</div>);
jest.mock("@/components/portfolio/logo/Logo", () => () => <div>Logo</div>);
jest.mock("@/components/portfolio/intro/IntroLoader", () => () => <div>IntroLoader</div>);
jest.mock("@/components/portfolio/profile/ProfileLink", () => () => <div>ProfileLink</div>);
jest.mock("@/components/portfolio/tool/ToolsLink", () => () => <div>ToolsLink</div>);

describe("Home Page", () => {
    it("renders main components", () => {
        render(<Home />);
        expect(screen.getByText("IntroLoader")).toBeInTheDocument();
        expect(screen.getByText("PortfolioName")).toBeInTheDocument();
        expect(screen.getByText("Logo")).toBeInTheDocument();
        expect(screen.getByText("ToolsLink")).toBeInTheDocument();
        expect(screen.getByText("BottomHeadline")).toBeInTheDocument();
        expect(screen.getByText("ProfileLink")).toBeInTheDocument();
    });
});
