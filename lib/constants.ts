// lib/constants.ts

export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FEE = 2000;
export const WHATSAPP_NUMBER = "2349160759492";
export const CONTACT_EMAIL = "fulany.ng@gmail.com";
export const PHONE_DISPLAY = "+234 916 075 9492";

// "\u20A6" is the naira sign, written as an escape so file encoding can never corrupt it
export const NAIRA = "\u20A6";

export function formatNaira(amount: number): string {
  return `${NAIRA}${amount.toLocaleString("en-NG")}`;
}

export const BRAND = {
  name: "Fulany.ng",
  tagline: "West African Botanical Hair Care",
  founder: "Hafsah Sani",
  email: CONTACT_EMAIL,
  phone: PHONE_DISPLAY,
  phoneDisplay: PHONE_DISPLAY,
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagram: "@fulany_ng",
  instagramUrl: "https://instagram.com/fulany_ng",
  tiktok: "@fulany.ng",
  tiktokUrl: "https://www.tiktok.com/@fulany.ng",
};

export const COMMERCE = {
  currencySymbol: NAIRA,
  currencyCode: "NGN",
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  standardShippingFee: SHIPPING_FEE,
};

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];