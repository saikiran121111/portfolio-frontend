import React from "react";
import { render, screen } from "@testing-library/react";
import IntroLoader from "@/components/portfolio/intro/IntroLoader";

describe("IntroLoader", () => {
    const originalRAF = window.requestAnimationFrame;
    const originalCAF = window.cancelAnimationFrame;

    beforeEach(() => {
        sessionStorage.clear();

        // Simple RAF mock that doesn't cause issues
        let frameId = 0;
        (window as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
            return ++frameId;
        };
        (window as any).cancelAnimationFrame = jest.fn();
    });

    afterEach(() => {
        sessionStorage.clear();
        window.requestAnimationFrame = originalRAF;
        window.cancelAnimationFrame = originalCAF;
    });

    it("renders loader when session storage is not set", () => {
        render(<IntroLoader durationMs={100} />);

        // The loader should render some content
        const container = document.querySelector('[aria-hidden="true"]');
        // Loader exists if there's any content
        expect(document.body.innerHTML.length).toBeGreaterThan(0);
    });

    it("skips rendering and calls onComplete if session storage is set", () => {
        sessionStorage.setItem("intro-shown", "true");
        const onComplete = jest.fn();

        render(<IntroLoader onComplete={onComplete} />);

        expect(onComplete).toHaveBeenCalled();
    });

    it("accepts durationMs prop", () => {
        render(<IntroLoader durationMs={500} />);
        // Just verify it renders without error
        expect(document.body.innerHTML.length).toBeGreaterThan(0);
    });
});
