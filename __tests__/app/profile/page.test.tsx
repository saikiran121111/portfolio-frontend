import React from "react";
import { render, screen } from "@testing-library/react";
import PortfolioPage from "@/app/profile/page";

jest.mock("@/components/portfolio/logo/Logo", () => () => <div>Logo</div>);
jest.mock("@/components/portfolio/profile/ProfileViewClient", () => () => <div>ProfileViewClient</div>);

describe("Portfolio Page", () => {
    it("renders components", () => {
        render(<PortfolioPage />);
        expect(screen.getByText("Logo")).toBeInTheDocument();
        expect(screen.getByText("ProfileViewClient")).toBeInTheDocument();
    });
});
