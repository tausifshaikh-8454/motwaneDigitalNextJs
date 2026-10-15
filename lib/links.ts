/**
 * Turns a URL saved in WordPress into a site link:
 * absolute links to the WordPress domain become internal paths.
 */
export function toHref(url: string | undefined | null): string {
  if (!url) return "#";
  const wpBase = process.env.WP_BASE_URL;
  if (wpBase && url.startsWith(wpBase)) {
    const path = url.slice(wpBase.length) || "/";
    return path.startsWith("/") ? path : `/${path}`;
  }
  // Only normal links are allowed (blocks javascript:, data: and similar).
  return /^(https?:|mailto:|tel:|\/|#)/i.test(url.trim()) ? url.trim() : "#";
}

/**
 * CSS background-image value for an image URL from WordPress.
 * Only http(s) URLs are used, and characters that could break out of url("…") are encoded.
 */
export function cssUrl(url: string | undefined | null): string | undefined {
  if (!url || !/^https?:\/\//i.test(url)) return undefined;
  return `url("${url.replace(/["'()\\\s]/g, (c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)}")`;
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
