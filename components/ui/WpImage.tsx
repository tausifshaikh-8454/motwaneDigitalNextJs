import Image from "next/image";
import type { WPImage } from "@/types/wp";

/** next/image wrapper for WordPress media (SVGs are served as-is). */
export function WpImage({
  image,
  className,
  sizes,
  priority,
  fill,
  alt,
}: {
  image: WPImage | false | null | undefined;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  alt?: string;
}) {
  if (!image) return null;
  const isSvg = image.mime_type === "image/svg+xml";
  const common = {
    src: image.url,
    alt: alt ?? image.alt ?? "",
    className,
    sizes,
    priority,
    unoptimized: isSvg,
  };
  if (fill) return <Image {...common} alt={common.alt} fill />;
  return <Image {...common} alt={common.alt} width={image.width || 80} height={image.height || 80} />;
}
