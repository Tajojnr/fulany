// hooks/useScrollFrame.ts
"use client";

import { useEffect, useState, type RefObject } from "react";

export function useScrollFrame(
  containerRef: RefObject<HTMLElement | null>,
  frameCount: number
) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || frameCount < 1) return;

    let raf = 0;
    let listening = false;
    let lastFrame = -1;

    const update = () => {
      raf = 0;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.min(
        1,
        Math.max(0, -el.getBoundingClientRect().top / scrollable)
      );
      const frame = Math.min(frameCount - 1, Math.floor(progress * frameCount));

      if (frame !== lastFrame) {
        lastFrame = frame;
        setCurrentFrame(frame);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const listen = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      schedule();
    };

    const unlisten = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      update(); // settle on the true first/last frame after a fast fling
    };

    // Only do scroll work while this section is within one screen of the viewport
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? listen() : unlisten()),
      { rootMargin: "100% 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef, frameCount]);

  return currentFrame;
}