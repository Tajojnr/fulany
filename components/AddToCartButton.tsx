// components/AddToCartButton.tsx
"use client";

import { useCart } from "@/context/CartContext";

interface ProductProp {
  id?: string;
  slug?: string;
  name: string;
  size: string;
  price: number;
}

export function AddToCartButton({ product }: { product: ProductProp }) {
  const { addToCart } = useCart();

  const itemId = product.id || product.slug || product.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <button
      onClick={() =>
        addToCart({
          id: itemId,
          slug: product.slug || itemId,
          name: product.name,
          size: product.size,
          price: product.price,
          quantity: 1,
        })
      }
      className="w-full border border-gold bg-gold/10 py-3 text-xs uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-ink"
    >
      Add to Bag
    </button>
  );
}