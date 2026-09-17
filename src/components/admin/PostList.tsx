import Link from "next/link";
import PostStatus from "@/components/admin/PostStatus";
import DeletePostButton from "@/components/admin/DeletePostButton";

export type AdminPostRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  published_at: string | null;
  updated_at: string | null;
  category_name: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function ActionLinks({ post }: { post: AdminPostRow }) {
  return (
    <div className="flex items-center gap-3 md:justify-end">
      <Link
        href={`/admin/posts/${post.id}/edit`}
        className="text-xs tracking-[0.08em] text-muted-foreground underline-offset-2 hover:underline hover:text-foreground"
      >
        Edit
      </Link>
      <DeletePostButton postId={post.id} postTitle={post.title} />
    </div>
  );
}

export default function PostList({ posts }: { posts: AdminPostRow[] }) {
  return (
    <div className="mt-6">
      <div
        role="rowgroup"
        className="hidden border-b border-border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-4"
      >
        <p role="columnheader">Title</p>
        <p role="columnheader">Category</p>
        <p role="columnheader">Status</p>
        <p role="columnheader">Featured</p>
        <p role="columnheader">Published</p>
        <p role="columnheader">Updated</p>
        <p role="columnheader" className="text-right">
          Actions
        </p>
      </div>

      <ul role="rowgroup" className="divide-y divide-border">
        {posts.map((post) => (
          <li key={post.id}>
            <div className="hidden border-b border-border px-4 py-4 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-4">
              <div className="min-w-0 pr-4">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-sm font-medium leading-snug hover:text-accent"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  /{post.slug}
                </p>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {post.category_name ?? "Uncategorized"}
              </p>
              <PostStatus status={post.status} />
              <p className="text-xs text-muted-foreground">
                {post.featured ? "Featured" : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.published_at)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.updated_at)}
              </p>
              <ActionLinks post={post} />
            </div>

            <div className="border-b border-border px-4 py-4 md:hidden">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-sm font-medium leading-snug hover:text-accent"
              >
                {post.title}
              </Link>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="truncate">
                    {post.category_name ?? "Uncategorized"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <PostStatus status={post.status} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Featured</dt>
                  <dd>{post.featured ? "Featured" : "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Published</dt>
                  <dd>{formatDate(post.published_at)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd>{formatDate(post.updated_at)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <ActionLinks post={post} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}