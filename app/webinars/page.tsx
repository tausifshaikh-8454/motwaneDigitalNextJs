import type { Metadata } from "next";
import { WebinarCard } from "@/components/webinars/WebinarCard";
import { Carousel } from "@/components/ui/Carousel";
import { getPageBySlug, getWebinars, getWebinarsSettings } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("webinars");
  return yoastToMetadata(page?.yoast_head_json, "Webinars", "/webinars/");
}

export default async function WebinarsPage() {
  const [settings, webinars] = await Promise.all([getWebinarsSettings(), getWebinars()]);
  const hero = settings?.hero_image || null;
  const learnMore = settings?.learn_more_label ?? "";

  return (
    <>
      <section
        className="flex min-h-[173px] items-center bg-cover bg-[50%_0%] bg-no-repeat py-10 md:min-h-[289px] lg:min-h-[317px]"
        style={hero ? { backgroundImage: `url("${hero.url}")` } : undefined}
      >
        <div className="container-site">
          <h1 className="text-[30px] font-bold uppercase leading-[1.4] text-white md:text-2xl lg:text-h1">
            {settings?.hero_title}
          </h1>
        </div>
      </section>

      <section className="bg-[#f1f1f1] py-[50px] lg:py-[70px]">
        <div className="container-site">
          {webinars.length > 0 && (
            <>
              <div className="hidden gap-[30px] md:grid md:grid-cols-2 md:px-5 lg:grid-cols-4 lg:px-0">
                {webinars.map((w, i) => (
                  <WebinarCard key={w.id} webinar={w} learnMore={learnMore} priority={i < 4} />
                ))}
              </div>
              <Carousel className="md:hidden" dots={false} arrows>
                {webinars.map((w) => (
                  <WebinarCard key={w.id} webinar={w} learnMore={learnMore} sizes="100vw" />
                ))}
              </Carousel>
            </>
          )}
        </div>
      </section>
    </>
  );
}
