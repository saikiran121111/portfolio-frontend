"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const ALLOWED_ROUTES_KEY = "portfolio_allowed_routes";
const ALLOWED_ROUTES = ["/profile", "/tools"] as const;

/**
 * Sets an allowed route in sessionStorage.
 * Call this when navigating from the homepage to protected pages.
 */
export function setAllowedRoute(route: string): void {
    if (typeof window === "undefined") return;

    const allowedRoutes = getAllowedRoutes();
    if (!allowedRoutes.includes(route)) {
        allowedRoutes.push(route);
        sessionStorage.setItem(ALLOWED_ROUTES_KEY, JSON.stringify(allowedRoutes));
    }
}

/**
 * Gets the list of allowed routes from sessionStorage.
 */
export function getAllowedRoutes(): string[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = sessionStorage.getItem(ALLOWED_ROUTES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Checks if a route is allowed for access.
 */
export function isRouteAllowed(route: string): boolean {
    return getAllowedRoutes().includes(route);
}

/**
 * Clears a specific route from the allowed list.
 */
export function clearAllowedRoute(route: string): void {
    if (typeof window === "undefined") return;

    const allowedRoutes = getAllowedRoutes().filter((r) => r !== route);
    sessionStorage.setItem(ALLOWED_ROUTES_KEY, JSON.stringify(allowedRoutes));
}

interface RouteGuardProps {
    route: (typeof ALLOWED_ROUTES)[number];
    children: React.ReactNode;
}

/**
 * Route guard component that redirects to homepage if the route
 * was accessed directly via URL instead of through homepage navigation.
 */
export default function RouteGuard({ route, children }: RouteGuardProps) {
    const router = useRouter();
    // Initialize to true to avoid flash - we'll check and redirect if needed
    const [isAllowed, setIsAllowed] = useState<boolean>(true);
    const hasChecked = useRef(false);

    useEffect(() => {
        // Only check once per mount
        if (hasChecked.current) return;
        hasChecked.current = true;

        // Small delay to ensure sessionStorage is available after navigation
        const checkTimer = setTimeout(() => {
            const allowed = isRouteAllowed(route);

            if (!allowed) {
                // Direct access detected, redirect to homepage
                setIsAllowed(false);
                router.replace("/");
            } else {
                setIsAllowed(true);
                // Clear the route permission after a longer delay
                // This ensures the page is fully loaded before clearing
                setTimeout(() => {
                    clearAllowedRoute(route);
                }, 1000);
            }
        }, 50);

        return () => clearTimeout(checkTimer);
    }, [route, router]);

    // If not allowed after check, show nothing (redirect is happening)
    if (!isAllowed) {
        return null;
    }

    return <>{children}</>;
}

