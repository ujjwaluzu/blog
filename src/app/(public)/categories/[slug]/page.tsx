import { notFound } from "next/navigation";
import LatestPosts from "@/components/blog/LatestPosts";
import {
  getPublicCategoryBySlug,
  getPublishedPostsByCategory,
} from "@/lib/blog/queries";
import { isArticleTopicSlug } from "@/lib/topics";

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
