// components/CheckoutDrawer.tsx
"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X, ShoppingBag, Plus, Minus, Send, Truck } from "lucide-react";
import {
  NIGERIAN_STATES,
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";
import { buildWhatsAppOrderMessage, type CartItem } from "@/lib/whatsapp";
import { getProduct, MAX_QTY } from "@/lib/products";

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
}

type FormState = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
};

type Errors = Partial<Record<"name" | "phone" | "address" | "state", string>>;

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  notes: "",
};

// Nigerian mobile: 0 or +234 or 234, then 7/8/9, then 0/1, then 8 digits
const NG_PHONE = /^(?:\+?234|0)[789][01]\d{8}$/;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!NG_PHONE.test(form.phone.replace(/[\s-]/g, "")))
    errors.phone = "Enter a valid Nigerian number, e.g. 0803 123 4567.";
  if (form.address.trim().length < 8)
    errors.address = "Please add a street address we can deliver to.";
  if (!form.state) errors.state = "Please choose your state.";
  return errors;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const fieldBase =
  "w-full min-h-12 rounded-lg border bg-white/5 px-3.5 py-3 text-base text-cream placeholder:text-cream/40 transition-colors focus:border-gold focus:outline-none md:text-sm";

export function CheckoutDrawer({
  isOpen,
  onClose,
  items,
  updateQuantity,
}: CheckoutDrawerProps) {
  const uid = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose; // keeps the effect below from re-running on every parent render

  const [step, setStep] = useState<"cart" | "shipping">("cart");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [attempted, setAttempted] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + delivery;
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const errors = validate(form);

  const money = (n: number) => `₦${n.toLocaleString("en-NG")}`;

  // Empty bag → back to step 1
  useEffect(() => {
    if (items.length === 0) setStep("cart");
  }, [items.length]);

  // Scroll to top of the panel when the step changes
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  // Scroll lock, Escape to close, focus trap, focus restore
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCheckout = useCallback(() => {
    setAttempted(true);
    const found = validate(form);
    const firstKey = (["name", "phone", "address", "state"] as const).find(
      (k) => found[k]
    );
    if (firstKey) {
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }

    const clean: FormState = {
      name: form.name.trim(),
      phone: form.phone.replace(/[\s-]/g, ""),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state,
      notes: form.notes.trim(),
    };

    const url = buildWhatsAppOrderMessage(items, clean, total, delivery);
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url; // popup blocked: continue in this tab
  }, [form, items, total, delivery, uid]);

  if (!isOpen) return null;

  const fieldError = (key: keyof Errors) => (attempted ? errors[key] : undefined);
  const borderFor = (key: keyof Errors) =>
    fieldError(key) ? "border-red-400/70" : "border-white/15";

  const titleId = `${uid}-title`;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="animate-fade-in fixed inset-0 bg-black/75"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-drawer-in relative z-[101] flex h-[100dvh] w-full max-w-md flex-col border-l border-gold/20 bg-[#0b0a09] shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/10 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-gold" aria-hidden="true" />
            <div>
              <h2 id={titleId} className="text-2xl leading-none">
                {step === "cart" ? "Your Selection" : "Delivery Details"}
              </h2>
              {items.length > 0 && (
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-cream/60">
                  Step {step === "cart" ? "1" : "2"} of 2
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="flex h-11 w-11 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-white/5 hover:text-cream"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <ShoppingBag size={48} strokeWidth={1} className="text-cream/40" aria-hidden="true" />
              <p className="font-display text-xl italic text-cream/70">Your bag is empty</p>
              <button
                type="button"
                onClick={onClose}
                className="min-h-12 rounded-lg border border-gold-line px-6 text-xs uppercase tracking-widest text-gold transition-colors hover:bg-gold-soft"
              >
                Continue Shopping
              </button>
            </div>
          ) : step === "cart" ? (
            <ul className="space-y-4">
              {items.map((item) => {
                const product = getProduct(item.id);
                const atMax = item.quantity >= MAX_QTY;
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-gold/10 bg-white/5 p-3"
                  >
                    <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/40 p-1.5">
                      {product && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt=""
                          width={80}
                          height={96}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-body text-sm font-medium text-gold">{item.name}</h3>
                      <p className="text-xs text-cream/60">{item.size}</p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-lg border border-white/15 bg-black/30">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={
                              item.quantity === 1
                                ? `Remove ${item.name} from bag`
                                : `Decrease quantity of ${item.name}`
                            }
                            className="flex h-11 w-11 items-center justify-center text-cream/75 transition-colors hover:bg-white/10"
                          >
                            <Minus size={14} aria-hidden="true" />
                          </button>
                          <span
                            className="min-w-6 text-center text-sm tabular-nums"
                            aria-live="polite"
                            aria-label={`Quantity ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={atMax}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-11 w-11 items-center justify-center text-cream/75 transition-colors hover:bg-white/10 disabled:opacity-30"
                          >
                            <Plus size={14} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-sm font-medium tabular-nums text-gold">
                          {money(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="space-y-5">
              <div>
                <label htmlFor={`${uid}-name`} className="mb-2 block text-xs uppercase tracking-widest text-cream/75">
                  Full name
                </label>
                <input
                  id={`${uid}-name`}
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                  aria-required="true"
                  aria-invalid={!!fieldError("name")}
                  aria-describedby={fieldError("name") ? `${uid}-name-err` : undefined}
                  className={`${fieldBase} ${borderFor("name")}`}
                />
                {fieldError("name") && (
                  <p id={`${uid}-name-err`} className="mt-1.5 text-xs text-red-300">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor={`${uid}-phone`} className="mb-2 block text-xs uppercase tracking-widest text-cream/75">
                  Phone number (WhatsApp)
                </label>
                <input
                  id={`${uid}-phone`}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0803 123 4567"
                  value={form.phone}
                  onChange={set("phone")}
                  aria-required="true"
                  aria-invalid={!!fieldError("phone")}
                  aria-describedby={fieldError("phone") ? `${uid}-phone-err` : undefined}
                  className={`${fieldBase} ${borderFor("phone")}`}
                />
                {fieldError("phone") && (
                  <p id={`${uid}-phone-err`} className="mt-1.5 text-xs text-red-300">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor={`${uid}-address`} className="mb-2 block text-xs uppercase tracking-widest text-cream/75">
                  Delivery address
                </label>
                <textarea
                  id={`${uid}-address`}
                  rows={3}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={set("address")}
                  aria-required="true"
                  aria-invalid={!!fieldError("address")}
                  aria-describedby={fieldError("address") ? `${uid}-address-err` : undefined}
                  className={`${fieldBase} resize-none ${borderFor("address")}`}
                />
                {fieldError("address") && (
                  <p id={`${uid}-address-err`} className="mt-1.5 text-xs text-red-300">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${uid}-city`} className="mb-2 block text-xs uppercase tracking-widest text-cream/75">
                    City <span className="normal-case tracking-normal text-cream/50">(optional)</span>
                  </label>
                  <input
                    id={`${uid}-city`}
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={set("city")}
                    className={`${fieldBase} border-white/15`}
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-state`} className="mb-2 block text-xs uppercase tracking-widest text-cream/75">
                    State
                  </label>
                  <select
                    id={`${uid}-state`}
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={set("state")}
                    aria-required="true"
                    aria-invalid={!!fieldError("state")}
                    aria-describedby={fieldError("state") ? `${uid}-state-err` : undefined}
                    className={`${fieldBase} bg-[#1a1816] ${borderFor("state")}`}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {fieldError("state") && (
                <p id={`${uid}-state-err`} className="-mt-3 text-xs text-red-300">{errors.state}</p>
              )}

              <div>
                <label htmlFor={`${uid}-notes`} className="mb-2 block text-xs uppercase tracking-widest text-cream/75">
                  Special notes <span className="normal-case tracking-normal text-cream/50">(optional)</span>
                </label>
                <textarea
                  id={`${uid}-notes`}
                  rows={2}
                  value={form.notes}
                  onChange={set("notes")}
                  className={`${fieldBase} resize-none border-white/15`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="space-y-4 border-t border-gold/10 bg-black/60 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6">
            {step === "cart" ? (
              <div className="space-y-2 text-sm">
                {remaining > 0 ? (
                  <div className="pb-1">
                    <p className="mb-2 text-xs text-gold/90">
                      Add {money(remaining)} more for free delivery
                    </p>
                    <div
                      className="h-1 overflow-hidden rounded-full bg-white/10"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress)}
                      aria-label="Progress toward free delivery"
                    >
                      <div
                        className="h-full rounded-full bg-gold transition-[width] duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="pb-1 text-xs text-gold/90">
                    You&apos;ve unlocked free delivery
                  </p>
                )}

                <div className="flex justify-between text-cream/70">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-cream/70">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} aria-hidden="true" /> Delivery
                  </span>
                  <span className="tabular-nums">{delivery === 0 ? "FREE" : money(delivery)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-base font-medium">
                  <span>Total</span>
                  <span className="tabular-nums text-gold">{money(total)}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-between text-base font-medium">
                <span>
                  Total{" "}
                  <span className="text-xs font-normal text-cream/60">
                    {delivery === 0 ? "(free delivery)" : "(incl. delivery)"}
                  </span>
                </span>
                <span className="tabular-nums text-gold">{money(total)}</span>
              </div>
            )}

            {step === "cart" ? (
              <button
                type="button"
                onClick={() => setStep("shipping")}
                className="min-h-12 w-full rounded-lg bg-gold text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-gold/90"
              >
                Continue to Delivery
              </button>
            ) : (
              <>
                <div className="grid grid-cols-[1fr_2fr] gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="min-h-12 rounded-lg border border-white/20 text-xs uppercase tracking-widest transition-colors hover:bg-white/5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-gold/90"
                  >
                    <Send size={14} aria-hidden="true" /> Send Order on WhatsApp
                  </button>
                </div>
                <p className="text-center text-[11px] leading-relaxed text-cream/60">
                  This opens WhatsApp with your order ready to send. No payment is taken on this site.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}