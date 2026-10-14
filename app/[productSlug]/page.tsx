import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductHero } from "@/components/product/ProductHero";
import { KeyFeatures, OtherSolutions, ProductStats, WhyIntro } from "@/components/product/ProductSections";
import { EnquirySection } from "@/components/product/EnquirySection";
import { getGlobalSettings, getProductBySlug, getProducts } from "@/lib/wp";
import { decodeEntities } from "@/lib/links";
import { yoastToMetadata } from "@/lib/seo";
import type { WPProduct } from "@/types/wp";

/** Product pages live at the site root (e.g. /busbar-iq/), matching the live URLs. */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ productSlug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/[productSlug]">): Promise<Metadata> {
  const { productSlug } = await props.params;
  const product = await getProductBySlug(productSlug);
  if (!product) return {};
  return yoastToMetadata(product.yoast_head_json, decodeEntities(product.title.rendered));
}

async function ProductContent({ params }: Pick<PageProps<"/[productSlug]">, "params">) {
  const { productSlug } = await params;
  const [product, all, settings] = await Promise.all([
    getProductBySlug(productSlug),
    getProducts(),
    getGlobalSettings(),
  ]);
  if (!product) notFound();

  const acf = product.acf;
  const name = decodeEntities(product.title.rendered);
  const byId = new Map(all.map((p) => [p.id, p]));
  const others = (acf.other_products || []).map((ref) => byId.get(ref.ID)).filter((p): p is WPProduct => !!p);
  const brochure = acf.brochure_file;

  return (
    <>
      <ProductHero
        title={acf.hero_title}
        subtitle={acf.hero_subtitle}
        text={acf.hero_text}
        image={acf.hero_image}
        brochureLabel={acf.brochure_label}
        contactLabel={acf.contact_label}
        productName={name}
        brochureUrl={brochure ? brochure.url : undefined}
      />
      <WhyIntro eyebrow={acf.why_eyebrow} heading={acf.why_heading} text={acf.why_text} />
      <ProductStats acf={acf} />
      <KeyFeatures acf={acf} />
      <OtherSolutions
        eyebrow={acf.other_eyebrow}
        heading={acf.other_heading}
        linkLabel={acf.other_link_label}
        products={others}
      />
      <EnquirySection settings={settings?.product_enquiry ?? null} productName={name} />
    </>
  );
}

export default function ProductPage(props: PageProps<"/[productSlug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ProductContent params={props.params} />
    </Suspense>
  );
}
