import React from "react";
import { render, screen } from "@testing-library/react";
import SocialIcon from "@/components/portfolio/profile/sections/SocialIcon";

describe("SocialIcon", () => {
    it("renders icons", () => {
        const socials = { github: "http://git.com" };
        render(<SocialIcon socials={socials} />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "http://git.com");
    });

    it("renders nothing if empty", () => {
        const { container } = render(<SocialIcon socials={undefined} />);
        expect(container.firstChild).toBeNull();
    });
});
