import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ProfileLink } from "@/components/portfolio/profile/ProfileLink";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";
import { setAllowedRoute } from "@/components/guards/RouteGuard";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

jest.mock("@/components/page-transition", () => ({
    usePageTransition: jest.fn(),
}));

jest.mock("@/components/guards/RouteGuard", () => ({
    setAllowedRoute: jest.fn(),
}));

describe("ProfileLink", () => {
    const mockTrigger = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (usePageTransition as jest.Mock).mockReturnValue({
            triggerTransition: mockTrigger,
            state: "idle",
        });
    });

    it("triggers transition on click when on homepage", () => {
        (usePathname as jest.Mock).mockReturnValue("/");
        render(<ProfileLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).toHaveBeenCalledWith("/profile", expect.any(Object));
    });

    it("calls setAllowedRoute before transition on homepage click", () => {
        (usePathname as jest.Mock).mockReturnValue("/");
        render(<ProfileLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(setAllowedRoute).toHaveBeenCalledWith("/profile");
        expect(mockTrigger).toHaveBeenCalled();
    });

    it("does not trigger transition when not on homepage", () => {
        (usePathname as jest.Mock).mockReturnValue("/about");
        render(<ProfileLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).not.toHaveBeenCalled();
    });

    it("does not call setAllowedRoute when not on homepage", () => {
        (usePathname as jest.Mock).mockReturnValue("/about");
        render(<ProfileLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(setAllowedRoute).not.toHaveBeenCalled();
    });

    it("does not trigger transition when already transitioning", () => {
        (usePathname as jest.Mock).mockReturnValue("/");
        (usePageTransition as jest.Mock).mockReturnValue({
            triggerTransition: mockTrigger,
            state: "expanding", // Not idle
        });
        render(<ProfileLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).not.toHaveBeenCalled();
        expect(setAllowedRoute).not.toHaveBeenCalled();
    });
});

