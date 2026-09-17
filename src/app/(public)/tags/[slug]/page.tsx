import { notFound } from "next/navigation";
import LatestPosts from "@/components/blog/LatestPosts";
import { getPublicTagBySlug, getPublishedPostsByTag } from "@/lib/blog/queries";

export default async function TagPage(props: PageProps<"/tags/[slug]">) {
  const { slug } = await props.params;
  const [tag, posts] = await Promise.all([
    getPublicTagBySlug(slug),
    getPublishedPostsByTag(slug),
  ]);

  if (tag.error || posts.error) {
    throw new Error("Unable to load this tag.");
  }
  if (!tag.data) notFound();

  return (
    <main>
      <section className="border-b border-border py-[clamp(5rem,10vw,8rem)]">
        <div className="page-container">
          <p className="eyebrow text-accent">TAG</p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.01em]">
            #{tag.data.name}
          </h1>
        </div>
      </section>
      <LatestPosts posts={posts.data} heading="ARTICLES WITH THIS TAG" />
    </main>
  );
}
