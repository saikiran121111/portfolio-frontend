import React from "react";
import { render, screen } from "@testing-library/react";
import EducationCertsSection from "@/components/portfolio/profile/sections/EducationCertsSection";

describe("EducationCertsSection", () => {
    it("renders education", () => {
        const edu = [{ institution: "Uni", degree: "BS", startDate: new Date(), endDate: new Date() }];
        render(<EducationCertsSection education={edu} certifications={[]} />);
        expect(screen.getByText("Uni")).toBeInTheDocument();
    });

    it("renders certifications", () => {
        const certs = [{ title: "Cert", issuer: "Issuer", date: new Date() }];
        render(<EducationCertsSection education={[]} certifications={certs} />);
        expect(screen.getByText("Cert")).toBeInTheDocument();
    });

    it("renders nothing if empty", () => {
        const { container } = render(<EducationCertsSection education={[]} certifications={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
