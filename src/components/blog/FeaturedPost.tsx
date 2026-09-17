import Link from "next/link";
import PostCover from "@/components/blog/PostCover";
import { formatPublishedDate } from "@/lib/blog/format";
import type { PublicPost } from "@/lib/blog/queries";

export default function FeaturedPost({
  post,
  error = false,
}: {
  post: PublicPost | null;
  error?: boolean;
}) {
  if (!post) {
    return (
      <section className="section-space border-b border-border" aria-label="Featured story">
        <div className="page-container">
          <p className="eyebrow text-accent">FEATURED</p>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {error
              ? "Published stories are unavailable right now."
              : "There are no published stories yet."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="section-space border-b border-border"
      aria-label="Featured story"
    >
      <div className="page-container">
        <p className="eyebrow text-accent">FEATURED</p>
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <PostCover
              src={post.coverImageUrl}
              alt={`${post.title} cover`}
              className="aspect-[3/2]"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted-foreground">
              <span className="text-accent">
                {post.category?.name ?? "UNCATEGORIZED"}
              </span>
              <span aria-hidden="true" className="mx-3">
                ·
              </span>
              {post.readTime}
            </p>
            <h2 className="mt-6 font-display text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.01em] text-balance">
              {post.title}
            </h2>
            {post.excerpt ? (
              <p className="mt-6 max-w-md text-[15px] leading-[1.75] text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}
            <p className="mt-4 text-xs tracking-[0.12em] text-muted-foreground uppercase">
              {formatPublishedDate(post.publishedAt)}
            </p>
            <div className="mt-10 border-t border-border pt-8">
              <Link
                href={`/writing/${post.slug}`}
                className="group inline-flex items-baseline gap-3 eyebrow text-foreground transition-colors duration-200 hover:text-accent"
              >
                READ ARTICLE
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
