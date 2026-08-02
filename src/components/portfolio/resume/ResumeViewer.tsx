"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import { siteContent } from "@/content/site";

interface ResumeViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerName?: string;
}

export default function ResumeViewer({ open, onOpenChange, ownerName }: ResumeViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }
      return;
    }

    setLoaded(false);
    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="resume-viewer"
      aria-labelledby={titleId}
      onCancel={() => onOpenChange(false)}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div className="resume-viewer-shell">
        <header className="resume-viewer-header">
          <div className="resume-viewer-title">
            <span className="resume-viewer-icon" aria-hidden="true"><FileText /></span>
            <span>
              <small>Resume preview</small>
              <strong id={titleId}>{ownerName || siteContent.identity.fullName}</strong>
            </span>
          </div>

          <button
            type="button"
            className="resume-viewer-close"
            aria-label="Close resume viewer"
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="resume-document-shell">
          {!loaded ? <p className="resume-document-loading">Loading resume…</p> : null}
          {open ? (
            <iframe
              className={loaded ? "resume-document is-loaded" : "resume-document"}
              src={siteContent.links.resumeView}
              title={`${ownerName || siteContent.identity.fullName} resume`}
              onLoad={() => setLoaded(true)}
            />
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
