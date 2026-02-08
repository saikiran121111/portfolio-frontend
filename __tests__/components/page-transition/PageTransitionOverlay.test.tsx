import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PageTransitionOverlay } from "@/components/page-transition/PageTransitionOverlay";
import { PageTransitionProvider, usePageTransition } from "@/components/page-transition/PageTransitionContext";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    usePathname: () => "/",
}));

// Test wrapper that exposes trigger function via ref-like pattern
function TestWrapper({
    children,
    onReady,
}: {
    children: React.ReactNode;
    onReady?: (trigger: (href: string, pos: { x: number; y: number }) => void) => void;
}) {
    return (
        <PageTransitionProvider>
            <TriggerExposer onReady={onReady} />
            {children}
        </PageTransitionProvider>
    );
}

function TriggerExposer({
    onReady,
}: {
    onReady?: (trigger: (href: string, pos: { x: number; y: number }) => void) => void;
}) {
    const { triggerTransition, state } = usePageTransition();
    const triggerRef = React.useRef(triggerTransition);
    triggerRef.current = triggerTransition;

    React.useEffect(() => {
        onReady?.(triggerRef.current);
    }, [onReady]);

    return <span data-testid="state">{state}</span>;
}

describe("PageTransitionOverlay", () => {
    let triggerFn: ((href: string, pos: { x: number; y: number }) => void) | undefined;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        triggerFn = undefined;
        Object.defineProperty(window, "innerWidth", { value: 1920, writable: true });
        Object.defineProperty(window, "innerHeight", { value: 1080, writable: true });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders nothing when state is idle", () => {
        const { container } = render(
            <TestWrapper>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        expect(container.querySelector(".page-transition-overlay")).not.toBeInTheDocument();
    });

    it("renders overlay when state is expanding", () => {
        let trigger: (href: string, pos: { x: number; y: number }) => void;
        const { container } = render(
            <TestWrapper onReady={(t) => { trigger = t; }}>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        act(() => {
            trigger("/test", { x: 500, y: 300 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveAttribute("aria-hidden", "true");
    });

    it("positions overlay at cursor position", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay baseSize={30} />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 500, y: 300 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toHaveStyle({
            left: "485px",
            top: "285px",
            width: "30px",
            height: "30px",
        });
    });

    it("applies custom background color", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay backgroundColor="#ff0000" />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toHaveStyle({ backgroundColor: "#ff0000" });
    });

    it("uses default background color", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toHaveStyle({ backgroundColor: "#f7f8fa" });
    });

    it("applies animation styles when expanding", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toHaveStyle({
            animation: "pageTransitionExpand var(--page-transition-duration, 800ms) cubic-bezier(0.4, 0, 0.2, 1) forwards",
        });
    });

    it("calls completeExpansion on animationend", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(screen.getByTestId("state")).toHaveTextContent("expanding");

        act(() => {
            fireEvent.animationEnd(overlay!);
        });

        expect(screen.getByTestId("state")).toHaveTextContent("navigating");
    });

    it("calculates scale based on cursor position", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay baseSize={30} />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 0, y: 0 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        const style = overlay?.getAttribute("style");
        expect(style).toContain("--transition-scale:");
    });

    it("has correct z-index for layering", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toHaveStyle({ zIndex: 2147483646 });
    });

    it("has pointerEvents set to none", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toHaveStyle({ pointerEvents: "none" });
    });

    it("applies scale transform when navigating", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay baseSize={30} />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 960, y: 540 });
        });

        const overlay = container.querySelector(".page-transition-overlay");

        act(() => {
            fireEvent.animationEnd(overlay!);
        });

        expect(screen.getByTestId("state")).toHaveTextContent("navigating");

        const updatedOverlay = container.querySelector(".page-transition-overlay");
        const style = updatedOverlay?.getAttribute("style");
        expect(style).toContain("transform:");
    });

    it("uses custom baseSize prop", () => {
        const { container } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay baseSize={50} />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        const overlay = container.querySelector(".page-transition-overlay");
        expect(overlay).toHaveStyle({
            width: "50px",
            height: "50px",
        });
    });

    it("cleans up event listener on unmount", () => {
        const { container, unmount } = render(
            <TestWrapper onReady={(t) => { triggerFn = t; }}>
                <PageTransitionOverlay />
            </TestWrapper>
        );

        act(() => {
            triggerFn!("/test", { x: 100, y: 100 });
        });

        expect(container.querySelector(".page-transition-overlay")).toBeInTheDocument();

        // Unmount should clean up without errors
        expect(() => unmount()).not.toThrow();
    });
});
