import { act, fireEvent, render, screen } from "@testing-library/react";
import ProjectsRadar from "@/components/portfolio/projects/ProjectsRadar";

const projects = [
  { title: "First Project", url: "https://first.example.com" },
  { title: "Second Project", url: "https://second.example.com" },
  { title: "Third Project", url: "https://third.example.com" },
];

describe("ProjectsRadar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("keeps the active project url when clicked", () => {
    render(<ProjectsRadar projects={projects} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://first.example.com");

    fireEvent.mouseEnter(link);
    act(() => {
      fireEvent.wheel(link, { deltaY: 100 });
    });

    expect(link).toHaveAttribute("href", "https://second.example.com");

    fireEvent.click(link);
    expect(link).toHaveAttribute("href", "https://second.example.com");

    act(() => {
      jest.advanceTimersByTime(151);
    });

    fireEvent.mouseEnter(link);
    act(() => {
      fireEvent.wheel(link, { deltaY: 100 });
    });

    expect(link).toHaveAttribute("href", "https://third.example.com");

    fireEvent.click(link);
    expect(link).toHaveAttribute("href", "https://third.example.com");
  });
});
