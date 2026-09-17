import Image from "next/image";

type EditorialImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export default function EditorialImage({
  src,
  alt,
  className,
  sizes = "100vw",
}: EditorialImageProps) {
  return (
    <div
      className={`relative overflow-hidden border border-border bg-muted ${
        className ?? ""
      }`}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}