export default function EditPostLoading() {
  return (
    <main>
      <div className="h-3 w-28 bg-muted animate-pulse" />
      <div className="mt-4 h-9 w-48 bg-muted animate-pulse" />
      <div className="mt-8 space-y-10">
        <div className="h-12 bg-muted animate-pulse" />
        <div className="h-12 bg-muted animate-pulse" />
        <div className="h-24 bg-muted animate-pulse" />
        <div className="h-[24rem] bg-muted animate-pulse" />
        <div className="h-10 w-64 bg-muted animate-pulse" />
      </div>
    </main>
  );
}