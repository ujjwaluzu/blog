import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "/writing" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/ujjwaluzu" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ujjwaluzu" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="page-container">
        <div className="grid gap-x-12 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-12 lg:py-12">
          <div className="sm:col-span-2 lg:col-span-5 lg:pr-20">
            <BrandLogo className="h-9 w-auto" />
            <p className="eyebrow mt-4 text-muted-foreground">
              THOUGHTS. CODE. PROGRESS.
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-8">
            <p className="eyebrow text-accent">NAVIGATION</p>
            <ul className="mt-6">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block py-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-11">
            <p className="eyebrow text-accent">SOCIAL</p>
            <ul className="mt-6">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-border py-6 sm:flex-row sm:justify-between">
          <p className="text-xs tracking-[0.15em] text-muted-foreground">
            © 2026 UJJWALUZU
          </p>
          <p className="eyebrow text-muted-foreground/70">
            IDEAS INTO PROGRESS
          </p>
        </div>
      </div>
    </footer>
  );
}