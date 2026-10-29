// components/FrameCanvas.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";

interface FrameCanvasProps {
  images: HTMLImageElement[];
  currentFrame: number;
}

const MAX_DPR = 1.5; // sharp enough, far lighter than 2-3x on phones

// Plain boolean (not a type guard), so TypeScript never narrows the image to `never`
const isReady = (img?: HTMLImageElement): boolean =>
  !!img && img.complete && img.naturalWidth > 0;

export function FrameCanvas({ images, currentFrame }: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const imagesRef = useRef(images);
  const frameRef = useRef(currentFrame);
  const lastDrawnRef = useRef<HTMLImageElement | null>(null);

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const { w, h } = sizeRef.current;
    const list = imagesRef.current;
    if (!ctx || !w || !h || list.length === 0) return;

    const target = Math.min(Math.max(frameRef.current, 0), list.length - 1);

    // Exact frame if loaded; otherwise the nearest earlier one, then a later one.
    // The viewer never sees a black or stale canvas while frames stream in.
    let img: HTMLImageElement | undefined;
    for (let i = target; i >= 0 && !img; i--) {
      const c = list[i];
      if (c && isReady(c)) img = c;
    }
    for (let i = target + 1; i < list.length && !img; i++) {
      const c = list[i];
      if (c && isReady(c)) img = c;
    }
    if (!img || img === lastDrawnRef.current) return;

    // "cover" fit: always fills the canvas, so no clearing pass is needed
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let renderW = w;
    let renderH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (w / h > imgAspect) {
      renderH = w / imgAspect;
      offsetY = (h - renderH) / 2;
    } else {
      renderW = h * imgAspect;
      offsetX = (w - renderW) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    lastDrawnRef.current = img;
  }, []);

  const resize = useCallback(
    (cssW: number, cssH: number) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const w = Math.round(cssW);
      const h = Math.round(cssH);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const prev = sizeRef.current;
      if (w === prev.w && h === prev.h && dpr === prev.dpr) return;

      sizeRef.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr); // this clears the canvas...
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // ...and resets the context
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";

      lastDrawnRef.current = null;
      draw(); // ...so repaint in the same frame: nothing flickers
    },
    [draw]
  );

  // Set up once: context + a ResizeObserver on the canvas's own CSS box
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d", { alpha: false });

    const observer = new ResizeObserver(([entry]) => {
      resize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      // Safari keeps canvas backing stores alive after unmount; shrinking releases them
      canvas.width = 0;
      canvas.height = 0;
      ctxRef.current = null;
      sizeRef.current = { w: 0, h: 0, dpr: 1 };
      lastDrawnRef.current = null;
    };
  }, [resize]);

  // Paint whenever the frame changes, and again if the wanted frame finishes loading late
  useEffect(() => {
    imagesRef.current = images;
    frameRef.current = currentFrame;
    draw();

    const wanted = images[currentFrame];
    if (wanted && !isReady(wanted)) {
      wanted.addEventListener("load", draw, { once: true });
      return () => wanted.removeEventListener("load", draw);
    }
  }, [images, currentFrame, draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}