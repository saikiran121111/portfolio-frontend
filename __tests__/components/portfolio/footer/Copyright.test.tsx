import { render, screen } from "@testing-library/react";
import Copyright from "@/components/portfolio/footer/Copyright";

describe("Copyright", () => {
  it("renders the professional footer and contact links", () => {
    render(<Copyright />);
    expect(screen.getByText("Sai Kiran")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute("href", "mailto:saikiranvsk3@gmail.com");
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/saikiran121111");
    expect(screen.getByText(/Phani Venkata Sai Kiran/)).toBeInTheDocument();
  });
});
