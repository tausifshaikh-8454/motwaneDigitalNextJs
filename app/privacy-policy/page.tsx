import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { getPageBySlug } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("privacy-policy");
  return yoastToMetadata(page?.yoast_head_json, "Privacy Policy", "/privacy-policy/");
}

export default function PrivacyPage() {
  return <LegalPage slug="privacy-policy" />;
}
