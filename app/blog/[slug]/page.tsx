import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostCard } from "@/components/blog/PostCard";
import { RelatedCarousel } from "@/components/blog/RelatedPosts";
import { ShareLinks } from "@/components/blog/ShareLinks";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { getAllPosts, getBlogSettings, getPostBySlug } from "@/lib/wp";
import { featuredImage, formatDate, internalizeLinks, readingMinutes, withHeadingIds } from "@/lib/blog";
import { decodeEntities } from "@/lib/links";
import { sanitizeWpHtml } from "@/lib/sanitize";
import { SITE_URL } from "@/lib/site";
import { yoastToMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return (posts.length ? posts.map((p) => p.slug) : ["hello-world"]).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return yoastToMetadata(post.yoast_head_json, decodeEntities(post.title.rendered), `/blog/${slug}/`);
}

const contentStyles = [
  "text-[#090909] leading-6",
  "[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:scroll-mt-28 [&_h2]:text-[22px] [&_h2]:leading-[1.4] [&_h2]:text-primary",
  "[&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:scroll-mt-28 [&_h3]:text-xl [&_h3]:leading-[1.4] [&_h3]:text-primary",
  "[&_h4]:mb-2 [&_h4]:mt-5 [&_h4]:text-lg [&_h4]:text-primary",
  "[&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2",
  "[&_a]:text-primary hover:[&_a]:underline [&_strong]:font-semibold",
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md [&_figure]:my-6",
  "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#d0dbe5] [&_td]:p-2.5 [&_th]:border [&_th]:border-[#d0dbe5] [&_th]:bg-tint [&_th]:p-2.5 [&_th]:text-left",
  "[&>*:first-child]:mt-0",
].join(" ");

async function Article({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const [post, settings, all] = await Promise.all([getPostBySlug(slug), getBlogSettings(), getAllPosts()]);
  if (!post) notFound();

  const title = decodeEntities(post.title.rendered);
  const { html: rawHtml, toc } = withHeadingIds(internalizeLinks(post.content?.rendered ?? ""));
  const [html, intro] = await Promise.all([
    sanitizeWpHtml(rawHtml),
    sanitizeWpHtml(internalizeLinks(post.acf?.intro ?? "")),
  ]);
  const minutes = readingMinutes(`${post.acf?.intro ?? ""} ${post.content?.rendered ?? ""}`);
  const banner = post.acf?.banner_image || null;
  const fallback = featuredImage(post);
  const siteUrl = SITE_URL;
  const related = all.filter((p) => p.id !== post.id).slice(0, 6);

  return (
    <>
      <article>
        <header className="container-site pt-10 lg:pt-[50px]">
          <h1 className="text-[28px] font-bold leading-[1.4] text-primary lg:text-h1">{title}</h1>
          <div className="mt-5 flex items-center justify-between gap-4 border-b border-[#c7ced6] pb-3 text-xs font-medium text-body sm:text-sm">
            <p>
              {settings?.published_label} <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
            {settings?.read_time_label && (
              <p>
                {minutes} {settings.read_time_label}
              </p>
            )}
          </div>
          {post.acf?.intro && (
            <div
              className="mt-5 pb-10 font-medium leading-6 text-ink [&_a]:text-primary [&_p+p]:mt-3"
              dangerouslySetInnerHTML={{ __html: intro }}
            />
          )}
        </header>

        {(banner || fallback) && (
          <div className="relative h-[240px] w-full sm:h-[360px] lg:h-[469px]">
            <Image
              src={banner ? banner.url : fallback!.url}
              alt={banner ? banner.alt || title : fallback!.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="container-site grid gap-10 py-12 lg:grid-cols-[300px_1fr] lg:gap-[40px] lg:py-[60px] xl:grid-cols-[344px_1fr]">
          <aside className="order-2 lg:order-1">
            <div className="space-y-10 lg:sticky lg:top-[110px]">
              <TableOfContents heading={settings?.toc_heading ?? ""} items={toc} />
              <ShareLinks label={settings?.share_label ?? ""} url={`${siteUrl}/blog/${post.slug}/`} title={title} />
            </div>
          </aside>
          <div className={`order-1 min-w-0 lg:order-2 ${contentStyles}`} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>

      {related.length > 0 && (
        <RelatedCarousel heading={settings?.related_heading ?? ""}>
          {related.map((p) => (
            <div key={p.id} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
              <PostCard post={p} />
            </div>
          ))}
        </RelatedCarousel>
      )}
    </>
  );
}

export default function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Article params={props.params} />
    </Suspense>
  );
}
