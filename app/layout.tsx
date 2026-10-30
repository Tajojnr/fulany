// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://fulany.ng";

const SOCIAL_PROFILES: string[] = [
  "https://www.tiktok.com/@fulany.ng?lang=en",
  "https://instagram.com/fulany_ng",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fulany.ng | West African Botanical Hair Care by Hafsah Sani",
    template: "%s | Fulany.ng",
  },
  description:
    "Handcrafted in Nigeria by Hafsah Sani. Pure cold-pressed botanical hair oils, elixirs, and whipped butters.",
  applicationName: "Fulany.ng",
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "Fulany.ng",
    title: "Fulany.ng | West African Botanical Hair Care",
    description:
      "Handcrafted in Nigeria by Hafsah Sani. Pure cold-pressed botanical hair oils, elixirs, and whipped butters.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fulany.ng botanical hair care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulany.ng | West African Botanical Hair Care",
    description:
      "Handcrafted in Nigeria by Hafsah Sani. Pure cold-pressed botanical hair oils, elixirs, and whipped butters.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "EuoihABE27sk5tVS4Y_jAfVRftIl7-H7_oF_5PlQOOk",
  },
};

export const viewport: Viewport = {
  themeColor: "#080706",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fulany.ng",
  url: SITE_URL,
  logo: `${SITE_URL}/fulany-logo-transparent.png`,
  description: "West African botanical hair care, handcrafted in Nigeria.",
  founder: { "@type": "Person", name: "Hafsah Sani" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234-916-075-9492",
    email: "sanihafsah93@gmail.com",
    contactType: "customer support",
    areaServed: "NG",
    availableLanguage: "English",
  },
  sameAs: SOCIAL_PROFILES,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hafsah Sani",
  jobTitle: "Founder & Formulator",
  worksFor: {
    "@type": "Organization",
    name: "Fulany.ng",
  },
  description:
    "Founder and formulator of Fulany.ng, specializing in West African botanical hair and skin care.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the shipping costs within Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a standard delivery fee of ₦2,000 nationwide. Complimentary delivery is automatically applied to all orders exceeding ₦10,000.",
      },
    },
    {
      "@type": "Question",
      name: "Are your products made with natural ingredients?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our formulations use pure cold-pressed botanical oils, unrefined West African shea butter, and herbal matrices. We use zero harsh synthetics.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Fulany.ng customer support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can reach us directly via WhatsApp at +234 916 075 9492 or email us at sanihafsah93@gmail.com.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NG"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>

        <CartProvider>{children}</CartProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}