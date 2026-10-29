// app/legal/page.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Footer } from "@/components/Footer";
import {
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  WHATSAPP_NUMBER,
  PHONE_DISPLAY,
  formatNaira,
} from "@/lib/constants";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Legal & Policies",
  description:
    "Shipping, returns, privacy and product-safety information for Fulany.ng orders.",
  alternates: { canonical: "/legal" },
};

// Change this date by hand whenever the policies below change.
const LAST_UPDATED = { iso: "2026-10-29", label: "29 October 2026" };

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="space-y-5">
      <h2 id={`${id}-heading`} className="border-b border-white/10 pb-4 text-3xl">
        {title}
      </h2>
      <div className="space-y-4 text-base font-light leading-relaxed text-cream/75">
        {children}
      </div>
    </section>
  );
}

export default function LegalPage() {
  return (
    <>
      <SubpageHeader />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-3xl space-y-14 px-5 py-16 outline-none sm:px-6 md:py-24"
      >
        <header className="space-y-4">
          <h1 className="text-5xl text-gold md:text-6xl">Legal &amp; Policies</h1>
          <p className="text-sm text-cream/60">
            Last updated: <time dateTime={LAST_UPDATED.iso}>{LAST_UPDATED.label}</time>
          </p>
        </header>

        <Section id="shipping" title="1. Shipping & Deliveries">
          <p>
            We process and dispatch all orders within 24–48 hours of confirmation via our WhatsApp checkout system. Deliveries within Lagos and Kano typically arrive within 1–3 business days. Interstate deliveries across Nigeria may take 3–5 business days.
          </p>
          <ul className="list-disc space-y-2 pl-5 marker:text-gold">
            <li>Standard nationwide shipping fee is {formatNaira(SHIPPING_FEE)}.</li>
            <li>
              Orders totaling {formatNaira(FREE_SHIPPING_THRESHOLD)} and above automatically qualify for complimentary free shipping.
            </li>
            <li>
              Please ensure your delivery address and phone number are completely accurate during the WhatsApp checkout process.
            </li>
          </ul>
        </Section>

        <Section id="returns" title="2. Returns & Refunds">
          <p>
            Due to the hygienic nature of cosmetic and personal care products, we do not accept returns or exchanges on opened or used items.
          </p>
          <p>
            If your product arrives damaged, leaking, or compromised during transit, please contact us on{" "}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-4"
            >
              WhatsApp ({PHONE_DISPLAY})
            </a>{" "}
            within 24 hours of delivery with photographic evidence, and we will arrange a replacement immediately.
          </p>
        </Section>

        <Section id="privacy" title="3. Privacy Policy">
          <p>
            Your privacy is highly respected. Because our checkout is finalized via WhatsApp, your payment data is never stored on our web servers. We only collect the necessary delivery information (Name, Phone, Address) required to fulfill your order. We will never sell, rent, or distribute your personal contact information to third-party marketing agencies.
          </p>
          <p>
            Your bag is saved in your own browser so it survives a page refresh; it is not sent to us until you choose to send your order. Orders are sent through WhatsApp, which handles messages under its own privacy practices.
          </p>
        </Section>

        <Section id="medical" title="4. Medical Disclaimer">
          <p>
            Fulany.ng products are formulated with natural botanicals, oils, and butters. However, they are not intended to diagnose, treat, cure, or prevent any medical condition or severe alopecia. If you have severe scalp conditions or specific allergies (e.g., nut allergies related to Shea Butter), please consult a medical professional before use. A 24-hour patch test is always recommended.
          </p>
        </Section>

        <Section id="faq" title="Frequently asked questions">
          <div className="space-y-6">
            {FAQ.map(({ question, answer }) => (
              <div key={question}>
                <h3 className="font-body text-lg font-medium text-cream">{question}</h3>
                <p className="mt-1.5">{answer}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}