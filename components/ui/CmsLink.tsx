import Link from "next/link";
import type { ReactNode } from "react";
import { isExternal, toHref } from "@/lib/links";
import type { WPLink } from "@/types/wp";

/** Renders an ACF link field (internal links use next/link). */
export function CmsLink({
  link,
  className,
  children,
}: {
  link: WPLink | null | "" | undefined;
  className?: string;
  children?: ReactNode;
}) {
  if (!link || !link.url) return null;
  const href = toHref(link.url);
  const content = children ?? link.title;
  if (isExternal(href) || link.target === "_blank") {
    return (
      <a
        href={href}
        target={link.target || undefined}
        rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
