import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CmsLink } from "@/components/ui/CmsLink";
import { WpImage } from "@/components/ui/WpImage";
import { WebinarActions } from "@/components/webinars/WebinarActions";
import { WebinarCard } from "@/components/webinars/WebinarCard";
import { Carousel } from "@/components/ui/Carousel";
import { internalizeLinks } from "@/lib/blog";
import { cssUrl, decodeEntities } from "@/lib/links";
import { sanitizeWpHtml } from "@/lib/sanitize";
import { yoastToMetadata } from "@/lib/seo";
import { formatWebinarDate, isUpcoming, webinarIsoDate } from "@/lib/webinars";
import { getWebinarBySlug, getWebinars, getWebinarsSettings } from "@/lib/wp";

export async function generateStaticParams() {
  const webinars = await getWebinars();
  return (webinars.length ? webinars.map((w) => w.slug) : ["webinar"]).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/webinars/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const webinar = await getWebinarBySlug(slug);
  if (!webinar) return {};
  return yoastToMetadata(webinar.yoast_head_json, decodeEntities(webinar.title.rendered), `/webinars/${slug}/`);
}

const icon = "h-[23px] w-[23px] shrink-0 text-primary";

function PinIcon() {
  return (
    <svg viewBox="0 0 384 512" className={icon} fill="currentColor" aria-hidden="true">
      <path d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7a24 24 0 0 1-39.4 0ZM192 272a80 80 0 1 0 0-160 80 80 0 0 0 0 160Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 448 512" className={icon} fill="currentColor" aria-hidden="true">
      <path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12Zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12Zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12Zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12Zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12Zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12Zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48Zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 512 512" className={icon} fill="currentColor" aria-hidden="true">
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8Zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200Zm61.8-104.4-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6Z" />
    </svg>
  );
}

const h2 = "text-lg font-medium leading-[1.4] text-primary lg:text-[22px]";

async function Webinar({ params }: Pick<PageProps<"/webinars/[slug]">, "params">) {
  const { slug } = await params;
  const [webinar, settings, all] = await Promise.all([getWebinarBySlug(slug), getWebinarsSettings(), getWebinars()]);
  if (!webinar) notFound();

  const acf = webinar.acf;
  const title = decodeEntities(webinar.title.rendered);
  const takeaways = (acf.key_takeaways || []).filter((t) => t.text);
  const speakers = acf.speakers || [];
  const others = all.filter((w) => w.id !== webinar.id);
  const date = formatWebinarDate(acf.webinar_date);
  const cta = settings?.cta_image || null;
  const overview = await sanitizeWpHtml(internalizeLinks(webinar.content?.rendered ?? ""));

  return (
    <>
      <article>
        <header className="container-site py-[30px] lg:py-[50px]">
          <h1 className="text-2xl font-bold leading-[1.4] text-primary lg:text-h1">{title}</h1>
        </header>

        {acf.banner_image && (
          <WpImage image={acf.banner_image} alt={acf.banner_image.alt || title} priority sizes="100vw" className="h-auto w-full" />
        )}

        {webinar.content?.rendered && (
          <section className="container-site py-[30px]">
            {settings?.overview_label && <h2 className={h2}>{settings.overview_label}</h2>}
            <div
              className="mt-5 leading-[1.4] text-ink [&_a]:text-primary hover:[&_a]:underline [&_li]:mb-2 [&_p]:mb-7 [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: overview }}
            />
          </section>
        )}

        <section className="bg-tint py-[30px] lg:py-[50px]">
          <div className="container-site grid gap-12 md:grid-cols-2 md:gap-x-[50px] md:px-[50px] lg:grid-cols-[48%_1fr] lg:gap-x-[70px] lg:px-5">
            {takeaways.length > 0 && (
              <div>
                {settings?.takeaways_label && <h2 className={h2}>{settings.takeaways_label}</h2>}
                <ul className="mb-6 ml-[30px] mt-5 lg:ml-12">
                  {takeaways.map((t, i) => (
                    <li
                      key={i}
                      className="relative mb-2.5 border-b-2 border-primary px-2.5 py-5 text-base font-medium leading-[1.4] text-primary md:text-lg before:absolute before:-left-[30px] before:top-[18px] before:content-['✔']"
                    >
                      {t.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-5 lg:pr-5">
              {speakers.length > 0 && (
                <div>
                  {settings?.speakers_label && <h2 className={h2}>{settings.speakers_label}</h2>}
                  <div className="mt-5 flex flex-wrap gap-[30px]">
                    {speakers.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {s.photo && (
                          <WpImage
                            image={s.photo}
                            alt={s.photo.alt || s.name}
                            sizes="70px"
                            className="h-[70px] w-[70px] shrink-0 rounded-full object-cover"
                          />
                        )}
                        <div className="leading-[1.4] text-ink">
                          <p className="font-semibold">{s.name}</p>
                          <p>{s.designation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="flex min-h-[150px] items-center justify-center bg-contain bg-center bg-no-repeat lg:min-h-[250px]"
                style={acf.recap_image ? { backgroundImage: cssUrl(acf.recap_image.url) } : undefined}
              >
                <WebinarActions
                  upcoming={isUpcoming(webinar)}
                  webinarTitle={title}
                  registrationLink={acf.registration_link}
                  recapLabel={settings?.recap_label ?? ""}
                  registerLabel={settings?.register_label ?? ""}
                />
              </div>

              <div>
                {settings?.venue_label && <h2 className={h2}>{settings.venue_label}</h2>}
                <ul className="mt-5 flex flex-wrap gap-x-[60px] gap-y-3 text-body">
                  {acf.webinar_platform && (
                    <li className="flex items-center gap-[15px]">
                      <PinIcon />
                      {acf.webinar_platform}
                    </li>
                  )}
                  {date && (
                    <li className="flex items-center gap-[15px]">
                      <CalendarIcon />
                      <time dateTime={webinarIsoDate(acf.webinar_date)}>{date}</time>
                    </li>
                  )}
                  {acf.webinar_duration && (
                    <li className="flex items-center gap-[15px]">
                      <ClockIcon />
                      {acf.webinar_duration}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </article>

      {others.length > 0 && (
        <section className="container-site py-[50px] lg:py-[70px]">
          {settings?.other_heading && (
            <h2 className="text-lg font-medium leading-[1.4] text-primary lg:text-[25px]">{settings.other_heading}</h2>
          )}
          <Carousel className="mt-5">
            {others.map((w) => (
              <WebinarCard
                key={w.id}
                webinar={w}
                learnMore={settings?.learn_more_label ?? ""}
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
              />
            ))}
          </Carousel>
        </section>
      )}

      {settings?.cta_heading && (
        <section
          className="bg-[#0d3a5f] bg-cover bg-center bg-no-repeat py-[60px] lg:bg-fixed lg:py-20"
          style={cta ? { backgroundImage: cssUrl(cta.url) } : undefined}
        >
          <div className="container-site flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <h2 className="max-w-[740px] text-xl font-medium leading-[1.4] text-white lg:text-[35px]">
              {settings.cta_heading}
            </h2>
            <CmsLink
              link={settings.cta_button}
              className="shrink-0 rounded-md border border-white bg-primary px-6 py-3 md:mr-[25px] leading-[1.4] text-white transition-colors hover:bg-white hover:text-primary"
            />
          </div>
        </section>
      )}
    </>
  );
}

export default function WebinarPage(props: PageProps<"/webinars/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Webinar params={props.params} />
    </Suspense>
  );
}
