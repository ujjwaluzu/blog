import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <main>
          <section className="section-space border-b border-border">
            <div className="page-container">
              <p className="eyebrow text-accent">404</p>
              <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.75rem,7vw,5rem)] font-medium leading-[1.04] tracking-[-0.01em] text-balance">
                This page doesn&rsquo;t exist.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-[1.75] text-muted-foreground md:text-lg">
                The link may be broken, or the page may have been moved or removed.
              </p>
              <div className="mt-12">
                <Link
                  href="/"
                  className="eyebrow inline-flex items-center gap-3 border border-border px-8 py-4 text-foreground transition-colors duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  BACK TO HOME
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}