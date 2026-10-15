import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogListing } from "@/components/blog/BlogListing";
import { getCategories } from "@/lib/wp";
import { listingPageParams, loadBlogListing } from "@/lib/blogListing";
import { decodeEntities } from "@/lib/links";
import { yoastToMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const out: { category: string; page: string }[] = [];
  for (const c of await getCategories()) {
    for (const page of await listingPageParams(c.id)) out.push({ category: c.slug, page });
  }
  // Cache Components needs at least one param; a missing page simply renders the 404 page.
  return out.length ? out : [{ category: "uncategorized", page: "2" }];
}

export async function generateMetadata(props: PageProps<"/blog/category/[category]/page/[page]">): Promise<Metadata> {
  const { category, page } = await props.params;
  const cat = (await getCategories()).find((c) => c.slug === category);
  const base = yoastToMetadata(
    cat?.yoast_head_json,
    cat ? decodeEntities(cat.name) : "Blogs",
    `/blog/category/${category}/page/${page}/`,
  );
  return { ...base, title: `${String(base.title ?? "Blogs")} - Page ${page}` };
}

async function Listing({ params }: Pick<PageProps<"/blog/category/[category]/page/[page]">, "params">) {
  const { category, page } = await params;
  const n = Number(page);
  const d = await loadBlogListing(n, category);
  return (
    <BlogListing
      settings={d.settings}
      mustRead={d.mustRead}
      categories={d.categories}
      activeCategory={category}
      posts={d.posts}
      sliderPosts={d.sliderPosts}
      page={n}
      totalPages={d.totalPages}
      basePath={`/blog/category/${category}/`}
    />
  );
}

export default function BlogCategoryPaged(props: PageProps<"/blog/category/[category]/page/[page]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Listing params={props.params} />
    </Suspense>
  );
}
