import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCards } from "@/components/ui/FeatureCards";
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
        <FeatureCards items={items} cardClassName="bg-white" iconClassName="h-[74px] w-[74px]" />
      </div>
    </section>
  );
}
