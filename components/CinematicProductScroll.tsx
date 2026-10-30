// components/CinematicProductScroll.tsx
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useFramePreloader } from "@/hooks/useFramePreloader";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FrameCanvas } from "@/components/FrameCanvas";

export interface Annotation {
  id: string;
  startFrame: number;
  endFrame: number;
  x: string;
  y: string;
  title: string;
  description: string;
}

interface CinematicStageProps {
  id: string;
  folderPath: string;
  frameCount: number;
  productName: string;
  price: string;
  annotations: Annotation[];
  onBuyClick: () => void;
}

const READY_FRAMES = 5; // Ready almost instantly after first few frames load

const posterSrc = (folderPath: string, frameCount: number) =>
  `/${folderPath}/frame-${String(frameCount).padStart(4, "0")}.webp`;

function Veil() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(8,7,6,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-transparent to-ink/50" />
    </>
  );
}

function AnnotationCard({ title, description }: Pick<Annotation, "title" | "description">) {
  return (
    <div className="rounded-2xl border border-gold-line bg-ink/85 px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.55)] md:backdrop-blur-md">
      <div className="mb-2 flex items-center gap-3" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_var(--color-gold)]" />
        <span className="h-px flex-1 bg-gradient-to-r from-gold/80 to-transparent" />
      </div>
      <p className="font-display text-2xl leading-none text-gold md:text-3xl">{title}</p>
      <p className="mt-2 text-sm font-light leading-relaxed text-cream md:text-base">
        {description}
      </p>
    </div>
  );
}

function PurchaseCard({
  productName,
  price,
  added,
  onClick,
}: {
  productName: string;
  price: string;
  added: boolean;
  onClick: () => void;
}) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-gold-line bg-[#0b0a09]/90 px-6 py-5 text-center shadow-[0_20px_60px_rgba(0,0,0,0.65)] md:backdrop-blur-xl">
      <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-gold">Now Revealed</p>
      <p className="font-display text-3xl leading-tight text-cream">{productName}</p>
      <p className="mt-1 text-sm tabular-nums tracking-wide text-gold md:text-base">{price}</p>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Add ${productName} to bag`}
        className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-medium uppercase tracking-[0.18em] text-ink shadow-[0_0_24px_rgba(201,164,92,0.35)] transition-[background-color,box-shadow] hover:bg-gold/90 hover:shadow-[0_0_36px_rgba(201,164,92,0.55)]"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" aria-hidden="true" /> Added to Bag
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" aria-hidden="true" /> Add to Bag
          </>
        )}
      </button>
    </div>
  );
}

export function CinematicProductScroll({
  id,
  folderPath,
  frameCount,
  productName,
  price,
  annotations,
  onBuyClick,
}: CinematicStageProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isInView, setIsInView] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Static mode ONLY if user explicitly enabled prefers-reduced-motion in OS
  const staticMode = reducedMotion;

  // Start loading when the section is near, then stop watching
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    []
  );

  const { images, isLoaded, progress, loadedCount } = useFramePreloader(
    frameCount,
    folderPath,
    isInView && !staticMode
  );
  const currentFrame = useScrollFrame(containerRef, frameCount);

  // The CTA only appears once every annotation has finished, so they never collide
  const lastAnnotationEnd = annotations.reduce((m, a) => Math.max(m, a.endFrame), 0);
  const ctaStart = Math.min(
    frameCount - 1,
    Math.max(Math.floor(frameCount * 0.72), lastAnnotationEnd + 1)
  );
  const showCta = currentFrame >= ctaStart;
  const ready = loadedCount >= Math.min(READY_FRAMES, frameCount);

  const handleBuy = () => {
    onBuyClick();
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
  };

  /* ───────── Still version (reduced motion only) ───────── */
  if (staticMode) {
    return (
      <section
        ref={containerRef}
        id={id}
        aria-label={productName}
        className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterSrc(folderPath, frameCount)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Veil />
        <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-md flex-col justify-end gap-4 px-4 py-20">
          <h2 className="sr-only">{productName}</h2>
          {annotations.map((ann) => (
            <AnnotationCard key={ann.id} title={ann.title} description={ann.description} />
          ))}
          <PurchaseCard
            productName={productName}
            price={price}
            added={added}
            onClick={handleBuy}
          />
        </div>
      </section>
    );
  }

  /* ───────── Scroll-scrubbed version ───────── */
  return (
    <section
      ref={containerRef}
      id={id}
      aria-label={productName}
      className="relative h-[320svh] bg-ink"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
        {/* Screen readers get the content once, in order */}
        <div className="sr-only">
          <h2>{productName}</h2>
          <ul>
            {annotations.map((ann) => (
              <li key={ann.id}>
                {ann.title}. {ann.description}
              </li>
            ))}
          </ul>
        </div>

        {/* Loading: only until first few frames are ready */}
        {isInView && !ready && (
          <div
            role="status"
            className="absolute z-30 flex flex-col items-center gap-3 text-gold"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <span className="text-xs uppercase tracking-[0.25em] tabular-nums">
              Extracting Botanicals {progress}%
            </span>
          </div>
        )}

        {images.length > 0 && <FrameCanvas images={images} currentFrame={currentFrame} />}

        <Veil />

        {/* Annotations */}
        {annotations.map((ann) => {
          const visible =
            !showCta && currentFrame >= ann.startFrame && currentFrame <= ann.endFrame;

          return (
            <div
              key={ann.id}
              aria-hidden="true"
              style={{ "--ann-x": ann.x, "--ann-y": ann.y } as CSSProperties}
              className={`absolute left-4 right-4 top-24 z-20 mx-auto max-w-sm transition-[opacity,transform,visibility] duration-500 ease-out md:left-[var(--ann-x)] md:right-auto md:top-[var(--ann-y)] md:mx-0 md:w-[340px] md:max-w-none ${
                visible
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-4 opacity-0"
              }`}
            >
              <AnnotationCard title={ann.title} description={ann.description} />
            </div>
          );
        })}

        {/* Final CTA */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:pb-20">
          <div
            className={`pointer-events-auto flex w-full justify-center transition-[opacity,transform,visibility] duration-700 ${
              showCta
                ? "visible translate-y-0 opacity-100"
                : "invisible translate-y-8 opacity-0"
            }`}
          >
            <PurchaseCard
              productName={productName}
              price={price}
              added={added}
              onClick={handleBuy}
            />
          </div>
        </div>

        {/* Thin progress line while remaining frames stream in */}
        {ready && !isLoaded && (
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