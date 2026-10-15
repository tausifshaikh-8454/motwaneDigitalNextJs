import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogListing } from "@/components/blog/BlogListing";
import { getCategories } from "@/lib/wp";
import { loadBlogListing } from "@/lib/blogListing";
import { decodeEntities } from "@/lib/links";
import { yoastToMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const cats = await getCategories();
  return (cats.length ? cats.map((c) => c.slug) : ["uncategorized"]).map((category) => ({ category }));
}

export async function generateMetadata(props: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const cat = (await getCategories()).find((c) => c.slug === category);
  return yoastToMetadata(cat?.yoast_head_json, cat ? `${decodeEntities(cat.name)} - Blogs` : "Blogs", `/blog/category/${category}/`);
}

async function Listing({ params }: Pick<PageProps<"/blog/category/[category]">, "params">) {
  const { category } = await params;
  const d = await loadBlogListing(1, category);
  return (
    <BlogListing
      settings={d.settings}
      mustRead={d.mustRead}
      categories={d.categories}
      activeCategory={category}
      posts={d.posts}
      sliderPosts={d.sliderPosts}
      page={1}
      totalPages={d.totalPages}
      basePath={`/blog/category/${category}/`}
    />
  );
}

export default function BlogCategoryPage(props: PageProps<"/blog/category/[category]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Listing params={props.params} />
    </Suspense>
  );
}
