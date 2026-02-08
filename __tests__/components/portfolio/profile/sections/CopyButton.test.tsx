import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import CopyButton from "@/components/portfolio/profile/sections/CopyButton";

Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});

describe("CopyButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("copies text to clipboard on click", async () => {
        render(<CopyButton text="test@example.com" label="email" />);

        const button = screen.getByRole("button");
        await act(async () => {
            fireEvent.click(button);
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test@example.com");
    });

    it("shows copied state", async () => {
        render(<CopyButton text="test" label="copy" />);

        const button = screen.getByRole("button");
        await act(async () => {
            fireEvent.click(button);
        });

        expect(screen.getByTitle("Copied!")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(screen.getByTitle("Copy copy")).toBeInTheDocument();
    });
});
