import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResumeModal from "@/components/portfolio/profile/sections/ResumeModal";

describe("ResumeModal", () => {
    it("renders when open", () => {
        render(<ResumeModal isOpen={true} onClose={jest.fn()} onDownload={jest.fn()} />);
        // It uses createPortal, usually renders into body
        expect(screen.getByText("Resume Preview")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
        render(<ResumeModal isOpen={false} onClose={jest.fn()} onDownload={jest.fn()} />);
        expect(screen.queryByText("Resume Preview")).not.toBeInTheDocument();
    });

    it("calls onClose when close button clicked", () => {
        const onClose = jest.fn();
        render(<ResumeModal isOpen={true} onClose={onClose} onDownload={jest.fn()} />);

        // Find close button (X icon) - usually simpler to find by role if accessible, 
        // but here we can look for the button containing the X icon or just the button
        const buttons = screen.getAllByRole("button");
        // The close button is likely the second one (first is download based on code)
        // Or we can query by icon if we mock lucide-react, but assuming standard render:
        // We know structure: Download button, Close button.
        fireEvent.click(buttons[1]);

        expect(onClose).toHaveBeenCalled();
    });
});
