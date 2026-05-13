"use client";

import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { usePageTransition } from "./PageTransitionContext";

export interface PageTransitionOverlayProps {
    /** Background color of the expansion overlay */
    backgroundColor?: string;
    /** Base size of the cursor circle in px */
    baseSize?: number;
}

export function PageTransitionOverlay({
    backgroundColor = "#ffffff",
    baseSize = 30,
}: PageTransitionOverlayProps) {
    const { state, cursorPosition, exitPosition, completeExpansion, completeExit } = usePageTransition();
    const overlayRef = useRef<HTMLDivElement>(null);

    const getAnimationDuration = useCallback((fallbackMs: number, propertyName: string) => {
        const overlay = overlayRef.current;
        if (!overlay || typeof window === "undefined") return fallbackMs;

        const rawValue = window
            .getComputedStyle(overlay)
            .getPropertyValue(propertyName)
            .trim();
        const parsed = Number.parseFloat(rawValue);

        return Number.isFinite(parsed) ? parsed : fallbackMs;
    }, []);

    useEffect(() => {
        if (state === "expanding" && overlayRef.current) {
            let completed = false;
            const handleAnimationEnd = () => {
                if (completed) return;
                completed = true;
                completeExpansion();
            };

            const overlay = overlayRef.current;
            overlay.addEventListener("animationend", handleAnimationEnd);
            const fallbackTimer = window.setTimeout(
                handleAnimationEnd,
                getAnimationDuration(800, "--page-transition-duration") + 120
            );

            return () => {
                window.clearTimeout(fallbackTimer);
                overlay.removeEventListener("animationend", handleAnimationEnd);
            };
        }
    }, [state, completeExpansion, getAnimationDuration]);

    useEffect(() => {
        if (state === "exiting" && overlayRef.current) {
            let completed = false;
            const handleAnimationEnd = () => {
                if (completed) return;
                completed = true;
                completeExit();
            };

            const overlay = overlayRef.current;
            overlay.addEventListener("animationend", handleAnimationEnd);
            const fallbackTimer = window.setTimeout(
                handleAnimationEnd,
                getAnimationDuration(600, "--page-transition-exit-duration") + 120
            );

            return () => {
                window.clearTimeout(fallbackTimer);
                overlay.removeEventListener("animationend", handleAnimationEnd);
            };
        }
    }, [state, completeExit, getAnimationDuration]);

    // Calculate the scale needed to cover the entire viewport from a given position
    const getMaxScale = useMemo(() => {
        return (position: { x: number; y: number }) => {
            if (typeof window === "undefined") return 100;

            const { x, y } = position;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Distance to the farthest corner
            const distances = [
                Math.hypot(x, y), // top-left
                Math.hypot(vw - x, y), // top-right
                Math.hypot(x, vh - y), // bottom-left
                Math.hypot(vw - x, vh - y), // bottom-right
            ];

            const maxDistance = Math.max(...distances);
            // Scale so the circle covers the farthest corner with some extra margin
            return (maxDistance * 2.2) / baseSize;
        };
    }, [baseSize]);

    // Use entry position for expanding/navigating, exit position for exiting
    const activePosition = state === "exiting" ? exitPosition : cursorPosition;
    const scale = useMemo(() => getMaxScale(activePosition), [activePosition, getMaxScale]);

    if (state === "idle") {
        return null;
    }

    // Get animation based on current state
    const getAnimation = () => {
        if (state === "expanding") {
            return `pageTransitionExpand var(--page-transition-duration, 800ms) cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        }
        if (state === "exiting") {
            return `pageTransitionExit var(--page-transition-exit-duration, 600ms) cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        }
        return undefined;
    };

    // Get transform based on state
    const getTransform = () => {
        if (state === "navigating") {
            // During navigation, stay fully expanded at entry position scale
            const entryScale = getMaxScale(cursorPosition);
            return `scale(${entryScale})`;
        }
        if (state === "exiting") {
            // Start at full scale (will animate to scale 1)
            return undefined; // Animation handles this
        }
        return undefined;
    };

    return (
        <div
            key={state}
            ref={overlayRef}
            className="page-transition-overlay"
            data-transition-state={state}
            style={{
                position: "fixed",
                left: activePosition.x - baseSize / 2,
                top: activePosition.y - baseSize / 2,
                width: baseSize,
                height: baseSize,
                borderRadius: "50%",
                backgroundColor,
                zIndex: 2147483646, // Just below cursor
                pointerEvents: "none",
                transformOrigin: "center center",
                willChange: "transform, opacity",
                transform: getTransform(),
                animation: getAnimation(),
                ["--transition-scale" as string]: scale,
            }}
            aria-hidden="true"
        />
    );
}

export default PageTransitionOverlay;
