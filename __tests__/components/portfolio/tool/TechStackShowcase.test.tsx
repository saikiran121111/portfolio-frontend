import React from "react";
import { render, screen } from "@testing-library/react";
import TechStackShowcase from "@/components/portfolio/tool/TechStackShowcase";

const mockPortfolio: any = {
    nestJSGitRepo: "http://nest.repo",
    nextJSGitRepo: "http://next.repo",
    postgresDeployedServer: "http://pg.com",
    nestJSDeployedServer: "http://nest.deploy",
    nextJSDeployedServer: "http://next.deploy",
    nestJSSwaggerUrl: "http://swagger.com",
};

describe("TechStackShowcase", () => {
    it("renders stack items", () => {
        render(<TechStackShowcase portfolio={mockPortfolio} />);
        expect(screen.getByText("Backend API")).toBeInTheDocument();
        expect(screen.getByText("Frontend App")).toBeInTheDocument();
        expect(screen.getByText("Database")).toBeInTheDocument();
    });

    it("renders links", () => {
        render(<TechStackShowcase portfolio={mockPortfolio} />);
        expect(screen.getAllByText("View Source Code").length).toBeGreaterThan(0);
    });

    it("renders nothing if no urls", () => {
        const { container } = render(<TechStackShowcase portfolio={{}} />);
        expect(container.firstChild).toBeNull();
    });
});
