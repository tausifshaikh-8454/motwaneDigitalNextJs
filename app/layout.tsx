import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SideEnquiryTab } from "@/components/layout/SideEnquiryTab";
import { ModalProvider } from "@/components/modals/ModalProvider";
import { getGlobalSettings, getSiteInfo } from "@/lib/wp";
import "./globals.css";

/** Site-wide defaults; each page adds its own Yoast title/description. */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  const icon = site?.site_icon_url;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: site?.name,
    description: site?.description || undefined,
    icons: icon ? { icon: [{ url: icon }], apple: [{ url: icon }] } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getGlobalSettings();

  return (
    <html lang="en" className="[--header-h:70px] [scrollbar-gutter:stable] lg:[--header-h:82px]" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <ModalProvider settings={settings}>
          <Header logo={settings?.logo || null} ctaLabel={settings?.header_cta_label ?? ""} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <ScrollToTop />
          <SideEnquiryTab label={settings?.get_in_touch_popup?.title ?? ""} />
        </ModalProvider>
      </body>
    </html>
  );
}
