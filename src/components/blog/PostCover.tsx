import EditorialImage from "@/components/ui/EditorialImage";

export default function PostCover({
  src,
  alt,
  className,
  sizes,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center border border-border bg-muted px-6 text-center text-xs tracking-[0.12em] text-muted-foreground uppercase ${className ?? ""}`}
      >
        No cover image
      </div>
    );
  }

  return <EditorialImage src={src} alt={alt} className={className} sizes={sizes} />;
}
