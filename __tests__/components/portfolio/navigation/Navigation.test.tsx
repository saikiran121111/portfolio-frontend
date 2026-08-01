import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Navigation from "@/components/portfolio/navigation/Navigation";

describe("Navigation section state", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("marks the section from the current hash as active", async () => {
    window.history.replaceState({}, "", "/#projects");
    render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("updates the active underline when a section link is clicked", () => {
    render(<Navigation />);

    fireEvent.click(screen.getByRole("link", { name: "Experience" }));

    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("syncs active state during browser hash navigation", async () => {
    render(<Navigation />);

    window.history.replaceState({}, "", "/#experience");
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });
});
