import Link from "next/link";
import { getArticleTopics } from "@/lib/posts/admin-queries";
import PostEditor, {
  type CategoryOption,
  type PostEditorValues,
} from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const topics = await getArticleTopics();
  const categories: CategoryOption[] = topics.data.map((topic) => ({
    id: topic.id,
    name: topic.name,
  }));

  const initial: PostEditorValues = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: categories[0]?.id ?? null,
    status: "draft",
    featured: false,
    published_at: null,
    cover_image: null,
  };

  return (
    <main>
      <Link
        href="/admin/posts"
        className="text-xs tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        &larr; Back to Posts
      </Link>

      <h1 className="mt-4 font-display text-3xl">New Post</h1>

      {topics.error || categories.length !== 3 ? (
        <p role="alert" className="mt-4 border border-border bg-muted px-4 py-3 text-sm text-accent">
          The three article topics are not available yet. Apply the topic seed migration before creating an article.
        </p>
      ) : null}

      <div className="mt-8">
        <PostEditor mode="new" categories={categories} initial={initial} />
      </div>
    </main>
  );
}
