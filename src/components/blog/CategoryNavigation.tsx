import Link from "next/link";
import type { PublicCategory } from "@/lib/blog/queries";

export default function CategoryNavigation({
  categories,
  error = false,
}: {
  categories: PublicCategory[];
  error?: boolean;
}) {
  return (
    <section className="section-space border-b border-border" aria-label="Categories">
      <div className="page-container">
        <h2 className="eyebrow text-accent">EXPLORE BY TOPIC</h2>
        {categories.length === 0 ? (
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {error
              ? "Topics are unavailable right now."
              : "Topics will appear here as published stories are added."}
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <li
                key={category.slug}
                className="group bg-background transition-colors duration-200 hover:bg-surface"
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex h-full min-h-36 flex-col justify-between p-5 lg:min-h-40 lg:p-6"
                >
                  <span className="eyebrow text-muted-foreground/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-2xl leading-none transition-colors duration-200 group-hover:text-accent lg:text-[1.75rem]">
                      {category.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-sm text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
