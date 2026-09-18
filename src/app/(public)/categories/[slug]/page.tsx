import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LatestPosts from "@/components/blog/LatestPosts";
import {
  getPublicCategoryBySlug,
  getPublishedPostsByCategory,
} from "@/lib/blog/queries";
import { SITE_NAME, SITE_OG_IMAGE } from "@/lib/seo/site";
import { isArticleTopicSlug } from "@/lib/topics";

export async function generateMetadata(
  props: PageProps<"/categories/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isArticleTopicSlug(slug)) return { title: "Topic" };

  const category = await getPublicCategoryBySlug(slug);
  if (!category.data) return { title: "Topic" };

  const name = category.data.name;
  const description = `Articles about ${name.toLowerCase()} by Ujjwal Baunthiyal on Ujjwaluzu.`;
  const canonical = `/categories/${slug}`;

  return {
    title: name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title: `${name} | ${SITE_NAME}`,
      description,
      images: [{ ...SITE_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${SITE_NAME}`,
      description,
      images: [SITE_OG_IMAGE.url],
    },
  };
}

export default async function CategoryPage(
  props: PageProps<"/categories/[slug]">
) {
  const { slug } = await props.params;
  if (!isArticleTopicSlug(slug)) notFound();

  const [category, posts] = await Promise.all([
    getPublicCategoryBySlug(slug),
    getPublishedPostsByCategory(slug),
  ]);

  if (category.error || posts.error) {
    throw new Error("Unable to load this category.");
  }
  if (!category.data) notFound();

  return (
    <main>
      <section className="border-b border-border py-[clamp(5rem,10vw,8rem)]">
        <div className="page-container">
          <p className="eyebrow text-accent">TOPIC</p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.01em]">
            {category.data.name}
          </h1>
        </div>
      </section>
      <LatestPosts posts={posts.data} heading="ARTICLES IN THIS TOPIC" />
    </main>
  );
}
