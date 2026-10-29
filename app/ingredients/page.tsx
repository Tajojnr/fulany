// app/ingredients/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Droplets, Leaf, Sun, ShieldCheck } from "lucide-react";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Our Ingredients",
  description:
    "Cold-pressed oils, unrefined West African shea and indigenous herbs: what goes into every Fulany.ng formula, and what never does.",
  alternates: { canonical: "/ingredients" },
};

const PILLARS = [
  {
    Icon: Droplets,
    title: "100% Cold-Pressed Extractions",
    text: "Heat destroys nutrients. All our base carrier oils are strictly cold-pressed. This method ensures that the delicate fatty acids, vitamins, and antioxidants remain entirely intact, providing your hair follicles with uncompromised nourishment.",
  },
  {
    Icon: Sun,
    title: "Unrefined West African Shea",
    text: "Our hair butter utilizes Grade-A unrefined shea butter sourced directly from Nigerian local cooperatives. Unrefined shea maintains its characteristic earthy aroma and ivory hue, signaling the presence of healing botanical compounds.",
  },
  {
    Icon: Leaf,
    title: "Indigenous Herbal Matrices",
    text: "We incorporate ancestral hair secrets—infusing indigenous herbs that have protected the tresses of West African women for centuries. These herbs fortify the hair shaft and act as a powerful barrier against dry environmental stressors.",
  },
  {
    Icon: ShieldCheck,
    title: "Zero Harsh Synthetics",
    text: "Formulated without sulfates, parabens, mineral oil, or artificial drying alcohols. Our preservation focuses on natural vitamin E and airtight amber glass packaging to prevent oxidation naturally.",
  },
];

export default function IngredientsPage() {
  return (
    <>
      <SubpageHeader />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-4xl px-5 py-16 outline-none sm:px-6 md:py-24"
      >
        <header className="mb-16 space-y-6 text-center md:mb-24">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
            Our Sourcing Promise
          </p>
          <h1 className="text-5xl leading-[1.05] md:text-7xl">Our Ingredients</h1>
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-cream/75">
            At Fulany.ng, we believe that true hair alchemy begins at the root of the ingredient. Hafsah Sani personally ensures that every botanical, oil, and butter is ethically sourced from West Africa and cold-pressed to retain its native vitality.
          </p>
        </header>

        <ul className="mb-16 grid grid-cols-1 gap-6 md:mb-24 md:grid-cols-2 md:gap-8">
          {PILLARS.map(({ Icon, title, text }) => (
            <li
              key={title}
              className="rounded-2xl border border-gold/15 bg-[#0d0c0b] p-8"
            >
              <Icon className="mb-6 h-8 w-8 text-gold" aria-hidden="true" />
              <h2 className="mb-3 text-3xl">{title}</h2>
              <p className="text-sm font-light leading-relaxed text-cream/75 md:text-base">
                {text}
              </p>
            </li>
          ))}
        </ul>

        <figure className="border-y border-gold/20 bg-[radial-gradient(ellipse_at_center,rgba(201,164,92,0.05)_0%,transparent_100%)] px-6 py-12 text-center">
          <blockquote className="font-display text-2xl italic text-gold md:text-3xl">
            “If it cannot nourish the earth, it has no place in your hair.”
          </blockquote>
          <figcaption className="mt-4 text-xs uppercase tracking-widest text-cream/60">
            — Hafsah Sani
          </figcaption>
        </figure>

        <div className="mt-14 text-center">
          <Link
            href="/#collection"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gold px-8 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold/90"
          >
            Shop the collection
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}