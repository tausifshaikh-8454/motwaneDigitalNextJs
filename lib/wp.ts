import axios from "axios";
import { cacheLife, cacheTag } from "next/cache";
import type {
  BlogSettings,
  ContactAcf,
  GlobalSettings,
  WebinarsSettings,
  WPCategory,
  WPPage,
  WPPost,
  WPProduct,
  WPWebinar,
} from "@/types/wp";

/**
 * Shared axios instance for every WordPress request.
 * The base URL comes from WP_API_URL in .env.local — never hard-coded.
 */
export const wp = axios.create({
  baseURL: process.env.WP_API_URL,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

/** Cache tag used by /api/revalidate to refresh all WordPress data. */
export const WP_CACHE_TAG = "wp";

/** Fetch a single page by slug (ACF values in "standard" format: images as objects). */
export async function getPageBySlug<TAcf = Record<string, unknown>>(
  slug: string,
): Promise<WPPage<TAcf> | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, `page:${slug}`);

  const { data } = await wp.get<WPPage<TAcf>[]>("/wp/v2/pages", {
    params: { slug, acf_format: "standard" },
  });
  return data[0] ?? null;
}

/** Site-wide settings (logo, contact details, social links, popups, footer). */
export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "global-settings");

  const page = await getPageBySlug<GlobalSettings>("global-settings");
  return page?.acf ?? null;
}

/** All products, ordered as in WordPress (Order attribute). */
export async function getProducts(): Promise<WPProduct[]> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "products");

  const { data } = await wp.get<WPProduct[]>("/wp/v2/products", {
    params: { acf_format: "standard", per_page: 100, orderby: "menu_order", order: "asc" },
  });
  return data;
}

/** A single product by slug. */
export async function getProductBySlug(slug: string): Promise<WPProduct | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "products", `product:${slug}`);

  const { data } = await wp.get<WPProduct[]>("/wp/v2/products", {
    params: { slug, acf_format: "standard" },
  });
  return data[0] ?? null;
}

/* ---------------------------------- Blog ---------------------------------- */

const POST_CARD_FIELDS = "id,slug,date,title,categories,acf,featured_media,_links,_embedded";

export async function getBlogSettings(): Promise<BlogSettings | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "blog-settings");
  const page = await getPageBySlug<BlogSettings>("blog");
  return page?.acf ?? null;
}

export async function getCategories(): Promise<WPCategory[]> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "categories");
  const { data } = await wp.get<WPCategory[]>("/wp/v2/categories", {
    params: { per_page: 100, hide_empty: true, orderby: "name", order: "asc", _fields: "id,name,slug,count" },
  });
  return data.filter((c) => c.slug !== "uncategorized");
}

/** One page of posts (newest first), optionally filtered by category. */
export async function getPostsPage(
  page: number,
  perPage: number,
  categoryId?: number,
): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "posts");
  try {
    const res = await wp.get<WPPost[]>("/wp/v2/posts", {
      params: {
        page,
        per_page: perPage,
        categories: categoryId,
        _embed: "wp:featuredmedia,wp:term",
        _fields: POST_CARD_FIELDS,
        acf_format: "standard",
      },
    });
    return {
      posts: res.data,
      total: Number(res.headers["x-wp-total"] ?? res.data.length),
      totalPages: Number(res.headers["x-wp-totalpages"] ?? 1),
    };
  } catch (err) {
    // WordPress answers 400 for a page number past the end.
    if (axios.isAxiosError(err) && err.response?.status === 400) return { posts: [], total: 0, totalPages: 0 };
    throw err;
  }
}

/** Every published post (card fields only) — used for Must Read, related posts and static params. */
export async function getAllPosts(): Promise<WPPost[]> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "posts");
  const all: WPPost[] = [];
  for (let page = 1; ; page++) {
    const { posts, totalPages } = await getPostsPage(page, 100);
    all.push(...posts);
    if (page >= totalPages || !posts.length) break;
  }
  return all;
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "posts", `post:${slug}`);
  const { data } = await wp.get<WPPost[]>("/wp/v2/posts", {
    params: { slug, _embed: "wp:featuredmedia,wp:term", acf_format: "standard" },
  });
  return data[0] ?? null;
}

/* -------------------------------- Webinars -------------------------------- */

export async function getWebinarsSettings(): Promise<WebinarsSettings | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "webinars-settings");
  const page = await getPageBySlug<WebinarsSettings>("webinars");
  return page?.acf ?? null;
}

/** Every published webinar, newest webinar date first. */
export async function getWebinars(): Promise<WPWebinar[]> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "webinars");
  const { data } = await wp.get<WPWebinar[]>("/wp/v2/webinars", {
    params: {
      per_page: 100,
      _embed: "wp:featuredmedia",
      _fields: "id,slug,date,title,acf,featured_media,_links,_embedded",
      acf_format: "standard",
    },
  });
  return [...data].sort(
    (a, b) => (b.acf?.webinar_date ?? "").localeCompare(a.acf?.webinar_date ?? "") || b.date.localeCompare(a.date),
  );
}

export async function getWebinarBySlug(slug: string): Promise<WPWebinar | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "webinars", `webinar:${slug}`);
  const { data } = await wp.get<WPWebinar[]>("/wp/v2/webinars", {
    params: { slug, _embed: "wp:featuredmedia", acf_format: "standard" },
  });
  return data[0] ?? null;
}

/* --------------------------------- Contact -------------------------------- */

export async function getContactSettings(): Promise<ContactAcf | null> {
  "use cache";
  cacheLife("wordpress");
  cacheTag(WP_CACHE_TAG, "contact");
  const page = await getPageBySlug<ContactAcf>("contact-us");
  return page?.acf ?? null;
}
