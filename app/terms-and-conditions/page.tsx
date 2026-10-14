import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { getPageBySlug } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("terms-and-conditions");
  return yoastToMetadata(page?.yoast_head_json, "Terms & Conditions", "/terms-and-conditions/");
}

export default function TermsPage() {
  return <LegalPage slug="terms-and-conditions" />;
}
