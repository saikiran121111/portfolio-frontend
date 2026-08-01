"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToElement } from "@/lib/smoothScroll";

type SmoothSectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

export default function SmoothSectionLink({
  href,
  onClick,
  ...props
}: SmoothSectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname !== window.location.pathname ||
      destination.search !== window.location.search
    ) {
      return;
    }

    const target = destination.hash
      ? document.getElementById(decodeURIComponent(destination.hash.slice(1)))
      : document.body;
    if (!target) return;

    event.preventDefault();
    const oldUrl = window.location.href;
    window.history.pushState(null, "", `${destination.pathname}${destination.search}${destination.hash}`);
    scrollToElement(target);
    window.dispatchEvent(new HashChangeEvent("hashchange", {
      oldURL: oldUrl,
      newURL: window.location.href,
    }));
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
