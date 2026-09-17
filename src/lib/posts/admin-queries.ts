import "server-only";

import { ARTICLE_TOPICS, isArticleTopicSlug, orderArticleTopics } from "@/lib/topics";
import { createClient } from "@/lib/supabase/server";

export type AdminTopic = {
  id: string;
  name: string;
  slug: string;
};

export type AdminPostFilters = {
  status: "draft" | "published" | "archived" | null;
  category: string | null;
};

export type AdminPostRecord = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  published_at: string | null;
  updated_at: string | null;
  category_name: string | null;
};

export async function getArticleTopics(): Promise<{
  data: AdminTopic[];
  error: boolean;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .in(
      "slug",
      ARTICLE_TOPICS.map((topic) => topic.slug)
    );

  if (error) return { data: [], error: true };

  return {
    data: orderArticleTopics((data ?? []) as unknown as AdminTopic[]),
    error: false,
  };
}

export async function getAdminPosts(filters: AdminPostFilters): Promise<{
  data: AdminPostRecord[];
  error: boolean;
}> {
  const topics = await getArticleTopics();
  if (topics.error) return { data: [], error: true };

  const requestedTopic = filters.category
    ? topics.data.find((topic) => topic.slug === filters.category)
    : null;

  if (filters.category && !requestedTopic) {
    return { data: [], error: false };
  }

  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(
      "id, title, slug, status, featured, category_id, published_at, updated_at, categories(name)"
    )
    .order("updated_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (requestedTopic) query = query.eq("category_id", requestedTopic.id);

  const { data, error } = await query;
  if (error) return { data: [], error: true };

  const posts = (data ?? []) as unknown as Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    featured: boolean;
    published_at: string | null;
    updated_at: string | null;
    categories: { name: string } | { name: string }[] | null;
  }>;

  return {
    data: posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      featured: post.featured,
      published_at: post.published_at,
      updated_at: post.updated_at,
      category_name: Array.isArray(post.categories)
        ? (post.categories[0]?.name ?? null)
        : (post.categories?.name ?? null),
    })),
    error: false,
  };
}

export async function getAdminOverview(): Promise<{
  data: {
    all: number;
    published: number;
    drafts: number;
    topics: Record<(typeof ARTICLE_TOPICS)[number]["slug"], number>;
  } | null;
  error: boolean;
}> {
  const topics = await getArticleTopics();
  if (topics.error) return { data: null, error: true };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("status, category_id");

  if (error) return { data: null, error: true };

  const topicById = new Map(topics.data.map((topic) => [topic.id, topic.slug]));
  const counts = {
    development: 0,
    projects: 0,
    personal: 0,
  };
  let published = 0;
  let drafts = 0;

  for (const post of (data ?? []) as Array<{
    status: string;
    category_id: string | null;
  }>) {
    if (post.status === "published") published += 1;
    if (post.status === "draft") drafts += 1;

    const topicSlug = post.category_id
      ? topicById.get(post.category_id)
      : null;
    if (topicSlug && isArticleTopicSlug(topicSlug)) counts[topicSlug] += 1;
  }

  return {
    data: {
      all: (data ?? []).length,
      published,
      drafts,
      topics: counts,
    },
    error: false,
  };
}
