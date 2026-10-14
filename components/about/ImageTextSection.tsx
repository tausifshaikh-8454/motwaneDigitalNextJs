import type { ReactNode } from "react";
import { WpImage } from "@/components/ui/WpImage";
import type { WPImage } from "@/types/wp";

/**
 * Image on the left, eyebrow + heading + text on the right
 * (About "Our Story" and Careers "Our Ethics").
 */
export function ImageTextSection({
  image,
  imageAlt,
  eyebrow,
  headingHtml,
  text,
  children,
  imageClassName,
  gridClassName,
  headingClassName,
  textClassName,
  className = "",
}: {
  image: WPImage | false | null | undefined;
  imageAlt?: string;
  eyebrow?: string;
  /** Heading from WordPress; may contain <br /> line breaks */
  headingHtml?: string;
  text?: string;
  children?: ReactNode;
  imageClassName: string;
  gridClassName: string;
  /** Font sizes per breakpoint */
  headingClassName: string;
  textClassName: string;
  className?: string;
}) {
  return (
    <section className={`container-site ${className}`}>
      <div className={`grid items-center gap-y-10 md:gap-y-0 ${gridClassName}`}>
        <div className={`relative w-full overflow-hidden rounded-md ${imageClassName}`}>
          {image && (
            <WpImage
              image={image}
              alt={image.alt || imageAlt}
              fill
              sizes="(min-width: 1024px) 480px, (min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div>
          {eyebrow && (
            <p className="text-xl font-medium uppercase leading-[1.4] text-primary md:text-[22px] lg:text-eyebrow">{eyebrow}</p>
          )}
          {headingHtml && (
            <h2
              className={`mt-2.5 font-bold leading-[1.4] text-ink ${headingClassName}`}
              dangerouslySetInnerHTML={{ __html: headingHtml }}
            />
          )}
          {text && <p className={`mt-2.5 leading-[1.4] text-ink ${textClassName}`}>{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
