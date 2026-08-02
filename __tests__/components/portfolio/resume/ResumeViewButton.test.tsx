import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ResumeViewButton from "@/components/portfolio/resume/ResumeViewButton";

describe("ResumeViewButton", () => {
  it("opens the resume in a full-screen viewer without downloading it", async () => {
    render(<ResumeViewButton />);

    fireEvent.click(screen.getByRole("button", { name: /view resume/i }));

    const document = await screen.findByTitle(/phani venkata sai kiran resume/i);
    expect(document).toHaveAttribute("src", "/api/download-resume?view=1");

    fireEvent.click(screen.getByRole("button", { name: /close resume viewer/i }));
    await waitFor(() => expect(screen.queryByTitle(/phani venkata sai kiran resume/i)).not.toBeInTheDocument());
  });
});
