"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
    type ReactNode,
    type CSSProperties,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export type TransitionState = "idle" | "expanding" | "navigating" | "exiting";

export interface CursorPosition {
    x: number;
    y: number;
}

export interface PageTransitionContextValue {
    state: TransitionState;
    cursorPosition: CursorPosition;
    exitPosition: CursorPosition;
    targetHref: string | null;
    triggerTransition: (href: string, position: CursorPosition) => void;
    completeExpansion: () => void;
    completeExit: () => void;
    reset: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
    null
);

export interface PageTransitionProviderProps {
    children: ReactNode;
    /** Duration of the expansion animation in ms (default: 800) */
    expansionDuration?: number;
    /** Duration of the exit animation in ms (default: 600) */
    exitDuration?: number;
    /** Delay before exit animation starts after navigation (default: 500ms) - allows page content to load */
    exitDelay?: number;
}

export function PageTransitionProvider({
    children,
    expansionDuration = 800,
    exitDuration = 600,
    exitDelay = 500,
}: PageTransitionProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [state, setState] = useState<TransitionState>("idle");
    const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
        x: 0,
        y: 0,
    });
    const [exitPosition, setExitPosition] = useState<CursorPosition>({
        x: 0,
        y: 0,
    });
    const [targetHref, setTargetHref] = useState<string | null>(null);

    // Track the pathname when navigation started
    const originPathname = useRef<string | null>(null);

    // Track live mouse position for exit animation
    const liveMousePosition = useRef<CursorPosition>({ x: 0, y: 0 });

    // Track mouse movement globally
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            liveMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Watch for pathname changes to trigger exit animation when navigating
    useEffect(() => {
        // If we're in navigating state and the pathname has changed from origin
        if (state === "navigating" && originPathname.current && pathname !== originPathname.current) {
            // Navigation completed, wait for content to load then start exit animation
            const timer = setTimeout(() => {
                // Capture current mouse position for exit animation
                setExitPosition({ ...liveMousePosition.current });
                setState("exiting");
                originPathname.current = null;
            }, exitDelay);

            return () => clearTimeout(timer);
        }
    }, [pathname, state, exitDelay]);

    const triggerTransition = useCallback(
        (href: string, position: CursorPosition) => {
            if (state !== "idle") return;

            // Store the current pathname as origin
            originPathname.current = pathname;
            setTargetHref(href);
            setCursorPosition(position);
            setState("expanding");
        },
        [state, pathname]
    );

    const completeExpansion = useCallback(() => {
        if (state !== "expanding" || !targetHref) return;

        setState("navigating");

        // Navigate after a brief moment to ensure the overlay is fully covering
        setTimeout(() => {
            router.push(targetHref);
        }, 50);
    }, [state, targetHref, router]);

    const completeExit = useCallback(() => {
        if (state !== "exiting") return;
        setState("idle");
        setTargetHref(null);
        setCursorPosition({ x: 0, y: 0 });
        setExitPosition({ x: 0, y: 0 });
    }, [state]);

    const reset = useCallback(() => {
        setState("idle");
        setTargetHref(null);
        setCursorPosition({ x: 0, y: 0 });
        setExitPosition({ x: 0, y: 0 });
        originPathname.current = null;
    }, []);

    const value = useMemo<PageTransitionContextValue>(
        () => ({
            state,
            cursorPosition,
            exitPosition,
            targetHref,
            triggerTransition,
            completeExpansion,
            completeExit,
            reset,
        }),
        [state, cursorPosition, exitPosition, targetHref, triggerTransition, completeExpansion, completeExit, reset]
    );

    // Expose durations via CSS custom properties for the overlay
    const style = {
        "--page-transition-duration": `${expansionDuration}ms`,
        "--page-transition-exit-duration": `${exitDuration}ms`,
    } as CSSProperties;

    return (
        <PageTransitionContext.Provider value={value}>
            <div style={style}>{children}</div>
        </PageTransitionContext.Provider>
    );
}

export function usePageTransition(): PageTransitionContextValue {
    const context = useContext(PageTransitionContext);
    if (!context) {
        throw new Error(
            "usePageTransition must be used within a PageTransitionProvider"
        );
    }
    return context;
}

export { PageTransitionContext };
