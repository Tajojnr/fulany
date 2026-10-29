// components/CartDrawer.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CustomerDetails, generateWhatsAppLink } from "@/lib/whatsapp";
import { calculateShipping, formatNaira } from "@/lib/money";

export function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, isCartOpen, closeCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const link = generateWhatsAppLink(cart, customer);
    window.open(link, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-ink p-6 text-sand flex flex-col justify-between overflow-y-auto border-l border-gold/20">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gold/20">
            <h2 className="font-display text-2xl text-gold">Your Selection</h2>
            <button onClick={closeCart} className="text-sand/60 hover:text-sand text-lg">✕</button>
          </div>

          {cart.length === 0 ? (
            <p className="mt-8 text-center text-sm text-sand/60 font-body">Your bag is empty.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {cart.map((item) => {
                const itemKey = item.id || item.slug || item.name;
                return (
                  <div key={itemKey} className="flex items-center justify-between border-b border-gold/10 pb-3">
                    <div>
                      <p className="font-display text-lg text-sand">{item.name}</p>
                      <p className="text-xs text-sand/60">{item.size} — {formatNaira(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                        className="w-6 h-6 border border-gold/30 text-gold text-xs hover:bg-gold/20 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                        className="w-6 h-6 border border-gold/30 text-gold text-xs hover:bg-gold/20 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(itemKey)}
                        className="text-xs text-red-400 hover:text-red-300 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-8 border-t border-gold/20 pt-4 space-y-4">
            <div className="space-y-1 text-sm font-body">
              <div className="flex justify-between text-sand/70">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sand/70">
                <span>Delivery</span>
                <span>{shipping === 0 ? "FREE" : formatNaira(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gold text-base pt-2 border-t border-gold/10">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
            </div>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-gold py-3 text-ink uppercase tracking-widest text-xs font-semibold hover:bg-gold-light"
              >
                Proceed to Order
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-ink/50 border border-gold/30 p-2 text-xs text-sand placeholder:text-sand/40"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-ink/50 border border-gold/30 p-2 text-xs text-sand placeholder:text-sand/40"
                />
                <input
                  type="text"
                  placeholder="Delivery Address *"
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full bg-ink/50 border border-gold/30 p-2 text-xs text-sand placeholder:text-sand/40"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City *"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full bg-ink/50 border border-gold/30 p-2 text-xs text-sand placeholder:text-sand/40"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    required
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    className="w-full bg-ink/50 border border-gold/30 p-2 text-xs text-sand placeholder:text-sand/40"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold py-3 text-ink uppercase tracking-widest text-xs font-semibold hover:bg-gold-light"
                >
                  Send Order via WhatsApp
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}