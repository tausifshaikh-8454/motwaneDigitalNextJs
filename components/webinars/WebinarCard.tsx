import Image from "next/image";
import Link from "next/link";
import { decodeEntities } from "@/lib/links";
import { formatWebinarDate, webinarCardImage, webinarIsoDate } from "@/lib/webinars";
import type { WPWebinar } from "@/types/wp";

export function ArrowRight({ className = "h-4 w-[27px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 27 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M1 7a1 1 0 0 0 0 2V7Zm25.707 1.707a1 1 0 0 0 0-1.414L20.343.929a1 1 0 1 0-1.414 1.414L24.586 8l-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364ZM1 8v1h25V7H1v1Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
  const img = webinarCardImage(webinar);
  const status = webinar.acf?.webinar_status;
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-t-[10px]" aria-label={title}>
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
            <span className="rounded-[20px] bg-primary px-2.5 py-[5px] text-sm font-medium leading-5 text-white">
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
            className="mt-auto flex items-center gap-2.5 pt-[18px] leading-[1.4] text-primary transition-[gap] hover:gap-4"
            tabIndex={-1}
            aria-hidden="true"
          >
            {learnMore}
            <ArrowRight />
          </Link>
        )}
      </div>
    </article>
  );
}
