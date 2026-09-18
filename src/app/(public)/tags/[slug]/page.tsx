import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LatestPosts from "@/components/blog/LatestPosts";
import { getPublicTagBySlug, getPublishedPostsByTag } from "@/lib/blog/queries";
import { SITE_NAME, SITE_OG_IMAGE } from "@/lib/seo/site";

export async function generateMetadata(
  props: PageProps<"/tags/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const tag = await getPublicTagBySlug(slug);
  if (!tag.data) return { title: "Tag" };

  const name = tag.data.name;
  const description = `Articles tagged "${name}" by Ujjwal Baunthiyal on Ujjwaluzu.`;
  const canonical = `/tags/${slug}`;

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
