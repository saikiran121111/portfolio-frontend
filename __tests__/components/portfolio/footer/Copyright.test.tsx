import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Copyright from "@/components/portfolio/footer/Copyright";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@/services/portfolio.service");

describe("Copyright", () => {
    it("renders copyright text from API", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue({
            copyrights: "My Company",
        });

        render(<Copyright />);

        await waitFor(() => {
            expect(screen.getByText(/My Company/)).toBeInTheDocument();
        });

        const year = new Date().getFullYear();
        expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
    });

    it("renders nothing if api fails (or returns empty)", async () => {
        (fetchUserPortfolio as jest.Mock).mockRejectedValue(new Error("Fail"));
        const { container } = render(<Copyright />);
        await waitFor(() => { });
        expect(container.firstChild).toBeEmptyDOMElement();
    });
});
