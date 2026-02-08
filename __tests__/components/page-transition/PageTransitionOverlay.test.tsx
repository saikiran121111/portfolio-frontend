import React from "react";
import { render } from "@testing-library/react";
import PageTransitionOverlay from "@/components/page-transition/PageTransitionOverlay";
import { usePageTransition } from "@/components/page-transition/PageTransitionContext";

jest.mock("@/components/page-transition/PageTransitionContext");

describe("PageTransitionOverlay", () => {
    const mockContext = {
        state: "idle",
        cursorPosition: { x: 0, y: 0 },
        exitPosition: { x: 0, y: 0 },
        completeExpansion: jest.fn(),
        completeExit: jest.fn(),
    };

    beforeEach(() => {
        (usePageTransition as jest.Mock).mockReturnValue(mockContext);
    });

    it("renders nothing when idle", () => {
        const { container } = render(<PageTransitionOverlay />);
        expect(container.firstChild).toBeNull();
    });

    it("renders when expanding", () => {
        (usePageTransition as jest.Mock).mockReturnValue({ ...mockContext, state: "expanding" });
        const { container } = render(<PageTransitionOverlay />);
        expect(container.querySelector(".page-transition-overlay")).toBeInTheDocument();
    });

    it("renders when exiting", () => {
        (usePageTransition as jest.Mock).mockReturnValue({ ...mockContext, state: "exiting" });
        const { container } = render(<PageTransitionOverlay />);
        expect(container.querySelector(".page-transition-overlay")).toBeInTheDocument();
    });
});
