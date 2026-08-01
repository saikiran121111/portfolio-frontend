"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; row: number; column: number };

const FRAME_INTERVAL = 1000 / 24;

function createPoints(width: number, height: number, compact: boolean): Point[] {
  const columns = compact ? 5 : 7;
  const rows = compact ? 4 : 5;
  const points: Point[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const xBase = width * (0.1 + (column / (columns - 1)) * 0.8);
      const yBase = height * (0.12 + (row / (rows - 1)) * 0.76);
      points.push({
        x: xBase + Math.sin(row * 3.1 + column * 1.7) * width * 0.018,
        y: yBase + Math.cos(column * 2.3 + row * 1.2) * height * 0.022,
        row,
        column,
      });
    }
  }

  return points;
}

export default function HeroSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let lastFrame = 0;
    let visible = true;
    let running = false;
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    const pointer = { x: 0, y: 0, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = createPoints(width, height, width < 640);
    };

    const adjustedPoint = (point: Point) => {
      if (!pointer.active) return point;
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / 180) * 9;
      if (!influence || distance === 0) return point;
      return {
        ...point,
        x: point.x + (dx / distance) * influence,
        y: point.y + (dy / distance) * influence,
      };
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      context.strokeStyle = "rgba(194, 148, 81, 0.15)";
      context.lineWidth = 1;

      for (const point of points) {
        const current = adjustedPoint(point);
        const right = points.find(
          (candidate) => candidate.row === point.row && candidate.column === point.column + 1,
        );
        const down = point.column % 2 === 0
          ? points.find(
              (candidate) => candidate.column === point.column && candidate.row === point.row + 1,
            )
          : undefined;

        for (const neighbor of [right, down]) {
          if (!neighbor) continue;
          const target = adjustedPoint(neighbor);
          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(target.x, target.y);
          context.stroke();
        }
      }

      for (const point of points) {
        const current = adjustedPoint(point);
        const signal = (time * 0.00012 + point.row * 0.17) % 1;
        const columnPosition = point.column / Math.max(1, (width < 640 ? 4 : 6));
        const distance = Math.abs(signal - columnPosition);
        const intensity = Math.max(0, 1 - distance * 8);

        context.beginPath();
        context.arc(current.x, current.y, 1.6 + intensity * 2.2, 0, Math.PI * 2);
        context.fillStyle = intensity > 0.2
          ? `rgba(225, 177, 91, ${0.5 + intensity * 0.45})`
          : "rgba(235, 231, 221, 0.36)";
        context.fill();

        if (intensity > 0.45) {
          context.beginPath();
          context.arc(current.x, current.y, 8 + intensity * 6, 0, Math.PI * 2);
          context.strokeStyle = `rgba(194, 148, 81, ${intensity * 0.18})`;
          context.stroke();
        }
      }
    };

    const animate = (time: number) => {
      if (!running) return;
      if (time - lastFrame >= FRAME_INTERVAL) {
        lastFrame = time;
        draw(time);
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    };

    const start = () => {
      if (reducedMotion || running || !visible || document.visibilityState !== "visible") return;
      running = true;
      lastFrame = 0;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "100px" },
    );

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();

    if (reducedMotion) {
      draw(0);
    } else {
      start();
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-signal-canvas" aria-hidden="true" />;
}
