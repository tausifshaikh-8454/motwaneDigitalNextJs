import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/BlogListing";
import { getPageBySlug } from "@/lib/wp";
import { loadBlogListing } from "@/lib/blogListing";
import { yoastToMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("blog");
  return yoastToMetadata(page?.yoast_head_json, "Blogs", "/blog/");
}

export default async function BlogPage() {
  const d = await loadBlogListing(1, null);
  return (
    <BlogListing
      settings={d.settings}
      mustRead={d.mustRead}
      categories={d.categories}
      activeCategory={null}
      posts={d.posts}
      sliderPosts={d.sliderPosts}
      page={1}
      totalPages={d.totalPages}
      basePath="/blog/"
    />
  );
}
