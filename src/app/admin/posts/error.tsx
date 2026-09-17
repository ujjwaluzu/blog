"use client";

export default function AdminPostsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;

  return (
    <main>
      <h1 className="font-display text-2xl">Posts</h1>
      <div className="mt-6 border border-border px-6 py-16 text-center">
        <h2 className="font-display text-xl">Couldn&rsquo;t load posts.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Please try again shortly.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 border border-border px-4 py-2 text-xs tracking-[0.08em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          Try again
        </button>
      </div>
    </main>
  );
}