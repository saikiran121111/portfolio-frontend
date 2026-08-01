let activeFrame: number | null = null;

export function cancelSmoothScroll() {
  if (activeFrame === null) return;
  window.cancelAnimationFrame(activeFrame);
  activeFrame = null;
}

function numericLength(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function scrollToElement(target: HTMLElement) {
  cancelSmoothScroll();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = window.scrollY;
  const rootStyles = window.getComputedStyle(document.documentElement);
  const targetStyles = window.getComputedStyle(target);
  const offset = Math.max(
    numericLength(rootStyles.scrollPaddingTop),
    numericLength(targetStyles.scrollMarginTop),
  );
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const destination = Math.min(
    maxScroll,
    Math.max(0, target.getBoundingClientRect().top + start - offset),
  );
  const distance = destination - start;

  if (reducedMotion || Math.abs(distance) < 2) {
    window.scrollTo({ top: destination, behavior: "instant" });
    return;
  }

  const duration = Math.min(760, Math.max(480, Math.abs(distance) * 0.28));
  const startedAt = performance.now();

  const step = (time: number) => {
    const progress = Math.min(1, (time - startedAt) / duration);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo({
      top: start + distance * eased,
      behavior: "instant",
    });

    if (progress < 1) {
      activeFrame = window.requestAnimationFrame(step);
    } else {
      activeFrame = null;
    }
  };

  activeFrame = window.requestAnimationFrame(step);
}
