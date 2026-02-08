import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SecurityScansView from "@/components/portfolio/tool/SecurityScansView";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@/services/portfolio.service");

// Mock child components
jest.mock("@/components/portfolio/tool/MainToolsShowcase", () => ({
    __esModule: true,
    default: () => <div>MainToolsShowcase</div>,
}));

jest.mock("@/components/portfolio/profile/sections/ReportsSection", () => ({
    __esModule: true,
    default: () => <div>ReportsSection</div>,
}));

describe("SecurityScansView", () => {
    it("renders initial reports", () => {
        const reports = [{ type: "test", runAt: new Date() }];
        render(<SecurityScansView initialReports={reports} />);
        expect(screen.getByText("ReportsSection")).toBeInTheDocument();
    });

    it("fetches reports if not provided", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue({ scanReports: [{ type: "fetched" }] });
        render(<SecurityScansView />);

        await waitFor(() => {
            expect(screen.getByText("ReportsSection")).toBeInTheDocument();
        });
    });

    it("handles fetch error", async () => {
        (fetchUserPortfolio as jest.Mock).mockRejectedValue(new Error("Fail"));
        render(<SecurityScansView />);

        await waitFor(() => {
            // Should still render main tools, but reports section should be missing
            expect(screen.getByText("MainToolsShowcase")).toBeInTheDocument();
            expect(screen.queryByText("ReportsSection")).not.toBeInTheDocument();
        });
    });
});
