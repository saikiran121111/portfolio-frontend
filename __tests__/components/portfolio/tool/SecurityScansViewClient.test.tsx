import React from "react";
import { render } from "@testing-library/react";
import SecurityScansViewClient from "@/components/portfolio/tool/SecurityScansViewClient";

// Mock the dynamic import
jest.mock("next/dynamic", () => {
    return () => {
        const MockSecurityScansView = ({ initialReports }: any) => (
            <div data-testid="security-scans-mock">
                {initialReports ? `Reports: ${initialReports.length}` : "No reports"}
            </div>
        );
        return MockSecurityScansView;
    };
});

describe("SecurityScansViewClient", () => {
    it("renders SecurityScansView component without props", () => {
        const { getByTestId } = render(<SecurityScansViewClient />);
        expect(getByTestId("security-scans-mock")).toBeInTheDocument();
        expect(getByTestId("security-scans-mock")).toHaveTextContent("No reports");
    });

    it("passes initialReports prop to SecurityScansView", () => {
        const mockReports = [{ type: "Snyk", runAt: "2023-01-01" }] as any;
        const { getByTestId } = render(<SecurityScansViewClient initialReports={mockReports} />);
        expect(getByTestId("security-scans-mock")).toHaveTextContent("Reports: 1");
    });
});
