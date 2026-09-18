import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import { series } from "@/lib/blog/series";

export default function FeaturedSeries() {
  return (
    <section className="section-space border-b border-border" aria-label="Build logs">
      <div className="page-container">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
          <h2 className="eyebrow text-accent">BUILD LOGS</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Follow the process behind the projects, from the first idea to the
            final deployment.
          </p>
        </div>
        <ul className="mt-10 border-b border-border">
          {series.map((entry, index) => (
            <li key={entry.name} className="border-t border-border">
              <Link
                href="/"
                className="group flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-9 lg:py-12"
              >
                <div className="flex min-w-0 items-center gap-6 lg:gap-10">
                  <span className="eyebrow w-8 shrink-0 text-muted-foreground/70">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.01em] transition-colors duration-200 group-hover:text-accent">
                      {entry.name}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                      {entry.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-8">
                  <EditorialImage
                    src={entry.image}
                    alt={`${entry.name} series placeholder`}
                    className="aspect-square w-16 transition-transform duration-700 ease-out group-hover:scale-[1.04] lg:w-20"
                    sizes="80px"
                  />
                  <span
                    aria-hidden="true"
                    className="hidden text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 md:inline"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
