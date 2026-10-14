import type { Metadata } from "next";
import { ApplyForm } from "@/components/careers/ApplyForm";
import { getPageBySlug } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import type { ApplyAcf } from "@/types/wp";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("apply-now");
  return yoastToMetadata(page?.yoast_head_json, "Apply Now", "/apply-now/");
}

/** Apply Now page — content comes from the WordPress page "apply-now". */
export default async function ApplyPage() {
  const page = await getPageBySlug<ApplyAcf>("apply-now");
  const acf = page?.acf;
  const hero = acf?.hero_image || null;

  return (
    <>
      <section
        className="flex min-h-[297px] items-center bg-[#16222d] bg-cover bg-center bg-no-repeat py-10 md:min-h-[258px] lg:min-h-[343px]"
        style={hero ? { backgroundImage: `url("${hero.url}")` } : undefined}
      >
        <div className="container-site md:px-[30px] lg:px-5">
          {acf?.hero_title && <h1 className="text-2xl font-bold leading-[1.4] text-white lg:text-h1">{acf.hero_title}</h1>}
          {acf?.hero_text && (
            <p className="mt-5 max-w-[800px] leading-[1.4] text-white lg:text-eyebrow">{acf.hero_text}</p>
          )}
        </div>
      </section>

      <section className="bg-tint-strong px-[30px] pb-[120px] pt-[100px] lg:pb-[190px]">
        {acf?.form_heading && (
          <h2 className="text-center text-lg font-medium leading-[1.4] text-primary lg:text-eyebrow">{acf.form_heading}</h2>
        )}
        <ApplyForm submitLabel={acf?.submit_label ?? ""} successMessage={acf?.success_message} />
      </section>
    </>
  );
}
