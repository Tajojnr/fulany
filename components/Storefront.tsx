// components/Storefront.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Sparkles,
  Check,
  ShieldCheck,
  Droplets,
  Leaf,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import { ScrollHero } from "@/components/ScrollHero";
import { CinematicProductScroll } from "@/components/CinematicProductScroll";
import { PRODUCTS, MAX_QTY, getProduct } from "@/lib/products";
import type { CartItem } from "@/lib/whatsapp";

const CART_KEY = "fulany-cart-v1";

/** Rebuild the cart from storage using OUR prices, never the stored ones. */
function restoreCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const items: CartItem[] = [];
  for (const entry of raw) {
    const product = getProduct(entry?.id);
    const qty = Number(entry?.quantity);
    if (!product || !Number.isFinite(qty) || qty < 1) continue;
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.size,
      quantity: Math.min(Math.floor(qty), MAX_QTY),
    });
  }
  return items;
}

export function Storefront() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore the bag after a refresh
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(restoreCart(JSON.parse(saved)));
    } catch {
      /* storage blocked or corrupt: start with an empty bag */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, hydrated]);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    []
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((productId: string) => {
    const product = getProduct(productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QTY) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          size: product.size,
          quantity: 1,
        },
      ];
    });

    // One timer, always reset: rapid taps can't clear each other's feedback
    setAddedItem(product.id);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAddedItem(null), 1800);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item];
        const next = Math.min(item.quantity + delta, MAX_QTY);
        return next > 0 ? [{ ...item, quantity: next }] : [];
      })
    );
  }, []);

  const addedName = addedItem ? getProduct(addedItem)?.name : null;

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Screen-reader confirmation for "Add to Bag" */}
      <p className="sr-only" role="status" aria-live="polite">
        {addedName ? `${addedName} added to your bag.` : ""}
      </p>

      {/* ── Announcement bar ── */}
      <div className="border-b border-gold/15 bg-[#12100e] px-4 py-2.5 text-center text-[11px] font-light uppercase leading-relaxed tracking-[0.2em] text-gold sm:text-xs sm:tracking-[0.25em]">
        Complimentary Nationwide Delivery On Orders Over ₦10,000
      </div>

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-gold/15 bg-ink/95 backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between px-5 sm:px-6"
        >
          <a href="/" aria-label="Fulany.ng home" className="group flex shrink-0 items-center py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fulany-logo-transparent.webp"
              alt="Fulany.ng"
              width={844}
              height={308}
              decoding="async"
              className="brand-logo-img transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </a>

          <div className="hidden items-center gap-10 md:flex">
            <a
              href="#collection"
              className="text-xs uppercase tracking-[0.2em] text-cream/75 transition-colors hover:text-gold"
            >
              The Collection
            </a>
            <a
              href="#philosophy"
              className="text-xs uppercase tracking-[0.2em] text-cream/75 transition-colors hover:text-gold"
            >
              Our Philosophy
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-[11px] uppercase tracking-widest text-cream/55 sm:inline-block">
              NGN (₦)
            </span>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label={`Open bag, ${totalCartCount} ${totalCartCount === 1 ? "item" : "items"}`}
              className="group flex min-h-11 items-center gap-2.5 rounded-full border border-gold-line bg-[#141210] px-4 transition-colors hover:bg-[#1c1a17]"
            >
              <ShoppingBag className="h-4 w-4 text-gold transition-transform group-hover:scale-110" />
              <span className="text-xs font-medium uppercase tracking-widest text-cream transition-colors group-hover:text-gold">
                Bag ({totalCartCount})
              </span>
            </button>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        {/* Keep exactly one <h1> on the page; it belongs inside ScrollHero */}
        <ScrollHero />

        <CinematicProductScroll
          id="elixir-cinematic"
          folderPath="frames-elixir"
          frameCount={240}
          productName="Fulany Hair Elixir"
          price="₦3,000 / 100ml"
          onBuyClick={() => addToCart("hair-elixir")}
          annotations={[
            {
              id: "e-1",
              startFrame: 30,
              endFrame: 100,
              x: "5%",
              y: "20%",
              title: "Raw Origins",
              description:
                "Cold-pressed West African seeds selected for maximum nutrient retention.",
            },
            {
              id: "e-2",
              startFrame: 120,
              endFrame: 190,
              x: "50%",
              y: "60%",
              title: "Follicle Revival",
              description:
                "Engineered for deep absorption, restoring edges and scalp vitality.",
            },
          ]}
        />

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <CinematicProductScroll
          id="butter-cinematic"
          folderPath="frames-butter"
          frameCount={240}
          productName="Fulany Hair Butter"
          price="₦6,000 / 200g"
          onBuyClick={() => addToCart("hair-butter")}
          annotations={[
            {
              id: "b-1",
              startFrame: 40,
              endFrame: 110,
              x: "50%",
              y: "15%",
              title: "Whipped Velour",
              description:
                "Unrefined shea and herbal matrices whipped into a velvet texture.",
            },
            {
              id: "b-2",
              startFrame: 130,
              endFrame: 200,
              x: "5%",
              y: "65%",
              title: "Impenetrable Seal",
              description:
                "Locks in deep moisture against harsh, dry environmental stressors.",
            },
          ]}
        />

        {/* ── Collection ── */}
        <section
          id="collection"
          aria-labelledby="collection-heading"
          className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28"
        >
          <div className="mx-auto mb-14 max-w-2xl space-y-4 text-center md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-line bg-gold-soft px-3.5 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-[0.3em]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Handcrafted Botanical Formulations
            </div>
            <h2 id="collection-heading" className="text-4xl md:text-6xl">
              The Botanical Trio
            </h2>
            <p className="text-base font-light leading-relaxed text-cream/70">
              Formulated in Nigeria with raw cold-pressed oils and herbal butter matrices designed to warm, nourish, and seal your hair.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PRODUCTS.map((product) => {
              const isJustAdded = addedItem === product.id;

              return (
                <li
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gold/15 bg-[#0d0c0b] p-6 transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,164,92,0.1)]"
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <span className="rounded border border-gold-line bg-gold-soft px-2.5 py-1 text-[11px] uppercase tracking-widest text-gold">
                        {product.tag}
                      </span>
                      <span className="text-xs tabular-nums text-cream/60">
                        {product.size}
                      </span>
                    </div>

                    <div className="relative my-4 h-64 w-full overflow-hidden rounded-xl bg-radial from-white/5 to-transparent">
                      <Image
                        src={product.image}
                        alt={`${product.name}, ${product.size}`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-contain p-4 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="mt-4 text-2xl transition-colors group-hover:text-gold">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-cream/70">
                      {product.description}
                    </p>

                    <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                      {product.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2 text-xs text-cream/70"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-gold/10 pt-5">
                    <div>
                      <span className="block text-xs text-cream/60">Price</span>
                      <span className="text-2xl font-medium tabular-nums text-gold">
                        ₦{product.price.toLocaleString("en-NG")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product.id)}
                      aria-label={`Add ${product.name} to bag`}
                      className={`flex min-h-12 items-center gap-2 rounded-lg px-5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                        isJustAdded
                          ? "bg-cream text-ink"
                          : "bg-gold text-ink hover:bg-gold/90"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="h-4 w-4" aria-hidden="true" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add to Bag
                        </>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Philosophy ── */}
        <section
          id="philosophy"
          aria-label="Our philosophy"
          className="relative border-y border-gold/10 bg-[#0a0908] px-5 py-20 sm:px-6 md:py-28"
        >
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                Icon: Droplets,
                title: "Cold-Pressed Oils",
                text: "Unrefined, botanical oils extracted without high heat to retain native vitamins and potent antioxidants.",
              },
              {
                Icon: Leaf,
                title: "West African Botanicals",
                text: "Rooted in Nigerian heritage routines, crafted by Hafsah Sani to protect textured and delicate tresses.",
              },
              {
                Icon: ShieldCheck,
                title: "Moisture Lock Seal",
                text: "Formulated to warm into the hair shaft, hydrate deeply, and seal cuticles against dry environmental stressors.",
              },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center space-y-3 text-center">
                <div className="rounded-full border border-gold-line bg-gold-soft p-4 text-gold">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-2xl">{title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-cream/70">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={cart}
        updateQuantity={updateQuantity}
      />

      <Footer />
    </div>
  );
}