import { render, screen } from "@testing-library/react";
import ProfilePage from "@/app/profile/page";
import { fetchUserPortfolio } from "@/services/portfolio.service";

jest.mock("@/components/portfolio/profile/ProfileView", () => ({ data }: { data: { name: string } }) => <div>{data.name} profile</div>);
jest.mock("@/services/portfolio.service", () => ({ fetchUserPortfolio: jest.fn() }));

describe("ProfilePage", () => {
  it("renders the server-fetched profile directly", async () => {
    (fetchUserPortfolio as jest.MockedFunction<typeof fetchUserPortfolio>).mockResolvedValue({ name: "Sai Kiran", email: "sai@example.com", skills: [], experiences: [], education: [] });
    render(await ProfilePage());
    expect(screen.getByText("Sai Kiran profile")).toBeInTheDocument();
  });

  it("shows a useful fallback when data cannot load", async () => {
    (fetchUserPortfolio as jest.MockedFunction<typeof fetchUserPortfolio>).mockRejectedValue(new Error("offline"));
    render(await ProfilePage());
    expect(screen.getByRole("heading", { name: /could not be loaded/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute("href", "/api/download-resume");
  });
});
