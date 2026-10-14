import { revalidateTag } from "next/cache";
import { WP_CACHE_TAG } from "@/lib/wp";

/**
 * On-demand revalidation. WordPress calls this whenever content is saved:
 *   POST /api/revalidate  with header  x-revalidate-secret: <REVALIDATE_SECRET>
 * Optional JSON body { "tag": "global-settings" } to refresh a single item.
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }
  let tag = WP_CACHE_TAG;
  try {
    const body = await request.json();
    if (typeof body?.tag === "string" && body.tag) tag = body.tag;
  } catch {
    /* no body: revalidate everything */
  }
  // Expire immediately so the very next visit gets the updated WordPress content.
  revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: true, tag, now: Date.now() });
}
