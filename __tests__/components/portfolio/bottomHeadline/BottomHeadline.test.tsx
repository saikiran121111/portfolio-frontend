import React from "react";
import { render, act } from "@testing-library/react";
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
        const { container } = render(<BottomHeadline items={["Hello", "World"]} typingSpeed={10} />);
        const liveText = container.querySelector(".bottom-headline-live");

        expect(liveText).toHaveTextContent("Hello");
    });

    it("fetches items from API if not provided", async () => {
        (fetchUserPortfolio as jest.Mock).mockResolvedValue({
            bottomHeadline: ["API Item"],
        });

        const { container } = render(<BottomHeadline typingSpeed={10} />);

        await act(async () => {
            // Wait for useEffect
            await Promise.resolve();
        });

        const liveText = container.querySelector(".bottom-headline-live");

        expect(liveText).toHaveTextContent("API Item");
    });

    it("cycles through items", async () => {
        const { container } = render(
            <BottomHeadline items={["A", "B"]} typingSpeed={10} deleteSpeed={10} displayDuration={100} />,
        );
        const liveText = () => container.querySelector(".bottom-headline-live");

        expect(liveText()).toHaveTextContent("A");

        act(() => jest.advanceTimersByTime(450));
        act(() => jest.advanceTimersByTime(150));
        act(() => jest.advanceTimersByTime(250));

        expect(liveText()).toHaveTextContent("B");
    });
});
