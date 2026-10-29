// lib/whatsapp.ts
import { BRAND, WHATSAPP_NUMBER, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "./constants";

export interface CartItem {
  id: string;
  slug?: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}

export function buildWhatsAppOrderMessage(
  items: CartItem[],
  customer: CustomerDetails,
  totalOverride?: number,
  deliveryOverride?: number
): string {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping =
    deliveryOverride !== undefined
      ? deliveryOverride
      : subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;
  const total = totalOverride !== undefined ? totalOverride : subtotal + shipping;

  let message = `Hi ${BRAND.name} 👋\n\nI'd like to place an order:\n\n`;

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    message += `• ${item.name} (${item.size}) — ${item.quantity} unit(s) — ₦${itemTotal.toLocaleString("en-NG")}\n`;
  });

  message += `\nSubtotal: ₦${subtotal.toLocaleString("en-NG")}`;
  message += `\nDelivery: ${
    shipping === 0 ? "FREE" : `₦${shipping.toLocaleString("en-NG")}`
  }`;
  message += `\nTotal: ₦${total.toLocaleString("en-NG")}\n\n`;

  message += `Delivery Details:\n`;
  message += `• Name: ${customer.name}\n`;
  message += `• Phone: ${customer.phone}\n`;
  message += `• Address: ${customer.address}\n`;
  message += `• City/Area: ${customer.city}\n`;
  message += `• State: ${customer.state}\n`;
  if (customer.notes && customer.notes.trim()) {
    message += `• Notes: ${customer.notes}\n`;
  }

  message += `\nThank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

export const generateWhatsAppLink = buildWhatsAppOrderMessage;