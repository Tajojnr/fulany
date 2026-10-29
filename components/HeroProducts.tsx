// components/HeroProducts.tsx
"use client";
import React from "react";

export function HeroProducts() {
  return (
    <section className="py-20 bg-[#080706] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        {/* Hair Elixir PNG */}
        <div className="flex flex-col items-center text-center group cursor-pointer">
          <div className="relative w-64 h-80 flex items-center justify-center">
            <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/15 transition-all duration-700" />
            <img
              src="/elixir.png"
              alt="Fulany Hair Elixir"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h3 className="text-xl font-serif text-cream mt-6 group-hover:text-gold transition-colors">
            Hair Elixir
          </h3>
          <p className="text-xs text-gold/80 uppercase tracking-widest mt-1">
            100ml — ₦3,000
          </p>
        </div>

        {/* Hair Butter PNG */}
        <div className="flex flex-col items-center text-center group cursor-pointer">
          <div className="relative w-72 h-80 flex items-center justify-center">
            <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/15 transition-all duration-700" />
            <img
              src="/butter.png"
              alt="Fulany Hair Butter"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h3 className="text-xl font-serif text-cream mt-6 group-hover:text-gold transition-colors">
            Hair Butter
          </h3>
          <p className="text-xs text-gold/80 uppercase tracking-widest mt-1">
            200g — ₦6,000
          </p>
        </div>
      </div>
    </section>
  );
}