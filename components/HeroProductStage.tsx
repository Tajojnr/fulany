// components/HeroProductStage.tsx
'use client';

import { useState } from 'react';
import { Sparkles, ShieldCheck, Leaf, ArrowUpRight } from 'lucide-react';

const HERO_FORMULAS = [
  {
    id: 'hair-elixir',
    name: 'Hair Elixir',
    subtitle: 'Weekly Treatment',
    size: '100ml',
    price: 3000,
    badge: 'Concentrated',
    highlights: ['Moroccan Argan', 'Rosemary Oil', 'Hibiscus Extract'],
    imageLabel: 'Hair Elixir Bottle',
    accentColor: '#d4af37',
    description: 'Leave in overnight under silk for deep root repair.',
  },
  {
    id: 'hair-butter',
    name: 'Hair Butter',
    subtitle: 'The Moisture Seal',
    size: '200g',
    price: 6000,
    badge: 'Rich Whipped Shea',
    highlights: ['Raw Shea Butter', 'Neem Infusion', 'Harmattan Shield'],
    imageLabel: 'Whipped Shea Jar',
    accentColor: '#e5c378',
    description: 'Melt between palms for split ends, edges, and twists.',
  },
  {
    id: 'hair-oil',
    name: 'Hair Oil',
    subtitle: 'Daily Ritual',
    size: '50ml',
    price: 1500,
    badge: 'Lightweight',
    highlights: ['Scalp Stimulation', 'Natural Slip', 'Daily Shine'],
    imageLabel: 'Daily Oil Bottle',
    accentColor: '#c9a86a',
    description: 'Warm two to four drops. Body heat is the first ingredient.',
  },
];

export function HeroProductStage({
  onAddToCart,
}: {
  onAddToCart: (id: string) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProduct = HERO_FORMULAS[activeIdx];

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* 1. Volumetric Golden Stage Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-tr from-[#d4af37]/25 via-[#f3e0aa]/10 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* 2. Floating Botanical Badges */}
      <div className="absolute -top-4 right-2 md:right-8 z-20 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#d4af37]/30 px-3.5 py-1.5 rounded-full text-[11px] text-[#f3e0aa] shadow-xl">
        <Leaf className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>100% West African Botanicals</span>
      </div>

      <div className="absolute bottom-16 -left-2 md:-left-6 z-20 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[11px] text-neutral-300 shadow-xl">
        <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>Hand-Poured · Nigeria</span>
      </div>

      {/* 3. Main Stage Container */}
      <div className="relative z-10 w-full max-w-md aspect-[4/5] bg-gradient-to-b from-neutral-900/40 via-neutral-950/80 to-[#070605] border border-white/10 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-xl shadow-2xl shadow-black/80 hover:border-[#d4af37]/40 transition-all duration-700 group">
        
        {/* Top Header inside Stage */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              {activeProduct.subtitle}
            </span>
            <h3 className="text-2xl font-serif text-white tracking-wide">
              {activeProduct.name}
            </h3>
          </div>
          <span className="text-xs font-mono text-[#f3e0aa] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/20">
            {activeProduct.size}
          </span>
        </div>

        {/* Product Visual Centerpiece */}
        <div className="relative my-auto flex flex-col items-center justify-center py-6">
          {/* Subtle Ambient Light Floor */}
          <div className="absolute bottom-2 w-48 h-8 bg-[#d4af37]/20 rounded-full blur-xl transform scale-y-50" />

          {/* Floating Product Silhouette/Bottle Frame */}
          <div className="relative w-44 h-56 md:w-52 md:h-64 rounded-2xl bg-gradient-to-b from-[#241f17] to-[#0d0b09] border border-[#d4af37]/30 flex flex-col items-center justify-center text-center p-6 shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-[#d4af37]" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#f3e0aa] font-serif mb-1">
              Fulany.ng
            </span>
            <span className="text-lg font-serif italic text-white mb-2">
              {activeProduct.name}
            </span>
            <div className="w-8 h-[1px] bg-[#d4af37]/40 my-2" />
            <span className="text-[10px] text-neutral-400 font-mono">
              {activeProduct.size} · ₦{activeProduct.price.toLocaleString()}
            </span>
          </div>

          {/* Key Ingredient Tags */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-6">
            {activeProduct.highlights.map((h) => (
              <span
                key={h}
                className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-neutral-300"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Stage Footer: Quick Action & Selector */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xl font-serif text-[#d4af37]">
              ₦{activeProduct.price.toLocaleString()}
            </span>
            <button
              onClick={() => onAddToCart(activeProduct.id)}
              className="px-5 py-2.5 rounded-full gold-button-gradient text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer gold-border-glow"
            >
              Add to Bag <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Tabs to Switch Hero Product */}
          <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
            {HERO_FORMULAS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                className={`py-1.5 text-[10px] uppercase tracking-wider rounded-lg font-medium transition-all ${
                  activeIdx === idx
                    ? 'bg-[#d4af37] text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.name.replace('Hair ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}