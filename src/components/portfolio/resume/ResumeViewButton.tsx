"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import ResumeViewer from "@/components/portfolio/resume/ResumeViewer";

interface ResumeViewButtonProps {
  className?: string;
  label?: string;
}

export default function ResumeViewButton({
  className = "button button-primary",
  label = "View Resume",
}: ResumeViewButtonProps) {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setViewerOpen(true)}>
        <Eye aria-hidden="true" /> {label}
      </button>
      <ResumeViewer open={viewerOpen} onOpenChange={setViewerOpen} />
    </>
  );
}
