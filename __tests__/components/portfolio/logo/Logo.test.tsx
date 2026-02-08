import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Logo } from "@/components/portfolio/logo/Logo";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";

// Mocks
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

jest.mock("@/components/page-transition", () => ({
    usePageTransition: jest.fn(),
}));

describe("Logo", () => {
    const mockTrigger = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (usePageTransition as jest.Mock).mockReturnValue({
            triggerTransition: mockTrigger,
            state: "idle",
        });
    });

    it("triggers transition on click when not on home", () => {
        (usePathname as jest.Mock).mockReturnValue("/about");

        render(<Logo />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).toHaveBeenCalled();
    });

    it("does not trigger transition on home", () => {
        (usePathname as jest.Mock).mockReturnValue("/");

        render(<Logo />);

        const link = document.querySelector("a");
        fireEvent.click(link!);

        expect(mockTrigger).not.toHaveBeenCalled();
    });

    it("applies scale animation class after mount", async () => {
        (usePathname as jest.Mock).mockReturnValue("/");
        const { container } = render(<Logo animate={true} />);

        await waitFor(() => {
            expect(container.querySelector(".sk-logo-animate")).toBeInTheDocument();
        });
    });
});
