import React from "react";
import { render, screen, act } from "@testing-library/react";
import BottomHeadline from "@/components/portfolio/bottomHeadline/BottomHeadline";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@/services/portfolio.service");

describe("BottomHeadline", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders items provided via props", () => {
        render(<BottomHeadline items={["Hello", "World"]} typingSpeed={10} />);

        act(() => {
            jest.advanceTimersByTime(100); // Allow typing to start
        });

        expect(screen.getByText(/H/)).toBeInTheDocument();
    });

    it("fetches items from API if not provided", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue({
            bottomHeadline: ["API Item"],
        });

        render(<BottomHeadline typingSpeed={10} />);

        await act(async () => {
            // Wait for useEffect
            await Promise.resolve();
        });

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(screen.getByText(/A/)).toBeInTheDocument();
    });

    it("cycles through items", async () => {
        render(<BottomHeadline items={["A", "B"]} typingSpeed={10} deleteSpeed={10} displayDuration={100} />);

        // Type "A"
        act(() => jest.advanceTimersByTime(50));
        expect(screen.getByText("A")).toBeInTheDocument();

        // Wait display duration
        act(() => jest.advanceTimersByTime(200));

        // Delete "A"
        act(() => jest.advanceTimersByTime(50));

        // Type "B"
        act(() => jest.advanceTimersByTime(200));
        expect(screen.getByText("B")).toBeInTheDocument();
    });
});
