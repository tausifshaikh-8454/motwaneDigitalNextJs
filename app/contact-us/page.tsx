import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { getContactSettings, getPageBySlug } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact-us");
  return yoastToMetadata(page?.yoast_head_json, "Contact Us", "/contact-us/");
}

/** Contact Us page — all content comes from the WordPress page "contact-us". */
export default async function ContactPage() {
  const settings = await getContactSettings();
  const hero = settings?.hero_image || null;

  return (
    <>
      <section
        className="flex min-h-[241px] items-center bg-[#16222d] bg-cover bg-center bg-no-repeat py-10 md:min-h-[236px] lg:min-h-[304px]"
        style={hero ? { backgroundImage: `url("${hero.url}")` } : undefined}
      >
        <div className="container-site">
          <h1 className="text-2xl font-bold leading-[1.4] text-white lg:text-h1">{settings?.hero_title}</h1>
          {settings?.hero_text && (
            <p className="mt-5 leading-[1.4] text-white lg:text-xl">{settings.hero_text}</p>
          )}
        </div>
      </section>

      <section className="container-site pb-[50px] pt-[30px] md:pt-[50px]">
        <div className="bg-tint-strong px-6 pb-20 pt-6 md:px-10 md:pt-10 lg:pb-[100px]">
          {settings?.form_heading && (
            <h2 className="text-center text-lg font-bold leading-[1.4] text-primary md:text-lg lg:text-[32px]">
              {settings.form_heading}
            </h2>
          )}
          <ContactForm submitLabel={settings?.submit_label ?? ""} successMessage={settings?.success_message} />
        </div>
      </section>
    </>
  );
}
