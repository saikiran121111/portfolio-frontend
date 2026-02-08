import React from "react";
import { render, renderHook, act } from "@testing-library/react";
import { PageTransitionProvider, usePageTransition } from "@/components/page-transition/PageTransitionContext";
import { useRouter, usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}));

describe("PageTransitionContext", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (usePathname as jest.Mock).mockReturnValue("/");
    });

    it("provides initial idle state", () => {
        const { result } = renderHook(() => usePageTransition(), { wrapper: PageTransitionProvider });
        expect(result.current.state).toBe("idle");
    });

    it("transitions to expanding state on trigger", () => {
        const { result } = renderHook(() => usePageTransition(), { wrapper: PageTransitionProvider });

        act(() => {
            result.current.triggerTransition("/about", { x: 100, y: 100 });
        });

        expect(result.current.state).toBe("expanding");
        expect(result.current.targetHref).toBe("/about");
    });

    it("transitions to navigating state on completeExpansion", () => {
        const { result } = renderHook(() => usePageTransition(), { wrapper: PageTransitionProvider });

        act(() => {
            result.current.triggerTransition("/about", { x: 100, y: 100 });
        });

        act(() => {
            result.current.completeExpansion();
        });

        expect(result.current.state).toBe("navigating");
    });

    it("provides cursorPosition", () => {
        const { result } = renderHook(() => usePageTransition(), { wrapper: PageTransitionProvider });

        act(() => {
            result.current.triggerTransition("/about", { x: 200, y: 300 });
        });

        expect(result.current.cursorPosition).toEqual({ x: 200, y: 300 });
    });

    it("resets to idle via reset() method", () => {
        const { result } = renderHook(() => usePageTransition(), { wrapper: PageTransitionProvider });

        act(() => {
            result.current.triggerTransition("/about", { x: 0, y: 0 });
            result.current.completeExpansion();
        });

        // Use reset() which unconditionally resets state
        act(() => {
            result.current.reset();
        });

        expect(result.current.state).toBe("idle");
    });
});
