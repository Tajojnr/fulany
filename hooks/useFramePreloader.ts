// hooks/useFramePreloader.ts
"use client";

import { useEffect, useRef, useState } from "react";

interface UseFramePreloaderOptions {
  folderPath?: string;
  totalFrames?: number;
  basePath?: string;
  extension?: string;
  batchSize?: number;
  enabled?: boolean;
}

export function useFramePreloader(
  options?: UseFramePreloaderOptions | string | number,
  folderPathArg?: string,
  enabledArg: boolean = true
) {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Normalise all supported call styles:
  //   useFramePreloader("/frames")
  //   useFramePreloader({ folderPath, totalFrames })
  //   useFramePreloader(frameCount, folderPath, enabled)
  let opts: UseFramePreloaderOptions;
  if (typeof options === "number") {
    opts = { totalFrames: options, folderPath: folderPathArg, enabled: enabledArg };
  } else if (typeof options === "string") {
    opts = { folderPath: options, enabled: enabledArg };
  } else {
    opts = { enabled: enabledArg, ...(options ?? {}) };
  }

  const folderPath = opts.folderPath || opts.basePath || "/frames";
  const totalFrames = opts.totalFrames || 121;
  const ext = opts.extension || "webp";
  const enabled = opts.enabled ?? true;

  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    const loadedImages: HTMLImageElement[] = new Array(totalFrames);
    let count = 0;

    setIsLoaded(false);
    setLoadedCount(0);

    const cleanFolder = folderPath.endsWith("/") ? folderPath.slice(0, -1) : folderPath;

    const handleDone = () => {
      if (!isMounted) return;
      count++;
      setLoadedCount(count);
      if (count === totalFrames) setIsLoaded(true);
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(4, "0");
      img.onload = handleDone;
      img.onerror = handleDone;
      img.src = `${cleanFolder}/frame-${frameNum}.${ext}`;
      loadedImages[i] = img;
    }

    imagesRef.current = loadedImages;
    setFrames(loadedImages);

    return () => {
      isMounted = false;
    };
  }, [folderPath, totalFrames, ext, enabled]);

  const progress = totalFrames > 0 ? (loadedCount / totalFrames) * 100 : 0;

  return {
    frames,
    images: frames,
    imagesRef,
    isLoaded,
    isReady: isLoaded,
    progress,
    loadProgress: progress,
    loadedCount,
  };
}