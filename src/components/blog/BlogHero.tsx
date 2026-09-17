import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";

export default function BlogHero() {
  return (
    <section
      className="border-b border-border py-[clamp(3.5rem,9vw,7rem)]"
      aria-label="Introduction"
    >
      <div className="page-container">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4 text-accent">
              <span aria-hidden="true" className="h-px w-8 bg-accent/60" />
              THINK. BUILD. SHARE.
            </p>
            <h1 className="mt-8 max-w-2xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.01em] text-balance">
              Good ideas build{" "}
              <em className="font-normal text-accent">better futures.</em>
            </h1>
            <p className="mt-9 max-w-xl text-base leading-[1.75] text-muted-foreground md:text-lg">
              A personal journal about building software, exploring technology,
              and turning ideas into things that actually work.
            </p>
            <div className="mt-12">
              <Link
                href="/writing"
                className="eyebrow inline-flex items-center gap-3 border border-border px-8 py-4 text-foreground transition-colors duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
              >
                READ ARTICLES
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <EditorialImage
              src="/ujjwal-character.webp"
              alt="Ujjwal character illustration"
              className="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
