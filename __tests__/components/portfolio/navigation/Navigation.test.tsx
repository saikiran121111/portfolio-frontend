import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("returns home locally when already on the homepage", () => {
    window.history.replaceState({}, "", "/#projects");
    const scrollTo = jest
      .spyOn(window, "scrollTo")
      .mockImplementation(() => undefined);
    const matchMedia = jest.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }) as MediaQueryList,
    );
    render(<Navigation />);

    const navigationWasPrevented = !fireEvent.click(
      screen.getByRole("link", { name: "Home" }),
    );

    expect(navigationWasPrevented).toBe(true);
    expect(window.location.pathname).toBe("/");
    expect(window.location.hash).toBe("");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    scrollTo.mockRestore();
    matchMedia.mockRestore();
  });

  it("syncs active state during browser hash navigation", async () => {
    render(<Navigation />);

    act(() => {
      window.history.replaceState({}, "", "/#experience");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("offers separate resume viewing and download actions", () => {
    render(<Navigation />);

    fireEvent.click(screen.getByRole("button", { name: "Resume" }));

    expect(screen.getByRole("button", { name: /view resume/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download pdf/i })).toHaveAttribute(
      "href",
      "/api/download-resume",
    );
  });

  it("closes the mobile navigation when tapping outside it", () => {
    const matchMedia = jest.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(max-width: 820px)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }) as MediaQueryList,
    );
    render(<Navigation />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(
      screen.getByRole("button", { name: "Close navigation" }),
    ).toHaveAttribute("aria-expanded", "true");

    fireEvent.pointerDown(document.body);

    expect(
      screen.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
    matchMedia.mockRestore();
  });
});
