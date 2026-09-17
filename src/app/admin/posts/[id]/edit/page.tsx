import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getArticleTopics } from "@/lib/posts/admin-queries";
import PostEditor, {
  type CategoryOption,
  type PostEditorValues,
} from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPostPage(
  props: PageProps<"/admin/posts/[id]/edit">
) {
  const { id } = await props.params;

  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, category_id, status, featured, published_at, cover_image"
    )
    .eq("id", id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  const topics = await getArticleTopics();
  const categories: CategoryOption[] = topics.data.map((topic) => ({
    id: topic.id,
    name: topic.name,
  }));

  const status = ["draft", "published", "archived"].includes(post.status)
    ? (post.status as "draft" | "published" | "archived")
    : "draft";

  const initial: PostEditorValues = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    category_id: post.category_id,
    status,
    featured: post.featured,
    published_at: post.published_at,
    cover_image: post.cover_image,
  };

  return (
    <main>
      <Link
        href="/admin/posts"
        className="text-xs tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        &larr; Back to Posts
      </Link>

      <h1 className="mt-4 font-display text-3xl">Edit Post</h1>

      {topics.error || categories.length !== 3 ? (
        <p role="alert" className="mt-4 border border-border bg-muted px-4 py-3 text-sm text-accent">
          The three article topics are not available yet. Apply the topic seed migration before saving changes.
        </p>
      ) : null}

      <div className="mt-8">
        <PostEditor
          mode="edit"
          postId={post.id}
          categories={categories}
          initial={initial}
        />
      </div>
    </main>
  );
}
