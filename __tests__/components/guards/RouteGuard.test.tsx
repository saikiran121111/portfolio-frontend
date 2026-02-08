import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import RouteGuard, {
    setAllowedRoute,
    getAllowedRoutes,
    isRouteAllowed,
    clearAllowedRoute,
} from "@/components/guards/RouteGuard";

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: mockReplace,
        push: jest.fn(),
        prefetch: jest.fn(),
    }),
}));

describe("RouteGuard utility functions", () => {
    beforeEach(() => {
        // Clear sessionStorage before each test
        sessionStorage.clear();
        jest.clearAllMocks();
    });

    describe("setAllowedRoute", () => {
        it("should add a route to sessionStorage", () => {
            setAllowedRoute("/profile");

            const routes = getAllowedRoutes();
            expect(routes).toContain("/profile");
        });

        it("should not add duplicate routes", () => {
            setAllowedRoute("/profile");
            setAllowedRoute("/profile");

            const routes = getAllowedRoutes();
            expect(routes.filter((r) => r === "/profile").length).toBe(1);
        });

        it("should add multiple different routes", () => {
            setAllowedRoute("/profile");
            setAllowedRoute("/tools");

            const routes = getAllowedRoutes();
            expect(routes).toContain("/profile");
            expect(routes).toContain("/tools");
        });
    });

    describe("getAllowedRoutes", () => {
        it("should return empty array when no routes are set", () => {
            const routes = getAllowedRoutes();
            expect(routes).toEqual([]);
        });

        it("should return stored routes", () => {
            sessionStorage.setItem(
                "portfolio_allowed_routes",
                JSON.stringify(["/profile", "/tools"])
            );

            const routes = getAllowedRoutes();
            expect(routes).toEqual(["/profile", "/tools"]);
        });

        it("should handle invalid JSON gracefully", () => {
            sessionStorage.setItem("portfolio_allowed_routes", "invalid-json");

            const routes = getAllowedRoutes();
            expect(routes).toEqual([]);
        });
    });

    describe("isRouteAllowed", () => {
        it("should return true for allowed route", () => {
            setAllowedRoute("/profile");

            expect(isRouteAllowed("/profile")).toBe(true);
        });

        it("should return false for non-allowed route", () => {
            expect(isRouteAllowed("/profile")).toBe(false);
        });

        it("should return false for different route", () => {
            setAllowedRoute("/profile");

            expect(isRouteAllowed("/tools")).toBe(false);
        });
    });

    describe("clearAllowedRoute", () => {
        it("should remove a specific route", () => {
            setAllowedRoute("/profile");
            setAllowedRoute("/tools");

            clearAllowedRoute("/profile");

            const routes = getAllowedRoutes();
            expect(routes).not.toContain("/profile");
            expect(routes).toContain("/tools");
        });

        it("should handle clearing non-existent route", () => {
            setAllowedRoute("/profile");

            clearAllowedRoute("/tools"); // doesn't exist

            const routes = getAllowedRoutes();
            expect(routes).toContain("/profile");
        });
    });
});

describe("RouteGuard component", () => {
    beforeEach(() => {
        sessionStorage.clear();
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should render children when route is allowed", async () => {
        setAllowedRoute("/profile");

        const { getByText } = render(
            <RouteGuard route="/profile">
                <div>Protected Content</div>
            </RouteGuard>
        );

        // Initially renders (optimistic)
        expect(getByText("Protected Content")).toBeInTheDocument();

        // Advance timers for the check
        act(() => {
            jest.advanceTimersByTime(100);
        });

        // Still renders after check
        await waitFor(() => {
            expect(getByText("Protected Content")).toBeInTheDocument();
        });

        // Should not redirect
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should redirect to homepage when route is not allowed", async () => {
        // Don't set any allowed routes (simulating direct URL access)

        const { queryByText } = render(
            <RouteGuard route="/profile">
                <div>Protected Content</div>
            </RouteGuard>
        );

        // Advance timers for the check
        act(() => {
            jest.advanceTimersByTime(100);
        });

        // Should redirect to homepage
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/");
        });
    });

    it("should work for /tools route", async () => {
        setAllowedRoute("/tools");

        const { getByText } = render(
            <RouteGuard route="/tools">
                <div>Tools Content</div>
            </RouteGuard>
        );

        // Advance timers for the check
        act(() => {
            jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
            expect(getByText("Tools Content")).toBeInTheDocument();
        });

        expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should clear route permission after successful access", async () => {
        setAllowedRoute("/profile");

        render(
            <RouteGuard route="/profile">
                <div>Protected Content</div>
            </RouteGuard>
        );

        // Advance timers for check + clear delay
        act(() => {
            jest.advanceTimersByTime(1200); // 50ms check + 1000ms clear delay
        });

        await waitFor(() => {
            expect(isRouteAllowed("/profile")).toBe(false);
        });
    });

    it("should only allow access once (one-time permission)", async () => {
        setAllowedRoute("/profile");

        // First render - should work
        const { unmount } = render(
            <RouteGuard route="/profile">
                <div>Protected Content</div>
            </RouteGuard>
        );

        act(() => {
            jest.advanceTimersByTime(1200);
        });

        await waitFor(() => {
            expect(isRouteAllowed("/profile")).toBe(false);
        });

        unmount();

        // Second render - should redirect (permission was cleared)
        render(
            <RouteGuard route="/profile">
                <div>Protected Content</div>
            </RouteGuard>
        );

        act(() => {
            jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/");
        });
    });
});
