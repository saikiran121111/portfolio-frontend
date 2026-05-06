import React from "react";
import { render, screen } from "@testing-library/react";
import UpdateProfilePage from "@/app/updateprofile/page";

jest.mock("@/components/portfolio/logo/Logo", () => () => <div>Logo</div>);
jest.mock("@/components/admin/UpdateProfileClient", () => () => (
  <div>UpdateProfileClient</div>
));

describe("UpdateProfile Page", () => {
  it("renders the admin editor shell", () => {
    render(<UpdateProfilePage />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByText("UpdateProfileClient")).toBeInTheDocument();
  });
});
