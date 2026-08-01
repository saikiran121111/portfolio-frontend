import { render, screen } from "@testing-library/react";
import Logo from "@/components/portfolio/logo/Logo";

describe("Logo", () => {
  it("links the original SK brand mark to the homepage", () => {
    const { container } = render(<Logo size={40} />);
    expect(screen.getByRole("link", { name: /sai kiran, home/i })).toHaveAttribute("href", "/");
    expect(container.querySelector(".brand-s")).toBeInTheDocument();
    expect(container.querySelector(".brand-k")).toBeInTheDocument();
    expect(screen.getByText("Backend / AI direction")).toBeInTheDocument();
  });
});
