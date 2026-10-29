export type Ingredient = { name: string; latin: string; reason: string };
export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ritual: string;
  size: string;
  price: number;
  category: "oil" | "elixir" | "butter";
  ingredients: Ingredient[];
  scent: string;
  hairTypes: string[];
  image: string;
  gallery: string[];
};

export const products: Product[] = [
  {
    slug: "hair-oil",
    name: "Hair Oil",
    tagline: "The daily ritual.",
    description: "A lightweight botanical blend crafted to lock in moisture, soothe the scalp, and bring a quiet brilliance to your hair every morning.",
    ritual: "Warm two to four drops in the palm; body heat is the first ingredient. Press into the scalp, draw through the lengths.",
    size: "50ml",
    price: 1500,
    category: "oil",
    ingredients: [
      { name: "Hibiscus", latin: "Hibiscus rosa-sinensis", reason: "Stimulates follicles and adds natural slip." },
      { name: "Rosemary", latin: "Salvia rosmarinus", reason: "Encourages circulation at the root." }
    ],
    scent: "Earthy, warm, subtle floral undertones.",
    hairTypes: ["All hair types", "Locs", "Low porosity"],
    image: "/products/oil-hero.jpg",
    gallery: ["/products/oil-1.jpg", "/products/oil-2.jpg"],
  },
  {
    slug: "hair-elixir",
    name: "Hair Elixir",
    tagline: "Weekly treatment.",
    description: "A concentrated, rich infusion designed for deep repair. Infused with potent botanicals to restore strength and length to stressed hair.",
    ritual: "On Sundays, use the elixir. Part the hair, apply directly to the scalp, massage for five minutes, and leave it overnight under silk.",
    size: "100ml",
    price: 3000,
    category: "elixir",
    ingredients: [
      { name: "Castor", latin: "Ricinus communis", reason: "Draws moisture and thickens the shaft." },
      { name: "Coconut", latin: "Cocos nucifera", reason: "Penetrates deeply to prevent protein loss." }
    ],
    scent: "Rich, nutty, with a hint of roasted herbs.",
    hairTypes: ["High porosity", "Chemically treated", "Breakage-prone"],
    image: "/products/elixir-hero.jpg",
    gallery: ["/products/elixir-1.jpg", "/products/elixir-2.jpg"],
  },
  {
    slug: "hair-butter",
    name: "Hair Butter",
    tagline: "The seal.",
    description: "Whipped shea and botanical oils blended into a rich butter. The ultimate protection against harmattan winds and split ends.",
    ritual: "Take a fingertip of butter, melt it entirely between your palms, and press onto ends, edges, and twists to seal in hydration.",
    size: "200g",
    price: 6000,
    category: "butter",
    ingredients: [
      { name: "Shea Butter", latin: "Vitellaria paradoxa", reason: "The foundational emollient; seals and softens." },
      { name: "Neem", latin: "Azadirachta indica", reason: "Purifies the scalp and protects against elements." }
    ],
    scent: "Raw shea, grounded and comforting.",
    hairTypes: ["Type 4 hair", "Thick strands", "Protective styles"],
    image: "/products/butter-hero.jpg",
    gallery: ["/products/butter-1.jpg", "/products/butter-2.jpg"],
  }
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}