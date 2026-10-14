import type { Metadata } from "next";
import { ImageTextSection } from "@/components/about/ImageTextSection";
import { CmsLink } from "@/components/ui/CmsLink";
import { WpImage } from "@/components/ui/WpImage";
import { getPageBySlug } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import type { AboutAcf } from "@/types/wp";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about-us");
  return yoastToMetadata(page?.yoast_head_json, "About Us", "/about-us/");
}

function Arrow() {
  return (
    <svg viewBox="0 0 27 16" className="h-4 w-[22px]" fill="none" aria-hidden="true">
      <path
        d="M1 7a1 1 0 0 0 0 2V7Zm25.707 1.707a1 1 0 0 0 0-1.414L20.343.929a1 1 0 1 0-1.414 1.414L24.586 8l-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364ZM1 8v1h25V7H1v1Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** About Us page — all content comes from the WordPress page "about-us". */
export default async function AboutPage() {
  const page = await getPageBySlug<AboutAcf>("about-us");
  const acf = page?.acf;
  const hero = acf?.hero_image || null;
  const timeline = (acf?.timeline || []).filter((t) => t.year || t.text);
  const line = acf?.timeline_line || null;

  return (
    <>
      {/* Banner */}
      <section
        className="flex min-h-[346px] items-center bg-[#1d2b3a] bg-cover bg-center bg-no-repeat py-14 md:min-h-[352px] lg:min-h-[397px]"
        style={hero ? { backgroundImage: `url("${hero.url}")` } : undefined}
      >
        <div className="container-site text-center text-white">
          {acf?.hero_eyebrow && (
            <p className="font-medium uppercase leading-[1.4] md:text-eyebrow">{acf.hero_eyebrow}</p>
          )}
          {acf?.hero_title && <h1 className="mt-5 text-2xl font-bold leading-[1.4] lg:text-h1">{acf.hero_title}</h1>}
          {acf?.hero_text && (
            <p className="mx-auto mt-5 max-w-[1100px] font-medium leading-[1.4] lg:text-eyebrow">{acf.hero_text}</p>
          )}
        </div>
      </section>

      {/* Our Story */}
      <ImageTextSection
        className="py-[50px] lg:py-20"
        gridClassName="md:grid-cols-[472fr_698fr] md:gap-x-[70px]"
        imageClassName="aspect-[472/479]"
        image={acf?.story_image}
        imageAlt={acf?.story_eyebrow}
        eyebrow={acf?.story_eyebrow}
        headingHtml={acf?.story_heading}
        text={acf?.story_text}
        headingClassName="text-2xl lg:text-[32px]"
        textClassName="md:text-lg lg:text-xl"
      >
        {acf?.story_link && (
          <CmsLink
            link={acf.story_link}
            className="mt-9 inline-flex items-center gap-2.5 text-lg font-medium leading-[1.4] text-primary transition-[gap] hover:gap-4 md:text-[22px] lg:mt-[45px] lg:text-lg"
          >
            {acf.story_link.title}
            <Arrow />
          </CmsLink>
        )}
      </ImageTextSection>

      {/* Timeline */}
      {(acf?.timeline_heading || timeline.length > 0) && (
        <section className="border-b border-primary bg-tint pb-[50px] pt-[50px] lg:py-20">
          <div className="container-site text-center">
            {acf?.timeline_eyebrow && (
              <p className="text-xl font-medium uppercase leading-[1.4] text-primary md:text-[22px] lg:text-eyebrow">
                {acf.timeline_eyebrow}
              </p>
            )}
            {acf?.timeline_heading && (
              <h2 className="mt-2 text-2xl font-bold leading-[1.4] text-ink lg:text-h1">{acf.timeline_heading}</h2>
            )}

            <ol className="mt-[38px] grid gap-y-[50px] md:mt-[57px] md:grid-cols-5 md:gap-x-10 lg:mt-[98px]">
              {timeline.map((t, i) => (
                <li key={i} className="flex flex-col items-center">
                  <div className="relative h-[60px] w-[60px] lg:h-[100px] lg:w-[100px]">
                    {t.icon && <WpImage image={t.icon} alt={t.icon.alt || t.text} fill sizes="100px" className="object-contain" />}
                  </div>
                  {/* Dot on the dotted line */}
                  <div className="relative mt-3 flex w-full justify-center md:mt-10 lg:mt-[56px]">
                    <span
                      aria-hidden="true"
                      className="absolute -inset-x-5 top-1/2 hidden h-px -translate-y-1/2 border-t border-dashed border-primary/60 bg-repeat-x md:block"
                      style={line ? { backgroundImage: `url("${line.url}")`, borderTop: 0 } : undefined}
                    />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                  </div>
                  <p className="mt-[18px] text-[22px] font-bold leading-[1.4] text-primary md:mt-4 lg:text-[32px]">{t.year}</p>
                  <p className="mt-2 leading-[1.4] text-ink md:text-lg lg:text-xl">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </>
  );
}
