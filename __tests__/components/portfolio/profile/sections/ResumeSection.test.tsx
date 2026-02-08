import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResumeSection from "@/components/portfolio/profile/sections/ResumeSection";

// Mock child modal
jest.mock("@/components/portfolio/profile/sections/ResumeModal", () => ({
    __esModule: true,
    default: ({ isOpen }: any) => isOpen ? <div>Mock Modal</div> : null,
}));

describe("ResumeSection", () => {
    it("opens modal on preview click", () => {
        render(<ResumeSection />);
        const previewBtn = screen.getByText("Preview");
        fireEvent.click(previewBtn);
        expect(screen.getByText("Mock Modal")).toBeInTheDocument();
    });

    it("triggers download on download click", () => {
        render(<ResumeSection />);

        // Mock createElement/appendChild/click/removeChild AFTER render to avoid breaking component mounting
        const link = { click: jest.fn(), style: {}, href: "", download: "" };
        const createElementSpy = jest.spyOn(document, "createElement").mockReturnValue(link as any);
        const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation(() => link as any);
        const removeChildSpy = jest.spyOn(document.body, "removeChild").mockImplementation(() => link as any);

        const downloadBtn = screen.getByText("Download Resume");
        fireEvent.click(downloadBtn);

        expect(createElementSpy).toHaveBeenCalledWith("a");
        expect(link.click).toHaveBeenCalled();
        expect(appendChildSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();

        // Restore mocks to avoid polluting other tests if not handled by afterEach
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });
});
