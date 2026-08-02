import { render, screen } from "@testing-library/react";
import ProfileLink from "@/components/portfolio/profile/ProfileLink";

describe("ProfileLink", () => {
  it("provides a direct accessible profile route", () => {
    render(<ProfileLink label="Open profile" />);
    expect(screen.getByRole("link", { name: /open profile/i })).toHaveAttribute("href", "/profile");
  });
});
