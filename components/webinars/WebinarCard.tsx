import Image from "next/image";
import Link from "next/link";
import { LongArrowRight } from "@/components/ui/Icons";
import { decodeEntities } from "@/lib/links";
import { featuredImage } from "@/lib/blog";
import { formatWebinarDate, webinarIsoDate } from "@/lib/webinars";
import type { WPWebinar } from "@/types/wp";

/** Webinar card: image, status pill + date, title, "Learn More". */
export function WebinarCard({
  webinar,
  learnMore,
  priority = false,
  sizes = "(min-width: 1024px) 300px, (min-width: 768px) 50vw, 100vw",
}: {
  webinar: WPWebinar;
  learnMore: string;
  priority?: boolean;
  sizes?: string;
}) {
  const href = `/webinars/${webinar.slug}/`;
  const title = decodeEntities(webinar.title.rendered);
  const img = featuredImage(webinar); // the card image is the webinar's Featured Image
  const status = webinar.acf?.webinar_status;
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-4/3 overflow-hidden rounded-t-[10px]" aria-label={title}>
        {img && (
          <Image
            src={img.url}
            alt={img.alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col rounded-b-[10px] bg-white p-5 shadow-[5px_5px_10px_0px_rgba(13,108,179,0.25)]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {status && (
            <span className="rounded-[20px] bg-primary px-2.5 py-1.25 text-sm font-medium leading-5 text-white">
              {status}
            </span>
          )}
          <time dateTime={webinarIsoDate(webinar.acf?.webinar_date)} className="text-sm font-medium leading-5 text-[#918787]">
            {formatWebinarDate(webinar.acf?.webinar_date)}
          </time>
        </div>
        <h2 className="mt-2.5 line-clamp-3 min-h-[75.6px] text-lg font-bold leading-[1.4] text-primary">
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        </h2>
        {learnMore && (
          <Link
            href={href}
            className="mt-auto flex items-center gap-2.5 pt-4.5 leading-[1.4] text-primary transition-[gap] hover:gap-4"
            tabIndex={-1}
            aria-hidden="true"
          >
            {learnMore}
            <LongArrowRight className="h-4 w-6.75" />
          </Link>
        )}
      </div>
    </article>
  );
}
