// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/constants";
import { FAQ } from "@/lib/faq";

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
const ORG_ID = `${SITE_URL}/#organization`;
const FOUNDER_ID = `${SITE_URL}/#founder`;

const SOCIAL_PROFILES: string[] = [
  "https://www.tiktok.com/@fulany.ng",
  "https://instagram.com/fulany_ng",
];

const DESCRIPTION =
  "Handcrafted in Nigeria by Hafsah Sani. Pure cold-pressed botanical hair oils, elixirs, and whipped butters.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fulany.ng | West African Botanical Hair Care by Hafsah Sani",
    template: "%s | Fulany.ng",
  },
  description: DESCRIPTION,
  applicationName: "Fulany.ng",
  // No canonical or openGraph.url here: each page sets its own,
  // so sub-pages never claim the homepage as their canonical address.
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Fulany.ng",
    title: "Fulany.ng | West African Botanical Hair Care",
    description: DESCRIPTION,
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
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080706",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// One linked graph instead of three separate scripts
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Fulany.ng",
      url: SITE_URL,
      logo: `${SITE_URL}/fulany-logo-transparent.png`,
      description: "West African botanical hair care, handcrafted in Nigeria.",
      founder: { "@id": FOUNDER_ID },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${WHATSAPP_NUMBER}`,
        email: CONTACT_EMAIL,
        contactType: "customer support",
        areaServed: "NG",
        availableLanguage: "English",
      },
      sameAs: SOCIAL_PROFILES,
    },
    {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: "Hafsah Sani",
      jobTitle: "Founder & Formulator",
      worksFor: { "@id": ORG_ID },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
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

        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}