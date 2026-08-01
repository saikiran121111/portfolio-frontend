import { ArrowUpRight } from "lucide-react";
import { siteContent } from "@/content/site";

export default function Copyright() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div>
          <p className="footer-title">{siteContent.identity.shortName}</p>
          <p>Backend &amp; full-stack engineering · AI engineering direction</p>
        </div>
        <div className="footer-links" aria-label="Social links">
          <a href={`mailto:${siteContent.identity.email}`}>Email <ArrowUpRight aria-hidden="true" /></a>
          <a href={siteContent.links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight aria-hidden="true" /></a>
          <a href={siteContent.links.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a>
          <a href={siteContent.links.resume}>Résumé <ArrowUpRight aria-hidden="true" /></a>
        </div>
        <p className="footer-legal">© {new Date().getFullYear()} {siteContent.identity.fullName}</p>
      </div>
    </footer>
  );
}
