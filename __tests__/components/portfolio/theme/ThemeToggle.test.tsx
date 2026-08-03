import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ThemeToggle, {
  THEME_STORAGE_KEY,
} from "@/components/portfolio/theme/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  });

  it("uses dark mode by default and persists a light-mode selection", async () => {
    render(<ThemeToggle />);

    const toggle = await screen.findByRole("button", {
      name: "Switch to light mode",
    });
    fireEvent.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(toggle).toHaveAccessibleName("Switch to dark mode");
  });

  it("restores a saved preference when mounted again", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(
        screen.getByRole("button", { name: "Switch to dark mode" }),
      ).toBeInTheDocument();
    });
  });
});
