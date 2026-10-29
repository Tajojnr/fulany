// components/SubpageHeader.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SubpageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-ink/95 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between px-5 sm:px-6"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-xs uppercase tracking-widest text-cream/75 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to store
        </Link>

        <Link href="/" aria-label="Fulany.ng home" className="flex items-center py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fulany-logo-transparent.png"
            alt="Fulany.ng"
            decoding="async"
            className="brand-logo-img"
          />
        </Link>
      </nav>
    </header>
  );
}