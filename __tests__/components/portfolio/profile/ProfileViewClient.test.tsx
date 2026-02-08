import React from "react";
import { render } from "@testing-library/react";
import ProfileViewClient from "@/components/portfolio/profile/ProfileViewClient";

// Mock the dynamic import
jest.mock("next/dynamic", () => {
    return () => {
        const MockProfileView = () => <div data-testid="profile-view-mock">ProfileView</div>;
        return MockProfileView;
    };
});

describe("ProfileViewClient", () => {
    it("renders ProfileView component", () => {
        const { getByTestId } = render(<ProfileViewClient />);
        expect(getByTestId("profile-view-mock")).toBeInTheDocument();
    });
});
