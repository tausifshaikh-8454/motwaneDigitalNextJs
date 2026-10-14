import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogListing } from "@/components/blog/BlogListing";
import { getPageBySlug } from "@/lib/wp";
import { listingPageParams, loadBlogListing } from "@/lib/blogListing";
import { yoastToMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const pages = await listingPageParams();
  // Cache Components needs at least one param; a missing page simply renders the 404 page.
  return (pages.length ? pages : ["2"]).map((page) => ({ page }));
}

export async function generateMetadata(props: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const { page } = await props.params;
  const wpPage = await getPageBySlug("blog");
  const base = yoastToMetadata(wpPage?.yoast_head_json, "Blogs");
  return { ...base, title: `${String(base.title ?? "Blogs")} - Page ${page}` };
}

async function Listing({ params }: Pick<PageProps<"/blog/page/[page]">, "params">) {
  const n = Number((await params).page);
  const d = await loadBlogListing(n, null);
  return (
    <BlogListing
      settings={d.settings}
      mustRead={d.mustRead}
      categories={d.categories}
      activeCategory={null}
      posts={d.posts}
      page={n}
      totalPages={d.totalPages}
      basePath="/blog/"
    />
  );
}

export default function BlogPaged(props: PageProps<"/blog/page/[page]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Listing params={props.params} />
    </Suspense>
  );
}
