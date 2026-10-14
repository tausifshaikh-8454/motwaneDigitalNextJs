"use client";

import { WpImage } from "@/components/ui/WpImage";
import { useModal } from "@/components/modals/ModalProvider";
import type { WPImage } from "@/types/wp";

const btn =
  "border-2 border-accent px-5 py-2.5 text-base font-medium leading-[1.4] text-ink transition-colors lg:px-[26px] lg:py-[13px] lg:text-xl";

export function ProductHero({
  title,
  subtitle,
  text,
  image,
  brochureLabel,
  contactLabel,
  productName,
  brochureUrl,
}: {
  title: string;
  subtitle: string;
  text: string;
  image: WPImage | false | null;
  brochureLabel: string;
  contactLabel: string;
  productName: string;
  brochureUrl?: string;
}) {
  const { open } = useModal();
  return (
    <section className="bg-[linear-gradient(rgba(245,252,255,0.4)_0px,#d7e9f2_100%)]">
      <div className="container-site grid items-center gap-10 pb-[70px] pt-[50px] md:grid-cols-2 lg:pb-[100px] lg:pt-[70px]">
        <div>
          {title && <h1 className="text-[28px] font-bold leading-[1.4] text-ink lg:text-h1">{title}</h1>}
          {subtitle && <p className="mt-2 text-lg font-medium leading-[1.4] text-primary lg:text-xl">{subtitle}</p>}
          {text && <p className="mt-2 text-base leading-[1.4] text-ink lg:text-lg">{text}</p>}
          {(brochureLabel || contactLabel) && (
            <div className="mt-8 flex flex-wrap gap-4 lg:mt-[50px] lg:gap-5">
              {brochureLabel && (
                <button
                  type="button"
                  onClick={() => open({ type: "brochure", productName, brochureUrl })}
                  className={`${btn} bg-accent hover:border-primary hover:bg-primary hover:text-white`}
                >
                  {brochureLabel}
                </button>
              )}
              {contactLabel && (
                <button
                  type="button"
                  onClick={() => open({ type: "get_in_touch" })}
                  className={`${btn} bg-transparent lg:px-[30px] hover:bg-accent`}
                >
                  {contactLabel}
                </button>
              )}
            </div>
          )}
        </div>
        {image && (
          <WpImage
            image={image}
            priority
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full rounded-md border-2 border-white shadow-[0_0_4px_0_rgba(0,0,0,0.8)]"
          />
        )}
      </div>
    </section>
  );
}
