const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export default function PostStatus({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;

  const dotClass =
    status === "published"
      ? "bg-accent"
      : status === "archived"
        ? "bg-muted-foreground/40"
        : "bg-muted-foreground/70";

  const textClass =
    status === "archived" ? "text-muted-foreground" : "text-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] ${textClass}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}