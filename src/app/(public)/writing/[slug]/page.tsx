import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/blog/MarkdownContent";
import PostCover from "@/components/blog/PostCover";
import { formatPublishedDate } from "@/lib/blog/format";
import { getPublishedPostBySlug } from "@/lib/blog/queries";

type PostPageProps = PageProps<"/writing/[slug]">;

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedPostBySlug(slug);

  if (result.error || !result.data) {
    return { title: "Writing | Ujjwal Uzu" };
  }

  const post = result.data;
  const description = post.excerpt ?? "A note from Ujjwal Uzu.";
  const canonical = `/writing/${post.slug}`;

  return {
    title: `${post.title} | Ujjwal Uzu`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function WritingPostPage({
  params,
}: PostPageProps) {
  const { slug } = await params;
  const result = await getPublishedPostBySlug(slug);

  if (result.error) {
    throw new Error("Unable to load this published post.");
  }
  if (!result.data) notFound();

  const post = result.data;

  return (
    <main>
      <article>
        <header className="border-b border-border py-[clamp(5rem,10vw,8rem)]">
          <div className="page-container max-w-4xl">
            <p className="eyebrow text-accent">
              {post.category?.name ?? "UNCATEGORIZED"}
              <span aria-hidden="true" className="mx-3 text-muted-foreground">
                ·
              </span>
              {post.readTime}
            </p>
            <h1 className="mt-7 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.01em] text-balance">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-8 max-w-2xl text-lg leading-[1.75] text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs tracking-[0.12em] text-muted-foreground uppercase">
              <time dateTime={post.publishedAt ?? undefined}>
                {formatPublishedDate(post.publishedAt)}
              </time>
              {post.tags.length > 0 ? (
                <span className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <a key={tag.id} href={`/tags/${tag.slug}`} className="text-accent">
                      #{tag.name}
                    </a>
                  ))}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <div className="page-container py-12 md:py-16">
          <PostCover
            src={post.coverImageUrl}
            alt={`${post.title} cover`}
            className="mx-auto aspect-[2/1] max-w-5xl"
            sizes="(max-width: 1280px) 100vw, 1024px"
          />
          <div className="mx-auto mt-14 max-w-3xl">
            <MarkdownContent content={post.content} />
          </div>
        </div>
      </article>
    </main>
  );
}
