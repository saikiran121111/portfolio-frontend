import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@splinetool/react-spline/next", () => () => <div>SplineScene</div>, { virtual: true });
jest.mock("@/components/portfolio/bottomHeadline/BottomHeadline", () => () => <div>BottomHeadline</div>);
jest.mock("@/components/portfolio/logo/Logo", () => () => <div>Logo</div>);
jest.mock("@/components/portfolio/intro/IntroLoader", () => () => <div>IntroLoader</div>);
jest.mock("@/components/portfolio/profile/ProfileLink", () => () => <div>ProfileLink</div>);
jest.mock("@/components/portfolio/tool/ToolsLink", () => () => <div>ToolsLink</div>);
jest.mock("@/services/portfolio.service", () => ({
    fetchUserPortfolio: jest.fn(),
}));

describe("Home Page", () => {
    const mockedFetchUserPortfolio = fetchUserPortfolio as jest.MockedFunction<typeof fetchUserPortfolio>;

    beforeEach(() => {
        mockedFetchUserPortfolio.mockResolvedValue({
            name: "Sai Kiran",
            email: "sai@example.com",
            skills: [],
            experiences: [],
            education: [],
            bottomHeadline: ["Immersive experiences"],
        });
    });

    it("renders the spline hero with existing homepage content", async () => {
        render(await Home());

        expect(screen.getByText("IntroLoader")).toBeInTheDocument();
        expect(screen.getByText("SplineScene")).toBeInTheDocument();
        expect(screen.getByText("Portfolio")).toBeInTheDocument();
        expect(screen.getByText("Sai Kiran")).toBeInTheDocument();
        expect(screen.getByText("Logo")).toBeInTheDocument();
        expect(screen.getByText("ToolsLink")).toBeInTheDocument();
        expect(screen.getByText("BottomHeadline")).toBeInTheDocument();
        expect(screen.getByText("ProfileLink")).toBeInTheDocument();
    });
});
