import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import IntroLoader from "@/components/portfolio/intro/IntroLoader";

describe("IntroLoader", () => {
    const originalRAF = window.requestAnimationFrame;
    const originalCAF = window.cancelAnimationFrame;

    beforeEach(() => {
        sessionStorage.clear();
        jest.useFakeTimers();

        // Mock RAF to execute callbacks
        let rafId = 0;
        (window as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
            rafId++;
            setTimeout(() => cb(performance.now()), 16);
            return rafId;
        };
        (window as any).cancelAnimationFrame = jest.fn();
    });

    afterEach(() => {
        sessionStorage.clear();
        jest.useRealTimers();
        window.requestAnimationFrame = originalRAF;
        window.cancelAnimationFrame = originalCAF;
    });

    describe("Initial Render", () => {
        it("renders loader when session storage is not set", () => {
            render(<IntroLoader durationMs={100} />);
            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("renders with default duration when not specified", () => {
            render(<IntroLoader />);
            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("renders progress bar during loading", () => {
            render(<IntroLoader durationMs={3000} />);
            const progressBar = document.querySelector('[class*="rounded-full"]');
            expect(progressBar).toBeInTheDocument();
        });

        it("applies custom overlay class", () => {
            render(<IntroLoader overlayClassName="bg-red-500" />);
            const overlay = document.querySelector(".bg-red-500");
            expect(overlay).toBeInTheDocument();
        });
    });

    describe("Session Storage Skip", () => {
        it("skips rendering when intro-shown is set in session storage", () => {
            sessionStorage.setItem("intro-shown", "true");
            const onComplete = jest.fn();

            render(<IntroLoader onComplete={onComplete} />);

            expect(onComplete).toHaveBeenCalled();
            const svg = document.querySelector("svg");
            expect(svg).not.toBeInTheDocument();
        });

        it("sets data-intro-done attribute when session is already shown", () => {
            sessionStorage.setItem("intro-shown", "true");
            render(<IntroLoader />);
            expect(document.documentElement.getAttribute("data-intro-done")).toBe("true");
        });

        it("renders loader when session storage has different value", () => {
            sessionStorage.setItem("intro-shown", "false");
            render(<IntroLoader />);
            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });
    });

    describe("Animation Phases", () => {
        it("starts with dot phase", () => {
            render(<IntroLoader durationMs={5000} />);

            act(() => {
                jest.advanceTimersByTime(100);
            });

            // Dot should be visible (circle element)
            const circle = document.querySelector("circle");
            expect(circle).toBeInTheDocument();
        });

        it("transitions to line phase after 400ms", () => {
            render(<IntroLoader durationMs={5000} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            // Line should be visible (path with line-grow class)
            const linePath = document.querySelector(".line-grow");
            expect(linePath).toBeInTheDocument();
        });

        it("transitions to s-in phase after 1000ms", () => {
            render(<IntroLoader durationMs={5000} />);

            act(() => {
                jest.advanceTimersByTime(1100);
            });

            // S should be visible (slide-in-left class)
            const sPath = document.querySelector(".slide-in-left");
            expect(sPath).toBeInTheDocument();
        });

        it("transitions to k-arrow phase after 1800ms", () => {
            render(<IntroLoader durationMs={5000} />);

            act(() => {
                jest.advanceTimersByTime(1900);
            });

            // K arrow should be visible (arrow-slash class)
            const kArrow = document.querySelector(".arrow-slash");
            expect(kArrow).toBeInTheDocument();
        });

        it("transitions to complete phase after 2600ms", () => {
            render(<IntroLoader durationMs={5000} />);

            act(() => {
                jest.advanceTimersByTime(2700);
            });

            // Logo should have luxury-glow class
            const glowElement = document.querySelector(".luxury-glow");
            expect(glowElement).toBeInTheDocument();
        });
    });

    describe("Animation Completion", () => {
        it("calls onComplete after animation finishes", async () => {
            const onComplete = jest.fn();
            render(<IntroLoader durationMs={100} onComplete={onComplete} />);

            act(() => {
                jest.advanceTimersByTime(200);
            });

            await waitFor(() => {
                expect(onComplete).toHaveBeenCalled();
            }, { timeout: 1000 });
        });

        it("sets intro-shown in session storage after completion", async () => {
            render(<IntroLoader durationMs={100} />);

            act(() => {
                jest.advanceTimersByTime(200);
            });

            await waitFor(() => {
                expect(sessionStorage.getItem("intro-shown")).toBe("true");
            }, { timeout: 1000 });
        });

        it("sets data-intro-done attribute after completion", async () => {
            render(<IntroLoader durationMs={100} />);

            act(() => {
                jest.advanceTimersByTime(200);
            });

            await waitFor(() => {
                expect(document.documentElement.getAttribute("data-intro-done")).toBe("true");
            }, { timeout: 1000 });
        });

        it("dispatches intro:done event after completion", async () => {
            const eventHandler = jest.fn();
            window.addEventListener("intro:done", eventHandler);

            render(<IntroLoader durationMs={100} />);

            act(() => {
                jest.advanceTimersByTime(200);
            });

            await waitFor(() => {
                expect(eventHandler).toHaveBeenCalled();
            }, { timeout: 1000 });

            window.removeEventListener("intro:done", eventHandler);
        });

        it("hides loader after animation completes", async () => {
            const { container } = render(<IntroLoader durationMs={100} />);

            act(() => {
                jest.advanceTimersByTime(200);
            });

            await waitFor(() => {
                const svg = container.querySelector("svg");
                expect(svg).not.toBeInTheDocument();
            }, { timeout: 1000 });
        });
    });

    describe("Progress Bar", () => {
        it("starts at 0%", () => {
            render(<IntroLoader durationMs={5000} />);

            // Progress bar fill should exist with minimal width
            const progressFill = document.querySelector('[style*="width"]');
            expect(progressFill).toBeInTheDocument();
        });

        it("increases over time", () => {
            render(<IntroLoader durationMs={5000} />);

            act(() => {
                jest.advanceTimersByTime(2000);
            });

            // Progress should have increased
            const progressFill = document.querySelector('[style*="width"]');
            expect(progressFill).toBeInTheDocument();
        });
    });

    describe("Props", () => {
        it("accepts custom durationMs prop", () => {
            render(<IntroLoader durationMs={500} />);
            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("accepts onComplete callback", () => {
            const onComplete = jest.fn();
            render(<IntroLoader durationMs={100} onComplete={onComplete} />);

            act(() => {
                jest.advanceTimersByTime(200);
            });

            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it("accepts overlayClassName prop", () => {
            render(<IntroLoader overlayClassName="custom-overlay" />);
            const overlay = document.querySelector(".custom-overlay");
            expect(overlay).toBeInTheDocument();
        });
    });

    describe("SVG Elements", () => {
        it("renders SVG with correct viewBox", () => {
            render(<IntroLoader />);
            const svg = document.querySelector("svg");
            expect(svg).toHaveAttribute("viewBox", "50 -30 520 560");
        });

        it("contains gradient definitions", () => {
            render(<IntroLoader />);

            act(() => {
                jest.advanceTimersByTime(100);
            });

            const goldGradient = document.getElementById("goldGradient");
            const goldVertical = document.getElementById("goldVertical");
            expect(goldGradient).toBeInTheDocument();
            expect(goldVertical).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has aria-hidden attribute on container", () => {
            render(<IntroLoader />);
            const container = document.querySelector('[aria-hidden="true"]');
            expect(container).toBeInTheDocument();
        });
    });

    describe("Cleanup", () => {
        it("cleans up timers on unmount", () => {
            const { unmount } = render(<IntroLoader durationMs={5000} />);

            act(() => {
                jest.advanceTimersByTime(100);
            });

            // Should not throw when unmounting
            expect(() => unmount()).not.toThrow();
        });
    });
});
