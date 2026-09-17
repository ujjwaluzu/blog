import Link from "next/link";
import PostList from "@/components/admin/PostList";
import { getAdminPosts, getArticleTopics } from "@/lib/posts/admin-queries";
import { isArticleTopicSlug } from "@/lib/topics";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = [
  { label: "All", value: null },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
] as const;

function postsHref(status: string | null, category: string | null) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/admin/posts?${query}` : "/admin/posts";
}

export default async function AdminPostsPage(props: PageProps<"/admin/posts">) {
  const searchParams = await props.searchParams;
  const statusParam = searchParams.status;
  const categoryParam = searchParams.category;
  const status =
    typeof statusParam === "string" &&
    ["draft", "published", "archived"].includes(statusParam)
      ? (statusParam as "draft" | "published" | "archived")
      : null;
  const category =
    typeof categoryParam === "string" && isArticleTopicSlug(categoryParam)
      ? categoryParam
      : null;

  const [result, topics] = await Promise.all([
    getAdminPosts({ status, category }),
    getArticleTopics(),
  ]);

  const newPostButton = (
    <Link
      href="/admin/posts/new"
      className="border border-border px-4 py-2 text-xs tracking-[0.08em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
    >
      + New article
    </Link>
  );

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage published articles and drafts.
          </p>
        </div>
        {newPostButton}
      </div>

      <nav aria-label="Filter articles by status" className="mt-8 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = filter.value === status;
          return (
            <Link
              key={filter.value ?? "all"}
              href={postsHref(filter.value, category)}
              aria-current={active ? "page" : undefined}
              className={`border px-3 py-1.5 text-xs tracking-[0.08em] uppercase transition-colors ${
                active
                  ? "border-accent bg-muted font-medium text-accent"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      <nav aria-label="Filter articles by topic" className="mt-3 flex flex-wrap gap-2">
        <Link
          href={postsHref(status, null)}
          aria-current={!category ? "page" : undefined}
          className={`text-xs tracking-[0.08em] uppercase transition-colors ${
            !category ? "text-accent" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All topics
        </Link>
        {topics.data.map((topic) => (
          <Link
            key={topic.id}
            href={postsHref(status, topic.slug)}
            aria-current={category === topic.slug ? "page" : undefined}
            className={`text-xs tracking-[0.08em] uppercase transition-colors ${
              category === topic.slug
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {topic.name}
          </Link>
        ))}
      </nav>

      {result.error || topics.error ? (
        <div className="mt-6 border border-border px-6 py-16 text-center">
          <h2 className="font-display text-xl">Couldn&rsquo;t load articles.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong on our end. Please try again shortly.
          </p>
        </div>
      ) : result.data.length === 0 ? (
        <div className="mt-6 border border-border px-6 py-16 text-center">
          <h2 className="font-display text-xl">No articles found.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start writing your first article.
          </p>
          <div className="mt-6 flex justify-center">{newPostButton}</div>
        </div>
      ) : (
        <PostList posts={result.data} />
      )}
    </main>
  );
}
