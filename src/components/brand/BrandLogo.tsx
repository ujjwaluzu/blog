import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/icons/favicon.png"
      alt="UJJWALUZU"
      width={1254}
      height={1254}
      priority={priority}
      className={className}
    />
  );
}
