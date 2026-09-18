import "server-only";

import { cache } from "react";
import { coverObjectUrl } from "@/lib/posts/storage";
import { isValidSlug } from "@/lib/posts/slug";
import { createPublicClient } from "@/lib/supabase/public";
import { ARTICLE_TOPICS, isArticleTopicSlug, orderArticleTopics } from "@/lib/topics";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PublicTag = PublicCategory;

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImagePath: string | null;
  coverImageUrl: string | null;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  readTime: string;
  category: PublicCategory | null;
  tags: PublicTag[];
};

export type BlogQueryResult<T> = {
  data: T;
  error: string | null;
};

type RawCategory = PublicCategory;

type RawPostTag = {
  tags: RawCategory | RawCategory[] | null;
};

type RawPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  categories: RawCategory | RawCategory[] | null;
  post_tags: RawPostTag[] | null;
};

type RawTaxonomy = PublicCategory;

const POST_SELECT =
  "id, title, slug, excerpt, content, cover_image, featured, published_at, created_at, updated_at, categories(id, name, slug), post_tags(tags(id, name, slug))";

const TAG_FILTER_POST_SELECT =
  "id, title, slug, excerpt, content, cover_image, featured, published_at, created_at, updated_at, categories(id, name, slug), post_tags!inner(tags!inner(id, name, slug))";

function queryError(label: string, error: { message?: string } | null) {
  const message = error?.message ?? "Unknown database error";
  console.error(`[blog] ${label} query failed: ${message}`);
  return "Published content is temporarily unavailable.";
}

function firstRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function estimateReadTime(content: string): string {
  const wordCount = content.trim() ? content.trim().split(/\s+/u).length : 0;
  return `${Math.max(1, Math.ceil(wordCount / 200))} MIN READ`;
}

function toPublicPost(row: RawPost): PublicPost {
  const category = firstRelation(row.categories);
  const tags = (row.post_tags ?? [])
    .map((postTag) => firstRelation(postTag.tags))
    .filter((tag): tag is PublicTag => tag !== null);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImagePath: row.cover_image,
    coverImageUrl: row.cover_image ? coverObjectUrl(row.cover_image) : null,
    featured: row.featured,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
    readTime: estimateReadTime(row.content),
    category,
    tags,
  };
}

async function fetchPosts(
  label: string,
  query: PromiseLike<{
    data: unknown;
    error: { message?: string } | null;
  }>
): Promise<BlogQueryResult<PublicPost[]>> {
  const { data, error } = await query;
  if (error) {
    return { data: [], error: queryError(label, error) };
  }

  return {
    data: ((data ?? []) as unknown as RawPost[]).map(toPublicPost),
    error: null,
  };
}

export async function getPublishedPosts(): Promise<BlogQueryResult<PublicPost[]>> {
  const supabase = createPublicClient();
  return fetchPosts(
    "published posts",
    supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
  );
}

export type PublicPostSitemapEntry = {
  slug: string;
  publishedAt: string | null;
  updatedAt: string | null;
};

export async function getPublishedSitemapEntries(): Promise<
  BlogQueryResult<PublicPostSitemapEntry[]>
> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, published_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: queryError("published sitemap posts", error) };
  }

  const rows = (data ?? []) as unknown as {
    slug: string;
    published_at: string | null;
    updated_at: string | null;
  }[];

  return {
    data: rows.map((row) => ({
      slug: row.slug,
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
    })),
    error: null,
  };
}

export const getPublishedPostBySlug = cache(
  async (slug: string): Promise<BlogQueryResult<PublicPost | null>> => {
    if (!isValidSlug(slug)) return { data: null, error: null };

    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      return { data: null, error: queryError("published post", error) };
    }

    return {
      data: data ? toPublicPost(data as unknown as RawPost) : null,
      error: null,
    };
  }
);

export async function getFeaturedPublishedPost(): Promise<
  BlogQueryResult<PublicPost | null>
> {
  const supabase = createPublicClient();
  const result = await fetchPosts(
    "featured published post",
    supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(1)
  );

  return { data: result.data[0] ?? null, error: result.error };
}

export async function getLatestPublishedPosts(
  limit = 6
): Promise<BlogQueryResult<PublicPost[]>> {
  const supabase = createPublicClient();
  return fetchPosts(
    "latest published posts",
    supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(Math.max(1, Math.floor(limit)))
  );
}

export type PaginatedPosts = {
  posts: PublicPost[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export async function getPublishedPostsPage(
  page = 1,
  pageSize = 9
): Promise<BlogQueryResult<PaginatedPosts>> {
  const size = Math.max(1, Math.floor(pageSize));
  const supabase = createPublicClient();

  const { count, error: countError } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  if (countError) {
    return {
      data: { posts: [], page: 1, pageSize: size, total: 0, totalPages: 0 },
      error: queryError("published posts count", countError),
    };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / size);
  const current = totalPages === 0 ? 1 : Math.min(Math.max(1, Math.floor(page)), totalPages);
  const from = (current - 1) * size;
  const to = from + size - 1;

  const result = await fetchPosts(
    "published posts page",
    supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to)
  );

  return {
    data: {
      posts: result.data,
      page: current,
      pageSize: size,
      total,
      totalPages,
    },
    error: result.error,
  };
}

export async function getPublishedArticleTopics(): Promise<
  BlogQueryResult<PublicCategory[]>
> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .in(
      "slug",
      ARTICLE_TOPICS.map((topic) => topic.slug)
    );

  if (error) {
    return { data: [], error: queryError("article topics", error) };
  }

  return {
    data: orderArticleTopics((data ?? []) as unknown as PublicCategory[]),
    error: null,
  };
}

export async function getPublishedCategories(): Promise<
  BlogQueryResult<PublicCategory[]>
> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    return { data: [], error: queryError("published categories", error) };
  }

  return { data: (data ?? []) as unknown as PublicCategory[], error: null };
}

async function getTaxonomyBySlug(
  table: "categories" | "tags",
  slug: string,
  label: string
): Promise<BlogQueryResult<RawTaxonomy | null>> {
  if (!isValidSlug(slug)) return { data: null, error: null };

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from(table)
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return { data: null, error: queryError(label, error) };
  return { data: data as unknown as RawTaxonomy | null, error: null };
}

export const getPublicCategoryBySlug = cache((slug: string) =>
  getTaxonomyBySlug("categories", slug, "category")
);

export const getPublicTagBySlug = cache((slug: string) =>
  getTaxonomyBySlug("tags", slug, "tag")
);

export async function getPublishedPostsByCategory(
  categorySlug: string
): Promise<BlogQueryResult<PublicPost[]>> {
  if (!isArticleTopicSlug(categorySlug)) return { data: [], error: null };

  const supabase = createPublicClient();
  return fetchPosts(
    "category posts",
    supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, content, cover_image, featured, published_at, created_at, updated_at, categories!inner(id, name, slug), post_tags(tags(id, name, slug))"
      )
      .eq("status", "published")
      .eq("categories.slug", categorySlug)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
  );
}

export async function getPublishedPostsByTag(
  tagSlug: string
): Promise<BlogQueryResult<PublicPost[]>> {
  if (!isValidSlug(tagSlug)) return { data: [], error: null };

  const supabase = createPublicClient();
  return fetchPosts(
    "tag posts",
    supabase
      .from("posts")
      .select(TAG_FILTER_POST_SELECT)
      .eq("status", "published")
      .eq("post_tags.tags.slug", tagSlug)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
  );
}
