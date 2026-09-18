import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/blog/MarkdownContent";
import PostCover from "@/components/blog/PostCover";
import JsonLd from "@/components/seo/JsonLd";
import { formatPublishedDate } from "@/lib/blog/format";
import { getPublishedPostBySlug } from "@/lib/blog/queries";
import {
  SITE_AUTHOR_NAME,
  SITE_AUTHOR_URL,
  SITE_NAME,
  SITE_OG_IMAGE,
  absoluteUrl,
  deriveDescription,
} from "@/lib/seo/site";

type PostPageProps = PageProps<"/writing/[slug]">;

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedPostBySlug(slug);

  if (result.error || !result.data) {
    return { title: "Writing" };
  }

  const post = result.data;
  const description = deriveDescription(post.excerpt, post.content);
  const canonical = `/writing/${post.slug}`;
  const keywords = [
    post.category?.name,
    ...post.tags.map((tag) => tag.name),
  ].filter((value): value is string => Boolean(value));

  return {
    title: post.title,
    description,
    authors: [{ name: SITE_AUTHOR_NAME, url: SITE_AUTHOR_URL }],
    creator: SITE_AUTHOR_NAME,
    publisher: SITE_NAME,
    alternates: { canonical },
    ...(keywords.length > 0 ? { keywords } : {}),
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: SITE_NAME,
      title: post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
      authors: [SITE_AUTHOR_URL],
      section: post.category?.name ?? undefined,
      tags: post.tags.map((tag) => tag.name),
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, alt: `${post.title} cover` }]
        : [{ ...SITE_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.coverImageUrl ?? SITE_OG_IMAGE.url],
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
  const description = deriveDescription(post.excerpt, post.content);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: [post.coverImageUrl ?? absoluteUrl(SITE_OG_IMAGE.url)],
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR_NAME,
      url: SITE_AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_AUTHOR_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/writing/${post.slug}`),
    },
    ...(post.category ? { articleSection: post.category.name } : {}),
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
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
