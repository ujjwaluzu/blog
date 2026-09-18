import Link from "next/link";
import type { ReactNode } from "react";
import PostCover from "@/components/blog/PostCover";
import { formatPublishedDate } from "@/lib/blog/format";
import type { PublicPost } from "@/lib/blog/queries";

export default function LatestPosts({
  posts,
  error = false,
  heading = "LATEST ARTICLES",
  viewAllHref,
  pagination,
  className = "section-space",
}: {
  posts: PublicPost[];
  error?: boolean;
  heading?: string;
  viewAllHref?: string;
  pagination?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`${className} border-b border-border`}
      aria-label="Latest articles"
    >
      <div className="page-container">
        <h2 className="eyebrow text-accent">{heading}</h2>
        {posts.length === 0 ? (
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {error
              ? "Published stories are unavailable right now."
              : "There are no published stories yet."}
          </p>
        ) : (
          <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
            {posts.map((post) => (
              <article key={post.slug} className="flex flex-col">
                <Link href={`/writing/${post.slug}`} className="group block">
                  <PostCover
                    src={post.coverImageUrl}
                    alt={`${post.title} cover`}
                    className="aspect-[3/2] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
                <p className="eyebrow mt-7 text-accent">
                  {post.category?.name ?? "UNCATEGORIZED"}
                </p>
                <h3 className="mt-4 font-display text-xl font-medium leading-[1.25] text-balance lg:text-[1.375rem]">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="transition-colors duration-200 hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt ? (
                  <p className="mt-3 line-clamp-3 max-w-md text-sm leading-[1.7] text-muted-foreground">
                    {post.excerpt}
                  </p>
                ) : null}
                <p className="mt-auto pt-6 text-[11px] tracking-[0.18em] text-muted-foreground">
                  {formatPublishedDate(post.publishedAt)}
                  <span aria-hidden="true" className="mx-2">
                    ·
                  </span>
                  {post.readTime}
                </p>
              </article>
            ))}
          </div>
        )}

        {pagination}

        {viewAllHref && posts.length > 0 ? (
          <div className="mt-14 flex justify-center">
            <Link
              href={viewAllHref}
              className="border border-border px-6 py-3 text-xs tracking-[0.08em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              View all articles
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
