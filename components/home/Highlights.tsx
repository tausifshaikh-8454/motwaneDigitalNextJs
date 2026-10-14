import { SectionHeading } from "@/components/ui/SectionHeading";
import { WpImage } from "@/components/ui/WpImage";
import type { HomeAcf } from "@/types/wp";

export function Highlights({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string;
  heading: string;
  items: NonNullable<HomeAcf["highlights"]>;
}) {
  if (!items.length) return null;
  return (
    <section className="bg-tint">
      <div className="container-site py-[70px]">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <ul className="mx-auto mt-10 grid max-w-[900px] gap-x-10 gap-y-6 sm:grid-cols-2 md:mt-[60px] lg:gap-y-8">
          {items.map((h) => (
            <li key={h.label} className="flex items-start gap-4 lg:gap-5">
              <WpImage image={h.icon} className="h-12 w-12 shrink-0 md:h-[60px] md:w-[60px] lg:h-[74px] lg:w-[74px]" />
              <div className="text-[#414141]">
                <p className="text-lg font-bold leading-[1.4] lg:text-[30px]">{h.value}</p>
                <p className="max-w-[330px] text-[15px] leading-[1.4] lg:text-xl">{h.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
