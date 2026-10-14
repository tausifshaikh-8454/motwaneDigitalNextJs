import { WpImage } from "@/components/ui/WpImage";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { GlobalSettings } from "@/types/wp";

export function EnquirySection({
  settings,
  productName,
}: {
  settings: GlobalSettings["product_enquiry"];
  productName: string;
}) {
  if (!settings?.form_id) return null;
  return (
    <section className="bg-primary">
      <div className="container-site grid items-center gap-10 py-[60px] md:grid-cols-[minmax(0,446px)_1fr] lg:gap-10 lg:py-[70px]">
        {settings.image && (
          <WpImage image={settings.image} sizes="446px" className="hidden h-[422px] w-full rounded-md object-cover md:block" />
        )}
        <div>
          {settings.heading && <h2 className="text-[28px] font-bold leading-[1.4] text-white lg:text-h1">{settings.heading}</h2>}
          <EnquiryForm productName={productName} successMessage={settings.success_message} />
        </div>
      </div>
    </section>
  );
}
