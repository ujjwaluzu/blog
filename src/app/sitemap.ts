import type { MetadataRoute } from "next";
import {
  getPublishedArticleTopics,
  getPublishedSitemapEntries,
} from "@/lib/blog/queries";
import { SITE_URL } from "@/lib/seo/site";

export const revalidate = 3600;

function toDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, topics] = await Promise.all([
    getPublishedSitemapEntries(),
    getPublishedArticleTopics(),
  ]);

  const latest = posts.data[0];

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: toDate(latest?.updatedAt ?? latest?.publishedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/writing`,
      lastModified: toDate(latest?.updatedAt ?? latest?.publishedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.data.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: toDate(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.data.map((topic) => ({
    url: `${SITE_URL}/categories/${topic.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries, ...topicEntries];
}
