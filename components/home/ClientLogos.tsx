import { WpImage } from "@/components/ui/WpImage";
import type { WPImage } from "@/types/wp";

/** "Our Valued Customers" strip with a continuously scrolling logo row. */
export function ClientLogos({ heading, logos }: { heading: string; logos: WPImage[] }) {
  if (!logos.length) return null;
  return (
    <section className="bg-tint">
      <div className="container-site flex flex-col items-center gap-4 py-5 md:flex-row md:gap-8">
        {heading && (
          <h2 className="shrink-0 text-center text-xl font-medium leading-[1.4] text-primary md:w-[140px] md:text-left md:text-eyebrow">
            {heading}
          </h2>
        )}
        <div className="group relative w-full overflow-hidden">
          <ul className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
            {[...logos, ...logos].map((logo, i) => (
              <li key={`${logo.id}-${i}`} className="w-[50vw] shrink-0 px-2.5 sm:w-[200px]" aria-hidden={i >= logos.length}>
                <WpImage image={logo} sizes="200px" className="mx-auto h-[85px] w-auto object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
