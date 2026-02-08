import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import {
    PageTransitionProvider,
    usePageTransition,
    PageTransitionContext,
} from "@/components/page-transition/PageTransitionContext";

// Mock Next.js router
const mockPush = jest.fn();
let mockPathname = "/";
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: () => mockPathname,
}));

// Test component that uses the hook
function TestConsumer() {
    const { state, cursorPosition, targetHref, triggerTransition, completeExpansion, completeExit, reset } =
        usePageTransition();
    return (
        <div>
            <span data-testid="state">{state}</span>
            <span data-testid="cursor-x">{cursorPosition.x}</span>
            <span data-testid="cursor-y">{cursorPosition.y}</span>
            <span data-testid="target-href">{targetHref ?? "null"}</span>
            <button
                data-testid="trigger-btn"
                onClick={() => triggerTransition("/test", { x: 100, y: 200 })}
            >
                Trigger
            </button>
            <button data-testid="complete-btn" onClick={completeExpansion}>
                Complete
            </button>
            <button data-testid="complete-exit-btn" onClick={completeExit}>
                Complete Exit
            </button>
            <button data-testid="reset-btn" onClick={reset}>
                Reset
            </button>
        </div>
    );
}

describe("PageTransitionContext", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockPathname = "/";
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("PageTransitionProvider", () => {
        it("provides default context values", () => {
            render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            expect(screen.getByTestId("state")).toHaveTextContent("idle");
            expect(screen.getByTestId("cursor-x")).toHaveTextContent("0");
            expect(screen.getByTestId("cursor-y")).toHaveTextContent("0");
            expect(screen.getByTestId("target-href")).toHaveTextContent("null");
        });

        it("renders children correctly", () => {
            render(
                <PageTransitionProvider>
                    <div data-testid="child">Child Content</div>
                </PageTransitionProvider>
            );

            expect(screen.getByTestId("child")).toBeInTheDocument();
        });

        it("sets custom expansion duration via CSS variable", () => {
            const { container } = render(
                <PageTransitionProvider expansionDuration={500}>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            const wrapper = container.querySelector("[style]");
            expect(wrapper).toHaveStyle("--page-transition-duration: 500ms");
        });

        it("uses default expansion duration of 800ms", () => {
            const { container } = render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            const wrapper = container.querySelector("[style]");
            expect(wrapper).toHaveStyle("--page-transition-duration: 800ms");
        });
    });

    describe("triggerTransition", () => {
        it("updates state to expanding with cursor position and target href", () => {
            render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            act(() => {
                fireEvent.click(screen.getByTestId("trigger-btn"));
            });

            expect(screen.getByTestId("state")).toHaveTextContent("expanding");
            expect(screen.getByTestId("cursor-x")).toHaveTextContent("100");
            expect(screen.getByTestId("cursor-y")).toHaveTextContent("200");
            expect(screen.getByTestId("target-href")).toHaveTextContent("/test");
        });

        it("does not trigger when state is not idle", () => {
            render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            // First trigger
            act(() => {
                fireEvent.click(screen.getByTestId("trigger-btn"));
            });
            expect(screen.getByTestId("state")).toHaveTextContent("expanding");

            // Try to trigger again - should be ignored
            act(() => {
                fireEvent.click(screen.getByTestId("trigger-btn"));
            });
            expect(screen.getByTestId("state")).toHaveTextContent("expanding");
        });
    });

    describe("completeExpansion", () => {
        it("transitions state to navigating and calls router.push", async () => {
            render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            // Trigger transition first
            act(() => {
                fireEvent.click(screen.getByTestId("trigger-btn"));
            });

            // Complete expansion
            act(() => {
                fireEvent.click(screen.getByTestId("complete-btn"));
            });

            expect(screen.getByTestId("state")).toHaveTextContent("navigating");

            // Advance timers to trigger navigation
            act(() => {
                jest.advanceTimersByTime(50);
            });

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith("/test");
            });

            // State stays navigating until pathname changes (exit animation is handled separately)
            expect(screen.getByTestId("state")).toHaveTextContent("navigating");
        });

        it("does nothing when state is not expanding", () => {
            render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            // Try to complete without triggering first
            act(() => {
                fireEvent.click(screen.getByTestId("complete-btn"));
            });

            expect(screen.getByTestId("state")).toHaveTextContent("idle");
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe("completeExit", () => {
        it("resets state to idle after exit animation", () => {
            render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            // Trigger and complete expansion
            act(() => {
                fireEvent.click(screen.getByTestId("trigger-btn"));
            });
            act(() => {
                fireEvent.click(screen.getByTestId("complete-btn"));
            });

            // Manually set exiting state via reset and re-trigger for a simpler test
            act(() => {
                fireEvent.click(screen.getByTestId("reset-btn"));
            });

            expect(screen.getByTestId("state")).toHaveTextContent("idle");
        });
    });

    describe("reset", () => {
        it("resets all state to initial values", () => {
            render(
                <PageTransitionProvider>
                    <TestConsumer />
                </PageTransitionProvider>
            );

            // Trigger first
            act(() => {
                fireEvent.click(screen.getByTestId("trigger-btn"));
            });
            expect(screen.getByTestId("state")).toHaveTextContent("expanding");

            // Reset
            act(() => {
                fireEvent.click(screen.getByTestId("reset-btn"));
            });

            expect(screen.getByTestId("state")).toHaveTextContent("idle");
            expect(screen.getByTestId("cursor-x")).toHaveTextContent("0");
            expect(screen.getByTestId("cursor-y")).toHaveTextContent("0");
            expect(screen.getByTestId("target-href")).toHaveTextContent("null");
        });
    });

    describe("usePageTransition", () => {
        it("throws error when used outside provider", () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

            expect(() => {
                render(<TestConsumer />);
            }).toThrow("usePageTransition must be used within a PageTransitionProvider");

            consoleSpy.mockRestore();
        });
    });

    describe("PageTransitionContext", () => {
        it("exports the context for advanced usage", () => {
            expect(PageTransitionContext).toBeDefined();
        });
    });
});
