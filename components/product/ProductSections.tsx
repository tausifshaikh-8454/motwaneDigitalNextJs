import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WpImage } from "@/components/ui/WpImage";
import { ArrowRight } from "@/components/ui/Icons";
import { decodeEntities } from "@/lib/links";
import type { ProductAcf, WPProduct } from "@/types/wp";

export function WhyIntro({ eyebrow, heading, text }: { eyebrow: string; heading: string; text: string }) {
  if (!eyebrow && !heading && !text) return null;
  return (
    <section className="container-site py-[60px] lg:py-20">
      <SectionHeading eyebrow={eyebrow} heading={heading} wide />
      {text && <p className="mx-auto mt-5 max-w-[1114px] text-center text-base leading-[1.4] text-ink lg:text-lg">{text}</p>}
    </section>
  );
}

export function ProductStats({ acf }: { acf: ProductAcf }) {
  const stats = acf.stats ?? [];
  if (!stats.length && !acf.stats_heading) return null;
  return (
    <section className="bg-tint">
      <div className="container-site py-[60px] lg:py-[95px]">
        <SectionHeading eyebrow={acf.stats_eyebrow} heading={acf.stats_heading} wide />
        <div className="mt-10 grid items-center gap-10 md:grid-cols-2 lg:mt-[60px]">
          {acf.stats_image && (
            <WpImage
              image={acf.stats_image}
              sizes="(min-width: 1280px) 590px, (min-width: 768px) 50vw, 100vw"
              className="h-auto w-full rounded-md border-2 border-white"
            />
          )}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 lg:gap-x-10 lg:gap-y-10 lg:pl-[50px]">
            {stats.map((s) => (
              <li key={s.value + s.label} className="text-[#414141]">
                <WpImage image={s.icon} className="h-12 w-12 lg:h-[67px] lg:w-[67px]" />
                <p className="mt-4 text-2xl font-bold leading-[1.4] lg:text-[32px]">{s.value}</p>
                <p className="mt-1 text-sm leading-[1.4] lg:text-base">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function KeyFeatures({ acf }: { acf: ProductAcf }) {
  const items = acf.features ?? [];
  if (!items.length) return null;
  return (
    <section className="container-site py-[60px] lg:py-[95px]">
      <SectionHeading eyebrow={acf.features_eyebrow} heading={acf.features_heading} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-[60px] lg:grid-cols-3">
        {items.map((f) => (
          <div key={f.title} className="flex flex-col items-center border-b-[3px] border-primary bg-tint p-[30px] text-center">
            <WpImage image={f.icon} className="h-16 w-16 lg:h-20 lg:w-20" />
            <h3 className="mt-5 text-lg font-medium leading-[1.4] text-primary lg:text-[22px]">{f.title}</h3>
            <p className="mt-4 leading-[1.4] text-ink">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OtherSolutions({
  eyebrow,
  heading,
  linkLabel,
  products,
}: {
  eyebrow: string;
  heading: string;
  linkLabel: string;
  products: WPProduct[];
}) {
  if (!products.length) return null;
  return (
    <section className="bg-tint">
      <div className="container-site py-[60px] lg:py-[95px]">
        <SectionHeading eyebrow={eyebrow} heading={heading} wide />
        <div className="mt-10 flex flex-wrap justify-center gap-5 lg:mt-[60px]">
          {products.map((p) => {
            const href = `/${p.slug}/`;
            const image = p.acf.solution_card_image || p.acf.card_image;
            return (
              <article
                key={p.id}
                className="group w-full max-w-[423px] overflow-hidden rounded-md border border-[#0570b7] bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.12)]"
              >
                <Link href={href} tabIndex={-1} aria-hidden="true" className="block h-[260px] overflow-hidden lg:h-[361px]">
                  <WpImage
                    image={image}
                    sizes="423px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="px-5 py-6">
                  <h3 className="text-xl font-medium leading-[1.2] text-ink">
                    <Link href={href}>{decodeEntities(p.title.rendered)}</Link>
                  </h3>
                  {linkLabel && (
                    <Link href={href} className="mt-3 inline-flex items-center gap-2 font-medium text-primary">
                      {linkLabel}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
