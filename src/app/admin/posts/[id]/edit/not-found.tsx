import Link from "next/link";

export default function EditPostNotFound() {
  return (
    <main>
      <h1 className="font-display text-3xl">Post not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This post doesn&rsquo;t exist or has been removed.
      </p>
      <Link
        href="/admin/posts"
        className="mt-6 inline-block border border-border px-4 py-2 text-xs tracking-[0.08em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
      >
        &larr; Back to Posts
      </Link>
    </main>
  );
}