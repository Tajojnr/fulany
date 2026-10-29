// components/Grain.tsx
export function Grain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.09] mix-blend-overlay">
      <svg
        className="h-full w-full opacity-50 contrast-150 animate-grain"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}