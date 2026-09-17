export const ARTICLE_TOPICS = [
  { name: "Development", slug: "development" },
  { name: "Projects", slug: "projects" },
  { name: "Personal", slug: "personal" },
] as const;

export type ArticleTopicSlug = (typeof ARTICLE_TOPICS)[number]["slug"];

export function isArticleTopicSlug(value: string): value is ArticleTopicSlug {
  return ARTICLE_TOPICS.some((topic) => topic.slug === value);
}

export function orderArticleTopics<T extends { slug: string }>(topics: T[]): T[] {
  const bySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  return ARTICLE_TOPICS.flatMap((topic) => {
    const match = bySlug.get(topic.slug);
    return match ? [match] : [];
  });
}
