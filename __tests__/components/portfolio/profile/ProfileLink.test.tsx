import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ProfileLink } from "@/components/portfolio/profile/ProfileLink";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

jest.mock("@/components/page-transition", () => ({
    usePageTransition: jest.fn(),
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

    it("does not trigger transition when not on homepage", () => {
        (usePathname as jest.Mock).mockReturnValue("/about");
        render(<ProfileLink />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).not.toHaveBeenCalled();
    });
});
