"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "@/components/brand/BrandLogo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "/writing" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setMenuOpen(false);
        }
      }}
    >
      <div className="page-container">
        <div className="flex h-16 items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            aria-label="UJJWALUZU — Home"
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <BrandLogo className="h-8 w-auto md:h-9" priority />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 transition-colors md:flex lg:gap-9"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] tracking-[0.05em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <a
              href="https://ujjwaluzu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] tracking-[0.05em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Portfolio
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-full text-foreground md:hidden"
            >
              {menuOpen ? (
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-border md:hidden"
        >
          <div className="page-container">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-border py-4 text-sm tracking-[0.05em] text-muted-foreground transition-colors duration-200 last:border-b-0 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
