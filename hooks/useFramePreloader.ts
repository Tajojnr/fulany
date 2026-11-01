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
  priorityFrame?: number;
};

type FrameLoader = {
  images: HTMLImageElement[];
  loadedMask: boolean[];
  queue: number[];
  requested: Set<number>;
  loading: Set<number>;
  activeLoads: number;
  retain: (indices: number[]) => void;
  pump: () => void;
};

const INITIAL_FRAME_COUNT = 5;
const MAX_CONCURRENT_LOADS = 4;
const PRELOAD_AHEAD = 4;
const PRELOAD_BEHIND = 2;

export function useFramePreloader(
  frameCountOrOptions?: number | UseFramePreloaderOptions | string,
  folderPathArg?: string,
  enabledArg: boolean = true,
  priorityFrameArg: number = 0
) {
  const [loadedMask, setLoadedMask] = useState<boolean[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loaderRef = useRef<FrameLoader | null>(null);

  const options: UseFramePreloaderOptions =
    typeof frameCountOrOptions === "number"
      ? { totalFrames: frameCountOrOptions, folderPath: folderPathArg, enabled: enabledArg }
      : typeof frameCountOrOptions === "string"
      ? { folderPath: frameCountOrOptions, enabled: enabledArg }
      : frameCountOrOptions || {};

  const totalFrames = options.totalFrames ?? options.frameCount ?? 121;
  const folderPath = options.folderPath ?? options.basePath ?? "/frames";
  const extension = options.extension ?? "webp";
  const enabled = options.enabled ?? true;
  const priorityFrame = options.priorityFrame ?? priorityFrameArg;

  useEffect(() => {
    if (!enabled || totalFrames <= 0) {
      imagesRef.current = [];
      loaderRef.current = null;
      setLoadedMask([]);
      setLoadedCount(0);
      setIsLoaded(false);
      return;
    }

    let count = 0;
    const cleanFolder = folderPath.endsWith("/") ? folderPath.slice(0, -1) : folderPath;
    const loadedImages = Array.from({ length: totalFrames }, () => new Image());
    const mask = new Array(totalFrames).fill(false);
    const initialFrameCount = Math.min(INITIAL_FRAME_COUNT, totalFrames);

    imagesRef.current = loadedImages;
    setLoadedMask(mask);
    setLoadedCount(0);
    setIsLoaded(false);

    let loader!: FrameLoader;

    const markLoaded = (index: number, image: HTMLImageElement) => {
      if (
        loaderRef.current !== loader ||
        loader.images[index] !== image ||
        !loader.loading.delete(index)
      ) {
        return;
      }

      loader.activeLoads--;
      loader.loadedMask[index] = true;
      count++;
      setLoadedCount(count);
      setLoadedMask([...loader.loadedMask]);
      if (loader.loadedMask.slice(0, initialFrameCount).every(Boolean)) {
        setIsLoaded(true);
      }
      loader.pump();
    };

    loader = {
      images: loadedImages,
      loadedMask: mask,
      queue: [],
      requested: new Set<number>(),
      loading: new Set<number>(),
      activeLoads: 0,
      retain: (indices) => {
        const keep = new Set(indices);
        let changedLoadedMask = false;

        for (let index = 0; index < loader.images.length; index++) {
          if (!loader.requested.has(index) || keep.has(index)) continue;

          const image = loader.images[index];
          image.onload = null;
          image.onerror = null;
          if (loader.loading.delete(index)) loader.activeLoads--;
          image.src = "";
          loader.images[index] = new Image();
          loader.requested.delete(index);
          changedLoadedMask ||= loader.loadedMask[index];
          loader.loadedMask[index] = false;
        }

        if (changedLoadedMask) setLoadedMask([...loader.loadedMask]);
      },
      pump: () => {
        while (
          loader.activeLoads < MAX_CONCURRENT_LOADS &&
          loader.queue.length > 0
        ) {
          const index = loader.queue.shift()!;
          if (loader.requested.has(index)) continue;

          loader.requested.add(index);
          loader.loading.add(index);
          loader.activeLoads++;
          const image = loader.images[index];
          image.decoding = "async";
          image.onload = () => markLoaded(index, image);
          image.onerror = () => markLoaded(index, image);
          const frameNum = String(index + 1).padStart(4, "0");
          image.src = `${cleanFolder}/frame-${frameNum}.${extension}`;
        }
      },
    };
    loaderRef.current = loader;

    return () => {
      if (loaderRef.current === loader) loaderRef.current = null;
      for (const image of loadedImages) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [enabled, totalFrames, folderPath, extension]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!enabled || !loader || totalFrames <= 0) return;

    const target = Math.min(totalFrames - 1, Math.max(0, Math.floor(priorityFrame)));
    const frameOrder = [target];
    for (let offset = 1; offset <= PRELOAD_AHEAD; offset++) {
      if (target + offset < totalFrames) frameOrder.push(target + offset);
    }
    for (let offset = 1; offset <= PRELOAD_BEHIND; offset++) {
      if (target - offset >= 0) frameOrder.push(target - offset);
    }

    const initialFrames = Array.from(
      { length: Math.min(INITIAL_FRAME_COUNT, totalFrames) },
      (_, index) => index
    );
    const priorityFrames = [...new Set([target, ...initialFrames, ...frameOrder])];
    loader.retain(priorityFrames);
    loader.queue = priorityFrames.filter(
      (index) => !loader.requested.has(index)
    );
    loader.pump();
  }, [enabled, totalFrames, priorityFrame, folderPath, extension]);

  const initialFrameCount = Math.min(INITIAL_FRAME_COUNT, totalFrames);
  const initialLoadedCount = loadedMask
    .slice(0, initialFrameCount)
    .filter(Boolean).length;
  const progress =
    initialFrameCount > 0
      ? Math.round((initialLoadedCount / initialFrameCount) * 100)
      : 0;

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