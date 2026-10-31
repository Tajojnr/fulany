// components/ScrollHero.tsx
"use client";

import { useRef } from "react";
import { useFramePreloader } from "@/hooks/useFramePreloader";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import { FrameCanvas } from "@/components/FrameCanvas";

const TOTAL_FRAMES = 61;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function HeroCopy({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center" style={style}>
      <p className="text-xs uppercase tracking-[0.4em] text-gold">Warm • Work • Seal</p>
      <h1 className="text-balance text-5xl leading-[1.05] drop-shadow-xl md:text-7xl">
        Pure West African Hair Alchemy
      </h1>
      <p className="mx-auto max-w-lg text-base font-light leading-relaxed tracking-wide text-cream/80 drop-shadow-md">
        Scroll down to reveal the botanical transformation crafted by Hafsah Sani.
      </p>
    </div>
  );
}

export function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);
  const { images, progress, isLoaded } = useFramePreloader(TOTAL_FRAMES, "frames");
  const currentFrame = useScrollFrame(containerRef, TOTAL_FRAMES);

  /* ───────── Instant Scroll-scrubbed version ───────── */
  const progressFraction = currentFrame / Math.max(TOTAL_FRAMES - 1, 1);
  const copyOpacity = clamp01(1 - (progressFraction - 0.08) / 0.27);
  const hintVisible = currentFrame < 4;

  return (
    <section
      ref={containerRef}
      aria-label="Introduction"
      className="relative h-[250svh] bg-ink"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Instant Canvas Render */}
        <FrameCanvas images={images} currentFrame={currentFrame} />

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink via-ink/20 to-ink/60" />

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center px-6 md:px-16">
          <HeroCopy style={{ opacity: copyOpacity }} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
          <span
            aria-hidden="true"
            className={`block text-[11px] uppercase tracking-[0.25em] text-cream/70 transition-opacity duration-500 ${
              hintVisible ? "animate-bounce opacity-100" : "opacity-0"
            }`}
          >
            Scroll to Explore ↓
          </span>
        </div>

        {!isLoaded && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-30 h-0.5 bg-white/10">
            <div
              className="h-full bg-gold transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}