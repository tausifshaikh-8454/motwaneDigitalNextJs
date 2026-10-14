import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WpImage } from "@/components/ui/WpImage";
import { ArrowRight } from "@/components/ui/Icons";
import { decodeEntities } from "@/lib/links";
import type { WPProduct } from "@/types/wp";

export function Offerings({
  eyebrow,
  heading,
  products,
  linkLabel,
}: {
  eyebrow: string;
  heading: string;
  products: WPProduct[];
  linkLabel: string;
}) {
  if (!products.length) return null;
  return (
    <section id="solution" className="container-site scroll-mt-[var(--header-h)] pb-[70px] pt-[50px]">
      <SectionHeading eyebrow={eyebrow} heading={heading} />
      <div className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:mt-[60px] md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
        {products.map((p) => {
          const href = `/${p.slug}/`;
          const title = decodeEntities(p.title.rendered);
          return (
            <article
              key={p.id}
              className="group w-[85%] shrink-0 snap-start overflow-hidden rounded-[6px_30px_6px_6px] bg-white shadow-[5px_5px_10px_0px_rgba(13,108,179,0.25)] md:w-auto"
            >
              <Link href={href} className="block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
                <WpImage
                  image={p.acf.card_image}
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 33vw, 85vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="p-5">
                <h3 className="text-lg font-medium leading-[1.4] text-primary lg:text-[22px]">
                  <Link href={href}>{title}</Link>
                </h3>
                {p.acf.card_excerpt && <p className="mt-2.5 leading-[1.4] text-ink">{p.acf.card_excerpt}</p>}
                {linkLabel && (
                  <Link href={href} className="mt-4 inline-flex items-center gap-2 font-medium text-primary">
                    {linkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
