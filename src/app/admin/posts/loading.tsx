export default function AdminPostsLoading() {
  return (
    <main>
      <div className="h-8 w-32 bg-muted animate-pulse" />
      <div className="mt-2 h-4 w-56 bg-muted animate-pulse" />

      <div className="mt-8 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-20 bg-muted animate-pulse" />
        ))}
      </div>

      <div className="mt-6 divide-y divide-border">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between px-4 py-5">
            <div className="space-y-2">
              <div className="h-4 w-56 bg-muted animate-pulse" />
              <div className="h-3 w-36 bg-muted animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}