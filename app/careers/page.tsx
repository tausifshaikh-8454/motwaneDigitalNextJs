import type { Metadata } from "next";
import Link from "next/link";
import { ImageTextSection } from "@/components/about/ImageTextSection";
import { CmsLink } from "@/components/ui/CmsLink";
import { getPageBySlug } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import type { CareersAcf } from "@/types/wp";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("careers");
  return yoastToMetadata(page?.yoast_head_json, "Careers", "/careers/");
}

/** Careers page — all content (including the openings table) comes from the WordPress page "careers". */
export default async function CareersPage() {
  const page = await getPageBySlug<CareersAcf>("careers");
  const acf = page?.acf;
  const openings = (acf?.openings || []).filter((o) => o.show && o.title);

  return (
    <>
      {/* Banner */}
      <section className="bg-tint-strong py-[60px] lg:pb-[90px] lg:pt-[85px]">
        <div className="container-site text-center">
          {acf?.hero_title && (
            <h1 className="mx-auto max-w-[285px] text-2xl font-bold leading-[1.4] text-primary md:max-w-none lg:text-h1">
              {acf.hero_title}
            </h1>
          )}
          {acf?.hero_subtitle && (
            <p className="mt-4 text-xl font-medium leading-[1.4] text-ink md:text-[22px] lg:text-[32px]">{acf.hero_subtitle}</p>
          )}
          {acf?.hero_text && (
            <p className="mx-auto mt-4 max-w-[627px] leading-[1.4] text-ink lg:text-xl">{acf.hero_text}</p>
          )}
          {acf?.hero_button && (
            <CmsLink
              link={acf.hero_button}
              className="mt-[29px] inline-block bg-accent px-8 py-4 font-medium leading-[1.4] text-ink transition-colors hover:bg-primary hover:text-white lg:text-xl"
            />
          )}
        </div>
      </section>

      {/* Our Ethics */}
      <ImageTextSection
        className="py-[60px] lg:py-[87px]"
        gridClassName="md:grid-cols-[243fr_422fr] md:gap-x-[60px] lg:grid-cols-[457fr_743fr] lg:gap-x-[59px]"
        imageClassName="mx-5 w-auto aspect-[457/372] md:mx-0"
        image={acf?.ethics_image}
        imageAlt={acf?.ethics_eyebrow}
        eyebrow={acf?.ethics_eyebrow}
        headingHtml={acf?.ethics_heading}
        text={acf?.ethics_text}
        headingClassName="text-[22px] md:text-[30px] lg:text-[32px]"
        textClassName="lg:text-xl"
      />

      {/* Current openings */}
      {(acf?.openings_heading || openings.length > 0) && (
        <section id="open" className="scroll-mt-[var(--header-h)] bg-primary pb-[60px] pt-[60px] lg:pb-[93px] lg:pt-[70px]">
          <div className="container-site px-10 lg:px-5">
            {acf?.openings_heading && (
              <h2 className="text-2xl font-bold leading-[1.4] text-white lg:text-h1">{acf.openings_heading}</h2>
            )}
            {openings.length > 0 && (
              <table className="mt-5 w-full border-collapse border border-white/60 text-lg leading-[1.4]">
                <tbody>
                  {openings.map((o, i) => (
                    <tr key={i} className="block border-b border-white/60 last:border-b-0 md:table-row md:border-b">
                      <td className="block px-5 pt-4 font-semibold text-white md:table-cell md:w-[36%] md:border md:border-white/60 md:py-4">
                        {o.title}
                      </td>
                      <td className="block px-5 font-semibold text-[#a5deff] md:table-cell md:w-[24%] md:border md:border-white/60 md:py-4 lg:pl-7">
                        {o.location}
                      </td>
                      <td className="block px-5 font-semibold text-[#a5deff] md:table-cell md:w-[17%] md:border md:border-white/60 md:py-4 lg:pl-7">
                        {o.type}
                      </td>
                      <td className="block px-5 pb-4 pt-2 md:table-cell md:border md:border-white/60 md:py-4 md:text-right">
                        <Link
                          href={`/apply-now/?poi=${encodeURIComponent(o.location ? `${o.title} – ${o.location}` : o.title)}`}
                          className="inline-block rounded-[5px] bg-accent px-5 py-2.5 font-medium leading-[29px] text-ink transition-colors hover:bg-white"
                        >
                          {acf?.apply_label || "Apply Now"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </>
  );
}
