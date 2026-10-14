import Image from "next/image";
import Link from "next/link";
import { decodeEntities } from "@/lib/links";
import { featuredImage, formatDate, primaryCategory } from "@/lib/blog";
import type { WPPost } from "@/types/wp";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" strokeLinecap="round" />
    </svg>
  );
}

/** Blog grid card (image, category tab, date, title). */
export function PostCard({ post, priority = false }: { post: WPPost; priority?: boolean }) {
  const href = `/blog/${post.slug}/`;
  const img = featuredImage(post);
  const cat = primaryCategory(post);
  const title = decodeEntities(post.title.rendered);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[10px_30px_10px_10px] bg-white shadow-[5px_5px_10px_0px_rgba(13,108,179,0.25)]">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-[5px_30px_0_0]" aria-label={title}>
        {img && (
          <Image
            src={img.url}
            alt={img.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {cat && (
          <span className="absolute bottom-0 left-0 rounded-[0_7px_0_0] bg-white px-2.5 py-[5px] text-xs font-bold leading-none text-primary">
            {decodeEntities(cat.name)}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-sm text-muted">
          <CalendarIcon />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-[1.4] text-primary">
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        </h3>
      </div>
    </article>
  );
}

/** Horizontal "Must Read" card. */
export function MustReadCard({ post }: { post: WPPost }) {
  const href = `/blog/${post.slug}/`;
  const img = featuredImage(post);
  const cat = primaryCategory(post);
  const title = decodeEntities(post.title.rendered);
  return (
    <article className="group grid grid-cols-[minmax(0,40%)_1fr] items-center gap-5 overflow-hidden rounded-[0_20px_0_0] bg-white pr-5 shadow-[4px_4px_10px_0px_rgba(170,160,160,0.5)] sm:grid-cols-[minmax(0,285px)_1fr]">
      <Link href={href} className="relative block h-full min-h-[150px] overflow-hidden sm:min-h-[213px]" aria-label={title}>
        {img && (
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="285px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="py-4">
        {cat && (
          <span className="inline-block bg-primary px-3 py-1.5 text-xs font-bold text-white">{decodeEntities(cat.name)}</span>
        )}
        <h3 className="mt-3 text-base font-bold leading-[1.4] text-primary sm:text-xl">
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
