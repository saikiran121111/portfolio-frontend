import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ToolsLink from "@/components/portfolio/tool/ToolsLink";
import { usePageTransition } from "@/components/page-transition";
import { usePathname } from "next/navigation";
import { setAllowedRoute } from "@/components/guards/RouteGuard";

jest.mock("@/components/page-transition", () => ({
    usePageTransition: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

jest.mock("@/components/guards/RouteGuard", () => ({
    setAllowedRoute: jest.fn(),
}));

describe("ToolsLink", () => {
    const mockTrigger = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (usePageTransition as jest.Mock).mockReturnValue({
            triggerTransition: mockTrigger,
            state: "idle",
        });
    });

    it("triggers transition on click on homepage", () => {
        (usePathname as jest.Mock).mockReturnValue("/");
        render(<ToolsLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).toHaveBeenCalledWith("/tools", expect.any(Object));
    });

    it("calls setAllowedRoute before transition on homepage click", () => {
        (usePathname as jest.Mock).mockReturnValue("/");
        render(<ToolsLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(setAllowedRoute).toHaveBeenCalledWith("/tools");
        expect(mockTrigger).toHaveBeenCalled();
    });

    it("does not trigger transition on other pages", () => {
        (usePathname as jest.Mock).mockReturnValue("/about");
        render(<ToolsLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).not.toHaveBeenCalled();
    });

    it("does not call setAllowedRoute when not on homepage", () => {
        (usePathname as jest.Mock).mockReturnValue("/about");
        render(<ToolsLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(setAllowedRoute).not.toHaveBeenCalled();
    });

    it("does not trigger transition when already transitioning", () => {
        (usePathname as jest.Mock).mockReturnValue("/");
        (usePageTransition as jest.Mock).mockReturnValue({
            triggerTransition: mockTrigger,
            state: "navigating", // Not idle
        });
        render(<ToolsLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).not.toHaveBeenCalled();
        expect(setAllowedRoute).not.toHaveBeenCalled();
    });
});

