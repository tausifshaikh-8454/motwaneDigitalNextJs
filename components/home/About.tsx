import { CmsLink } from "@/components/ui/CmsLink";
import { WpImage } from "@/components/ui/WpImage";
import type { HomeAcf } from "@/types/wp";

export function About({ data }: { data: HomeAcf }) {
  if (!data.about_heading && !data.about_text) return null;
  return (
    <section className="bg-primary">
      <div className="container-site grid items-center gap-10 py-[70px] md:grid-cols-[38%_1fr] md:gap-8 lg:grid-cols-[442px_1fr] lg:gap-[78px]">
        {data.about_image && (
          <WpImage
            image={data.about_image}
            sizes="(min-width: 768px) 442px, 100vw"
            className="mx-auto h-auto w-full max-w-[442px] rounded-md"
          />
        )}
        <div className="text-white">
          {data.about_eyebrow && <p className="text-lg font-medium uppercase leading-[1.4] lg:text-eyebrow">{data.about_eyebrow}</p>}
          {data.about_heading && (
            <h2 className="mt-3 text-[22px] font-bold leading-[1.4] lg:mt-5 lg:text-h1">{data.about_heading}</h2>
          )}
          {data.about_text && <p className="mt-4 text-base leading-[1.4] lg:mt-5 lg:text-eyebrow">{data.about_text}</p>}
          {!!data.about_points?.length && (
            <ul className="mt-3 list-disc pl-5 text-base leading-[1.4] lg:text-[22px]">
              {data.about_points.map((p) => (
                <li key={p.text}>{p.text}</li>
              ))}
            </ul>
          )}
          <CmsLink
            link={data.about_button}
            className="mt-8 inline-block rounded-[3px] bg-accent px-6 py-3 text-lg font-medium lg:mt-10 lg:px-[30px] lg:py-[13px] lg:text-xl leading-[1.4] text-ink transition-colors hover:bg-white"
          />
        </div>
      </div>
    </section>
  );
}
