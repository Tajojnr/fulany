// components/FrameCanvas.tsx
"use client";

import { useEffect, useRef } from "react";

export interface FrameCanvasProps {
  images?: HTMLImageElement[];
  frames?: HTMLImageElement[];
  currentFrame: number;
  isLoaded?: boolean;
  className?: string;
}

export function FrameCanvas({
  images,
  frames,
  currentFrame,
  className = "",
}: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeFrames = images || frames || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeFrames.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find requested frame OR nearest previously loaded frame
    let targetIndex = Math.min(Math.max(0, currentFrame), activeFrames.length - 1);
    let img = activeFrames[targetIndex];

    // Fallback scanner: scan backwards to find closest ready image
    while (targetIndex > 0 && (!img || !img.complete || img.naturalWidth === 0)) {
      targetIndex--;
      img = activeFrames[targetIndex];
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (width === 0 || height === 0) return;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, [activeFrames, currentFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

export default FrameCanvas;