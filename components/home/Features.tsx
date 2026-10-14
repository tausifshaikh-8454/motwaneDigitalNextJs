import { SectionHeading } from "@/components/ui/SectionHeading";
import { WpImage } from "@/components/ui/WpImage";
import type { HomeAcf } from "@/types/wp";

export function Features({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string;
  heading: string;
  items: NonNullable<HomeAcf["features"]>;
}) {
  if (!items.length) return null;
  return (
    <section className="bg-tint">
      <div className="container-site py-[70px]">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-[60px] lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.title} className="flex flex-col items-center border-b-[3px] border-primary bg-white p-[30px] text-center">
              <WpImage image={f.icon} className="h-[74px] w-[74px]" />
              <h3 className="mt-5 text-lg font-medium leading-[1.4] text-primary lg:text-[22px]">{f.title}</h3>
              <p className="mt-4 leading-[1.4] text-ink">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
