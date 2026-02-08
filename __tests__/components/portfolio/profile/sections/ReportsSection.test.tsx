import React from "react";
import { render, screen } from "@testing-library/react";
import ReportsSection from "@/components/portfolio/profile/sections/ReportsSection";

describe("ReportsSection", () => {
    it("renders reports", () => {
        const reports = [{ type: "Security", runAt: new Date(), summary: { bugs: 0 } }];
        render(<ReportsSection reports={reports} />);
        expect(screen.getByText("Security")).toBeInTheDocument();
        expect(screen.getByText(/Bugs:/)).toBeInTheDocument();
    });

    it("renders nothing if empty", () => {
        const { container } = render(<ReportsSection reports={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
