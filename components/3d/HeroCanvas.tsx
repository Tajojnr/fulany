// components/3d/HeroCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle background logic
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * -0.4 - 0.1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial Gold Gradient Accent
      const gradient = ctx.createRadialGradient(
        width * 0.75,
        height * 0.4,
        50,
        width * 0.75,
        height * 0.4,
        Math.max(width, height) * 0.6
      );
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.12)');
      gradient.addColorStop(0.5, 'rgba(18, 16, 14, 0.4)');
      gradient.addColorStop(1, 'rgba(7, 6, 5, 1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle floating botanical dust
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 213, 163, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}