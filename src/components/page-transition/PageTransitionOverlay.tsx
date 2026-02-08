"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { usePageTransition } from "./PageTransitionContext";

export interface PageTransitionOverlayProps {
    /** Background color of the expansion overlay */
    backgroundColor?: string;
    /** Base size of the cursor circle in px */
    baseSize?: number;
}

export function PageTransitionOverlay({
    backgroundColor = "#f7f8fa", // matches cursor color
    baseSize = 30,
}: PageTransitionOverlayProps) {
    const { state, cursorPosition, exitPosition, completeExpansion, completeExit } = usePageTransition();
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state === "expanding" && overlayRef.current) {
            const handleAnimationEnd = () => {
                completeExpansion();
            };

            const overlay = overlayRef.current;
            overlay.addEventListener("animationend", handleAnimationEnd);

            return () => {
                overlay.removeEventListener("animationend", handleAnimationEnd);
            };
        }
    }, [state, completeExpansion]);

    useEffect(() => {
        if (state === "exiting" && overlayRef.current) {
            const handleAnimationEnd = () => {
                completeExit();
            };

            const overlay = overlayRef.current;
            overlay.addEventListener("animationend", handleAnimationEnd);

            return () => {
                overlay.removeEventListener("animationend", handleAnimationEnd);
            };
        }
    }, [state, completeExit]);

    // Calculate the scale needed to cover the entire viewport from a given position
    const getMaxScale = (position: { x: number; y: number }) => {
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

    // Use entry position for expanding/navigating, exit position for exiting
    const activePosition = state === "exiting" ? exitPosition : cursorPosition;
    const scale = useMemo(() => getMaxScale(activePosition), [activePosition, baseSize]);

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
            ref={overlayRef}
            className="page-transition-overlay"
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
                transform: getTransform(),
                animation: getAnimation(),
                ["--transition-scale" as string]: scale,
            }}
            aria-hidden="true"
        />
    );
}

export default PageTransitionOverlay;
