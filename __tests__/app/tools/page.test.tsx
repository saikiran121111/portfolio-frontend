import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ToolsPage from "@/app/tools/page";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@/services/portfolio.service");
jest.mock("@/components/portfolio/logo/Logo", () => () => <div>Logo</div>);
jest.mock("@/components/portfolio/tool/SecurityScansViewClient", () => () => <div>SecurityScansViewClient</div>);
jest.mock("@/components/portfolio/tool/ToolsShowcase", () => () => <div>ToolsShowcase</div>);
jest.mock("@/components/portfolio/tool/TechStackShowcase", () => () => <div>TechStackShowcase</div>);

describe("Tools Page", () => {
    it("renders components with data", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue({
            scanReports: [],
            toolDocs: []
        });

        // ToolsPage is an async server component. 
        // Testing async server components directly in Jest/RTL environment is tricky 
        // as they return a promise of JSX.
        const ui = await ToolsPage();
        render(ui);

        expect(screen.getByText("Logo")).toBeInTheDocument();
        expect(screen.getByText("TechStackShowcase")).toBeInTheDocument();
        expect(screen.getByText("ToolsShowcase")).toBeInTheDocument();
        expect(screen.getByText("SecurityScansViewClient")).toBeInTheDocument();
    });
});
