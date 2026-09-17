"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: (
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1.5" y="1.5" width="5" height="5" />
        <rect x="9.5" y="1.5" width="5" height="5" />
        <rect x="1.5" y="9.5" width="5" height="5" />
        <rect x="9.5" y="9.5" width="5" height="5" />
      </svg>
    ),
  },
  {
    label: "Posts",
    href: "/admin/posts",
    icon: (
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 1.5h5.5L13 5v9.5H4z" />
        <path d="M9.5 1.5V5H13" />
        <path d="M6 8.5h4" />
        <path d="M6 11h4" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="lg:hidden"
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <div className="flex h-12 items-center justify-between border-b border-border px-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="admin-mobile-nav"
            aria-label={open ? "Close admin navigation" : "Open admin navigation"}
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? (
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
          <span className="font-display text-sm font-medium tracking-[0.22em]">
            UJJWALUZU
          </span>
        </div>

        {open && (
          <nav
            id="admin-mobile-nav"
            aria-label="Admin mobile navigation"
            className="border-b border-border"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    active
                      ? "bg-muted font-medium text-accent"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border">
        <div className="px-5 pb-4 pt-8">
          <p className="font-display text-sm font-medium tracking-[0.22em]">
            UJJWALUZU
          </p>
          <p className="eyebrow mt-1.5 text-muted-foreground">Admin</p>
        </div>

        <nav aria-label="Admin navigation" className="flex-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-accent bg-muted font-medium text-accent"
                    : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
