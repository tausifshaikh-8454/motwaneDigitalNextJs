import { WpImage } from "@/components/ui/WpImage";
import type { WPImage } from "@/types/wp";

/** Grid of icon + title + text cards (Home "Features" and product "Key Features"). */
export function FeatureCards({
  items,
  cardClassName,
  iconClassName,
}: {
  items: { icon: WPImage | false | null; title: string; text: string }[];
  /** Card background */
  cardClassName: string;
  iconClassName: string;
}) {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-[60px] lg:grid-cols-3">
      {items.map((f) => (
        <div
          key={f.title}
          className={`flex flex-col items-center border-b-[3px] border-primary p-[30px] text-center ${cardClassName}`}
        >
          <WpImage image={f.icon} className={iconClassName} />
          <h3 className="mt-5 text-lg font-medium leading-[1.4] text-primary lg:text-[22px]">{f.title}</h3>
          <p className="mt-4 leading-[1.4] text-ink">{f.text}</p>
        </div>
      ))}
    </div>
  );
}
