import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSlider, type HeroSlide } from "@/components/home/HeroSlider";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Offerings } from "@/components/home/Offerings";
import { Features } from "@/components/home/Features";
import { About } from "@/components/home/About";
import { Highlights } from "@/components/home/Highlights";
import { Faq } from "@/components/home/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPageBySlug, getProducts } from "@/lib/wp";
import { decodeEntities, isExternal, toHref } from "@/lib/links";
import { yoastToMetadata } from "@/lib/seo";
import type { HomeAcf, WPLink, WPProduct } from "@/types/wp";

const HOME_SLUG = "home";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug<HomeAcf>(HOME_SLUG);
  return yoastToMetadata(page?.yoast_head_json, page ? decodeEntities(page.title.rendered) : undefined);
}

function linkItem(link: WPLink | null | "" | undefined) {
  if (!link || !link.url) return [];
  const href = toHref(link.url);
  return [{ label: link.title, href, external: isExternal(href) }];
}

function buildSlides(acf: HomeAcf, products: Map<number, WPProduct>): HeroSlide[] {
  const slides: HeroSlide[] = [];
  const w = acf.webinar_banner;
  if (w?.enabled) {
    slides.push({
      key: "webinar",
      image: w.image,
      eyebrow: w.eyebrow,
      heading: w.title,
      subheading: w.subtitle,
      meta: { date: w.date_text, location: w.location_text },
      links: linkItem(w.button),
    });
  }
  (acf.hero_slides ?? []).forEach((s, i) => {
    const product = s.product ? products.get(s.product.ID) : undefined;
    const file = product?.acf.brochure_file;
    slides.push({
      key: `slide-${i}`,
      image: s.background_image,
      eyebrow: s.eyebrow,
      heading: s.heading,
      subheading: s.subheading,
      brochure:
        s.brochure_label && s.product
          ? { label: s.brochure_label, productName: s.product.post_title, fileUrl: file ? file.url : undefined }
          : undefined,
      links: linkItem(s.learn_more),
    });
  });
  return slides;
}

export default async function HomePage() {
  const [page, products] = await Promise.all([getPageBySlug<HomeAcf>(HOME_SLUG), getProducts()]);
  if (!page) notFound();
  const acf = page.acf;
  const byId = new Map(products.map((p) => [p.id, p]));
  const offerings = (acf.offerings_products || [])
    .map((ref) => byId.get(ref.ID))
    .filter((p): p is WPProduct => !!p);

  return (
    <>
      <HeroSlider slides={buildSlides(acf, byId)} />
      <ClientLogos heading={acf.clients_heading} logos={acf.client_logos || []} />
      <Offerings
        eyebrow={acf.offerings_eyebrow}
        heading={acf.offerings_heading}
        products={offerings}
        linkLabel={acf.offerings_link_label}
      />
      <Features eyebrow={acf.features_eyebrow} heading={acf.features_heading} items={acf.features ?? []} />
      <About data={acf} />
      <Highlights eyebrow={acf.highlights_eyebrow} heading={acf.highlights_heading} items={acf.highlights ?? []} />
      {!!acf.faqs?.length && (
        <section className="container-site py-[70px]">
          <SectionHeading eyebrow={acf.faq_eyebrow} heading={acf.faq_heading} />
          <Faq items={acf.faqs} />
        </section>
      )}
    </>
  );
}
