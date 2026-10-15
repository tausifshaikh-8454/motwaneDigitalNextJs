import { notFound } from "next/navigation";
import { internalizeLinks } from "@/lib/blog";
import { decodeEntities } from "@/lib/links";
import { sanitizeWpHtml } from "@/lib/sanitize";
import { getPageBySlug } from "@/lib/wp";

const contentStyles = [
  "leading-[1.4] text-ink",
  // First paragraph = introduction (larger, slightly indented)
  "[&>p:first-child]:mb-[31px] [&>p:first-child]:text-lg [&>p:first-child]:leading-[1.65] md:[&>p:first-child]:px-5",
  "[&_h2]:mb-2.5 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:leading-[1.4] [&_h2]:text-[#1a1a1a] lg:[&_h2]:text-[22px]",
  "[&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium",
  "[&_p]:mb-7 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-12 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-12",
  "[&_a]:text-primary hover:[&_a]:underline [&_strong]:font-semibold",
].join(" ");

/**
 * Text page (Terms & Conditions, Privacy Policy): title + the WordPress page content
 * edited in the normal WordPress editor.
 */
export async function LegalPage({ slug }: { slug: string }) {
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  return (
    <article className="container-site pb-0 pt-[50px]">
      <h1 className="text-center text-2xl font-bold leading-[1.4] text-primary lg:text-h1">
        {decodeEntities(page.title.rendered)}
      </h1>
      <div
        className={`mt-5 lg:px-5 ${contentStyles}`}
        dangerouslySetInnerHTML={{ __html: sanitizeWpHtml(internalizeLinks(page.content?.rendered ?? "")) }}
      />
    </article>
  );
}
