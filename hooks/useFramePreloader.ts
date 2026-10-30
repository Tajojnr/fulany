// hooks/useFramePreloader.ts
"use client";

import { useEffect, useRef, useState } from "react";

type UseFramePreloaderOptions = {
  totalFrames?: number;
  frameCount?: number;
  folderPath?: string;
  basePath?: string;
  extension?: string;
  enabled?: boolean;
};

export function useFramePreloader(
  frameCountOrOptions?: number | UseFramePreloaderOptions | string,
  folderPathArg?: string,
  enabledArg: boolean = true
) {
  const [loadedMask, setLoadedMask] = useState<boolean[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);

  const options: UseFramePreloaderOptions =
    typeof frameCountOrOptions === "number"
      ? { totalFrames: frameCountOrOptions, folderPath: folderPathArg, enabled: enabledArg }
      : typeof frameCountOrOptions === "string"
      ? { folderPath: frameCountOrOptions }
      : frameCountOrOptions || {};

  const totalFrames = options.totalFrames ?? options.frameCount ?? 121;
  const folderPath = options.folderPath ?? options.basePath ?? "/frames";
  const extension = options.extension ?? "webp";
  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled || totalFrames <= 0) return;

    let cancelled = false;
    let count = 0;
    const cleanFolder = folderPath.endsWith("/") ? folderPath.slice(0, -1) : folderPath;

    const loadedImages: HTMLImageElement[] = Array.from({ length: totalFrames }, () => new Image());
    const mask = new Array(totalFrames).fill(false);

    imagesRef.current = loadedImages;
    setLoadedMask(mask);
    setLoadedCount(0);
    setIsLoaded(false);

    const markLoaded = (index: number) => {
      if (cancelled) return;
      mask[index] = true;
      count++;
      setLoadedCount(count);
      setLoadedMask([...mask]);
      if (count >= totalFrames) setIsLoaded(true);
    };

    const loadFrame = (i: number) => {
      if (loadedImages[i].src) return;
      const img = loadedImages[i];
      img.decoding = "async";
      img.onload = () => markLoaded(i);
      img.onerror = () => markLoaded(i);
      const frameNum = String(i + 1).padStart(4, "0");
      img.src = `${cleanFolder}/frame-${frameNum}.${extension}`;
    };

    // PHASE 1: Load First 5 frames immediately (Instant zero-second start)
    for (let i = 0; i < Math.min(5, totalFrames); i++) {
      loadFrame(i);
    }

    // PHASE 2: Load Keyframes across the sequence (every 5th frame)
    setTimeout(() => {
      if (cancelled) return;
      for (let i = 5; i < totalFrames; i += 5) {
        loadFrame(i);
      }
    }, 50);

    // PHASE 3: Fill in remaining intermediate frames
    setTimeout(() => {
      if (cancelled) return;
      for (let i = 0; i < totalFrames; i++) {
        loadFrame(i);
      }
    }, 200);

    return () => {
      cancelled = true;
    };
  }, [enabled, totalFrames, folderPath, extension]);

  const progress = totalFrames > 0 ? Math.round((loadedCount / totalFrames) * 100) : 0;

  return {
    frames: imagesRef.current,
    images: imagesRef.current,
    imagesRef,
    loadedMask,
    isLoaded,
    progress,
    loadedCount,
  };
}