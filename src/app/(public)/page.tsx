import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import CategoryNavigation from "@/components/blog/CategoryNavigation";
import EditorialStatement from "@/components/blog/EditorialStatement";
import FeaturedPost from "@/components/blog/FeaturedPost";
import LatestPosts from "@/components/blog/LatestPosts";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_AUTHOR_NAME,
  SITE_AUTHOR_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo/site";
import {
  getFeaturedPublishedPost,
  getLatestPublishedPosts,
  getPublishedArticleTopics,
} from "@/lib/blog/queries";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ ...SITE_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
};

export default async function Home() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPublishedPost(),
    getLatestPublishedPosts(6),
    getPublishedArticleTopics(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_AUTHOR_NAME,
        url: SITE_AUTHOR_URL,
      },
    ],
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <BlogHero />
      <FeaturedPost
        post={featured.data}
        error={featured.error !== null && latest.data.length === 0}
      />
      <LatestPosts
        posts={latest.data}
        error={latest.error !== null}
        viewAllHref="/writing"
      />
      <CategoryNavigation
        categories={categories.data}
        error={categories.error !== null}
      />
      <EditorialStatement />
    </main>
  );
}
