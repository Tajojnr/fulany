// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, Phone, ShoppingBag } from "lucide-react";
import { TikTokIcon, InstagramIcon, WhatsAppIcon } from "@/components/SocialIcons";
import {
  WHATSAPP_NUMBER,
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";

const PHONE_DISPLAY = "+234 916 075 9492";
const EMAIL = "sanihafsah93@gmail.com";

const money = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Fulany.ng 👋"
)}`;

const socialLinks = [
  {
    label: "Instagram",
    handle: "@fulany_ng",
    href: "https://instagram.com/fulany_ng",
    icon: InstagramIcon,
  },
  {
    label: "TikTok",
    handle: "@fulany.ng",
    href: "https://www.tiktok.com/@fulany.ng",
    icon: TikTokIcon,
  },
  {
    label: "WhatsApp",
    handle: "Chat with us",
    href: whatsappHref,
    icon: WhatsAppIcon,
  },
];

const exploreLinks = [
  { href: "/#collection", label: "The collection" },
  { href: "/#philosophy", label: "Our philosophy" },
  { href: "/ingredients", label: "Our ingredients" },
  { href: "/legal", label: "Legal & policies" },
];

const linkClass = "transition-colors hover:text-cream";
const columnHeading = "mb-6 text-xs uppercase tracking-[0.22em] text-gold";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-[#090807] text-cream">
      {/* Closing invitation */}
      <div className="border-b border-white/10 px-6 py-14 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">
              Warm · Work · Seal
            </p>
            <h2 className="max-w-xl text-4xl leading-tight md:text-6xl">
              Care that begins at the roots.
            </h2>
          </div>

          <Link
            href="/#collection"
            className="inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-lg border border-gold px-6 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
            Explore the collection
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="Fulany.ng home" className="inline-block">
            <Image
              src="/fulany-logo-transparent.webp"
              alt="Fulany.ng"
              width={844}
              height={308}
              sizes="110px"
              loading="lazy"
              className="brand-logo-img"
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-cream/70">
            Botanical hair care by Hafsah Sani. Thoughtfully made for your
            everyday hair ritual.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-gold">
            Made in Nigeria
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className={columnHeading}>Explore</h3>
          <ul className="space-y-1 text-sm text-cream/70">
            {exploreLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={`flex min-h-11 items-center ${linkClass}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className={columnHeading}>Get in touch</h3>
          <ul className="space-y-1 text-sm text-cream/70">
            <li>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className={`inline-flex min-h-11 items-center gap-3 ${linkClass}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-gold" />
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className={`inline-flex min-h-11 items-center gap-3 [overflow-wrap:anywhere] ${linkClass}`}
              >
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-gold" />
                {EMAIL}
              </a>
            </li>
          </ul>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-cream/60">Delivery</p>
            <p className="mt-2 text-sm leading-6 text-cream/70">
              {money(SHIPPING_FEE)} standard delivery. Complimentary delivery on
              orders of {money(FREE_SHIPPING_THRESHOLD)} or more.
            </p>
          </div>
        </div>

        <div>
          <h3 className={columnHeading}>Follow Fulany</h3>
          <ul className="space-y-3">
            {socialLinks.map(({ label, handle, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 items-center justify-between gap-4 border-b border-white/10 py-2 text-sm text-cream/70 transition-colors hover:border-gold/50 hover:text-cream"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-gold" />
                    <span>
                      {label}
                      <span className="ml-2 text-xs text-cream/60">{handle}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-cream/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-white/10 px-6 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-7xl py-6 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Fulany.ng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}