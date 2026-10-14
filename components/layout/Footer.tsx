import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, LEGAL_LINKS, PRODUCT_LINKS } from "@/lib/navigation";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SocialIcon } from "@/components/ui/Icons";
import type { GlobalSettings } from "@/types/wp";

export function Footer({ settings }: { settings: GlobalSettings | null }) {
  const logo = settings?.logo || null;
  const phoneHref = settings?.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : undefined;

  return (
    <footer className="mt-auto">
      <div className="bg-tint py-[70px]">
        <div className="container-site grid gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:gap-16">
          {/* Company */}
          <div className="max-w-[320px]">
            {logo && (
              <Link href="/" aria-label="Home" className="inline-block">
                <Image src={logo.url} alt={logo.alt || "Logo"} width={logo.width} height={logo.height} className="h-[42px] w-auto" />
              </Link>
            )}
            {settings?.head_office_address && (
              <address className="mt-7 whitespace-pre-line not-italic leading-[1.45] text-ink">
                {settings.head_office_address}
              </address>
            )}
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              {settings?.phone && (
                <div>
                  <p className="font-medium text-ink">Phone:</p>
                  <a href={phoneHref} className="text-[15px] text-ink hover:text-primary">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div>
                  <p className="font-medium text-ink">Email:</p>
                  <a href={`mailto:${settings.email}`} className="text-[15px] text-ink hover:text-primary">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter + social */}
          <div>
            {settings?.newsletter_heading && (
              <h2 className="font-medium text-primary">{settings.newsletter_heading}</h2>
            )}
            {settings?.newsletter_form_id && (
              <div className="mt-6">
                <NewsletterForm
                  placeholder={settings.newsletter_placeholder}
                  successMessage={settings.newsletter_success}
                />
              </div>
            )}
            {settings?.newsletter_consent && (
              <p className="mt-10 max-w-[300px] text-[10px] leading-[1.35] text-primary">{settings.newsletter_consent}</p>
            )}
            {!!settings?.social_links?.length && (
              <ul className="mt-5 flex gap-4">
                {settings.social_links.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="block text-primary transition-opacity hover:opacity-75"
                    >
                      <SocialIcon platform={s.platform} className="h-6 w-6" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-5 md:col-span-2 lg:col-span-1">
            <ul className="space-y-[18px]">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-[18px]">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-primary py-3">
        <div className="container-site flex flex-col items-center justify-between gap-2 text-xs font-medium text-legal sm:flex-row">
          {settings?.copyright_text && <p>{settings.copyright_text}</p>}
          <ul className="flex items-center">
            {LEGAL_LINKS.map((l, i) => (
              <li key={l.href} className="flex items-center">
                {i > 0 && <span className="px-2">|</span>}
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
