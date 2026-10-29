// lib/products.ts
export type Product = {
  id: string;
  name: string;
  size: string;
  price: number;
  image: string;
  description: string;
  tag: string;
  benefits: string[];
};

export const MAX_QTY = 10;

export const PRODUCTS: Product[] = [
  {
    id: "hair-oil",
    name: "Fulany Hair Oil",
    size: "50ml",
    price: 1500,
    image: "/oil.png",
    description:
      "Pure West African botanical infusion designed to seal moisture, nourish the scalp, and promote natural shine without heaviness.",
    tag: "Daily Scalp Care",
    benefits: ["Lightweight Sealant", "Cold-Pressed Botanicals", "Promotes Growth"],
  },
  {
    id: "hair-elixir",
    name: "Fulany Hair Elixir",
    size: "100ml",
    price: 3000,
    image: "/elixir.png",
    description:
      "Concentrated botanical elixir engineered for deep follicle revitalization, edge restoration, and lasting moisture lock.",
    tag: "Best Seller",
    benefits: ["Edge Restoration", "Follicle Revival", "Deep Absorption"],
  },
  {
    id: "hair-butter",
    name: "Fulany Hair Butter",
    size: "200g",
    price: 6000,
    image: "/butter.png",
    description:
      "Rich, velvety whipped butter formulation crafting an impenetrable moisture seal for textured, dry, or chemically treated hair.",
    tag: "Moisture Lock",
    benefits: ["Intense Hydration", "Whipped Texture", "Shea & Herbal Core"],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);