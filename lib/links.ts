/**
 * Turns a URL saved in WordPress into a site link:
 * absolute links to the WordPress domain become internal paths.
 */
export function toHref(url: string | undefined | null): string {
  if (!url) return "#";
  const wpBase = process.env.WP_BASE_URL ?? process.env.NEXT_PUBLIC_WP_BASE_URL;
  if (wpBase && url.startsWith(wpBase)) {
    const path = url.slice(wpBase.length) || "/";
    return path.startsWith("/") ? path : `/${path}`;
  }
  return url;
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/** Decode the HTML entities WordPress adds to titles (e.g. &#8211;). */
export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}
