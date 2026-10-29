// lib/money.ts
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, COMMERCE } from "./constants";

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function formatMoney(amount: number): string {
  return formatNaira(amount);
}

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}