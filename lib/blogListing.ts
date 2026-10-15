import { notFound } from "next/navigation";
import { getAllPosts, getBlogSettings, getCategories, getPostsPage } from "./wp";

/** Loads everything a blog listing page needs; 404s for unknown categories or pages. */
export async function loadBlogListing(page: number, categorySlug: string | null) {
  if (!Number.isInteger(page) || page < 1) notFound();
  const [settings, categories, all] = await Promise.all([getBlogSettings(), getCategories(), getAllPosts()]);
  const category = categorySlug ? categories.find((c) => c.slug === categorySlug) : null;
  if (categorySlug && !category) notFound();

  const perPage = Number(settings?.posts_per_page) || 9;
  const { posts, totalPages } = await getPostsPage(page, perPage, category?.id);
  if (page > 1 && !posts.length) notFound();

  return {
    settings,
    categories,
    mustRead: all.filter((p) => p.acf?.must_read),
    posts,
    totalPages,
  };
}

/** Page numbers to prerender for a listing. */
export async function listingPageParams(categoryId?: number) {
  const settings = await getBlogSettings();
  const perPage = Number(settings?.posts_per_page) || 9;
  const { totalPages } = await getPostsPage(1, perPage, categoryId);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => String(i + 2));
}
