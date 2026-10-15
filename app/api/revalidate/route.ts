import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { WP_CACHE_TAG } from "@/lib/wp";

/**
 * On-demand revalidation. WordPress calls this whenever content is saved:
 *   POST /api/revalidate  with header  x-revalidate-secret: <REVALIDATE_SECRET>
 * Optional JSON body { "tag": "global-settings" } to refresh a single item.
 */
/** Constant-time comparison so the secret can't be guessed from response timing. */
function secretMatches(given: string | null) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  let tag = WP_CACHE_TAG;
  try {
    const body = await request.json();
    if (typeof body?.tag === "string" && /^[\w-]{1,64}$/.test(body.tag)) tag = body.tag;
  } catch {
    /* no body: revalidate everything */
  }
  // Expire immediately so the very next visit gets the updated WordPress content.
  revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: true, tag, now: Date.now() }, { headers: { "Cache-Control": "no-store" } });
}
