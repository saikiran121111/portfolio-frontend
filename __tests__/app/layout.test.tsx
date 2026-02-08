import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";

jest.mock("@/components/portfolio/background/HomepageBackground", () => () => <div>HomepageBackground</div>);
jest.mock("@/components/cursor/CustomCursor", () => () => <div>CustomCursor</div>);
jest.mock("@/components/portfolio/footer/Copyright", () => () => <div>Copyright</div>);
jest.mock("@/components/page-transition", () => ({
    PageTransitionProvider: ({ children }: any) => <div>{children}</div>,
    PageTransitionOverlay: () => <div>PageTransitionOverlay</div>,
}));

// Mock font functions to return objects with variable properties
jest.mock("next/font/google", () => ({
    Geist: () => ({ variable: "geist-sans" }),
    Geist_Mono: () => ({ variable: "geist-mono" }),
}));

describe("RootLayout", () => {
    it("renders children and global components", () => {
        const { container } = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );

        expect(screen.getByText("Test Child")).toBeInTheDocument();
        expect(screen.getByText("HomepageBackground")).toBeInTheDocument();
        expect(screen.getByText("CustomCursor")).toBeInTheDocument();
        expect(screen.getByText("PageTransitionOverlay")).toBeInTheDocument();
        expect(screen.getByText("Copyright")).toBeInTheDocument();

        // check html/body rendering if possible, but RTL renders into a container div usually
    });

    it("exports metadata", () => {
        expect(metadata).toHaveProperty("title");
        expect(metadata).toHaveProperty("description");
    });
});
