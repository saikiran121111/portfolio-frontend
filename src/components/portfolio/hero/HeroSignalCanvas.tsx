"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

const FRAME_INTERVAL = 1000 / 24;

function pathGeometry(width: number, height: number) {
  return {
    stages: [
      { x: width * 0.12, y: height * 0.72 },
      { x: width * 0.5, y: height * 0.5 },
      { x: width * 0.86, y: height * 0.28 },
    ] satisfies Point[],
    controls: [
      { x: width * 0.3, y: height * 0.7 },
      { x: width * 0.7, y: height * 0.32 },
    ] satisfies Point[],
  };
}

function quadraticPoint(start: Point, control: Point, end: Point, progress: number) {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
    y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
  };
}

function pointOnPath(stages: Point[], controls: Point[], progress: number) {
  if (progress <= 0.5) {
    return quadraticPoint(stages[0], controls[0], stages[1], progress * 2);
  }

  return quadraticPoint(stages[1], controls[1], stages[2], (progress - 0.5) * 2);
}

export default function HeroSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let lastFrame = 0;
    let visible = true;
    let running = false;
    let width = 0;
    let height = 0;
    const pointer = { progress: 0, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawPath = (stages: Point[], controls: Point[]) => {
      context.beginPath();
      context.moveTo(stages[0].x, stages[0].y);
      context.quadraticCurveTo(controls[0].x, controls[0].y, stages[1].x, stages[1].y);
      context.quadraticCurveTo(controls[1].x, controls[1].y, stages[2].x, stages[2].y);
      context.strokeStyle = "rgba(194, 148, 81, 0.28)";
      context.lineWidth = 1.5;
      context.setLineDash([6, 8]);
      context.stroke();
      context.setLineDash([]);
    };

    const drawProgress = (stages: Point[], controls: Point[], progress: number) => {
      const steps = 36;
      context.beginPath();
      for (let step = 0; step <= Math.ceil(steps * progress); step += 1) {
        const point = pointOnPath(stages, controls, Math.min(progress, step / steps));
        if (step === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.strokeStyle = "rgba(225, 177, 91, 0.62)";
      context.lineWidth = 2;
      context.stroke();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const { stages, controls } = pathGeometry(width, height);
      const progress = pointer.active ? pointer.progress : (time * 0.000085) % 1;

      drawPath(stages, controls);
      drawProgress(stages, controls, progress);

      stages.forEach((stage, index) => {
        context.beginPath();
        context.arc(stage.x, stage.y, index === 2 ? 6 : 4.5, 0, Math.PI * 2);
        context.fillStyle = index === 2 ? "rgba(225, 177, 91, 0.96)" : "rgba(12, 12, 12, 0.96)";
        context.fill();
        context.strokeStyle = index === 2 ? "rgba(225, 177, 91, 0.92)" : "rgba(194, 148, 81, 0.72)";
        context.lineWidth = 1.5;
        context.stroke();
      });

      const signal = pointOnPath(stages, controls, progress);
      context.beginPath();
      context.arc(signal.x, signal.y, 3.5, 0, Math.PI * 2);
      context.fillStyle = "rgba(245, 211, 143, 1)";
      context.fill();
      context.beginPath();
      context.arc(signal.x, signal.y, 10, 0, Math.PI * 2);
      context.strokeStyle = "rgba(225, 177, 91, 0.2)";
      context.lineWidth = 1;
      context.stroke();
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
      if (running || !visible || document.visibilityState !== "visible") return;
      running = true;
      lastFrame = 0;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.progress = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointer.active = true;
      draw(performance.now());
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
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
    draw(0);
    start();

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
