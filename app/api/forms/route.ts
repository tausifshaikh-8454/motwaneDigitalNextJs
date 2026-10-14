import axios from "axios";
import { z } from "zod";
import { getContactSettings, getGlobalSettings, wp } from "@/lib/wp";
import { buildSchema, FORM_TYPES, type FormType } from "@/lib/forms";
import type { Cf7Response, GlobalSettings } from "@/types/wp";

/**
 * All site forms post here. The handler validates the input, then forwards it
 * to Contact Form 7 in WordPress (CFDB7 stores every entry in wp-admin).
 * The browser never talks to WordPress directly.
 */

const requestSchema = z.object({
  formType: z.enum(FORM_TYPES as [FormType, ...FormType[]]),
  data: z.record(z.string(), z.string()),
  website: z.string().optional(), // honeypot — must stay empty
  pageUrl: z.string().max(500).optional(),
});

// Basic in-memory rate limit: 5 submissions per IP per minute.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function formIdFor(type: FormType, s: GlobalSettings | null): Promise<number | string | null> {
  if (type === "contact") {
    // Contact Us page has its own form (set on the Contact Us page in WordPress).
    const contact = await getContactSettings();
    if (contact?.form_id) return contact.form_id;
  }
  if (!s) return null;
  switch (type) {
    case "get_in_touch":
    case "contact":
      return s.get_in_touch_popup?.form_id ?? null;
    case "brochure":
      return s.brochure_popup?.form_id ?? null;
    case "recap":
      return s.recap_popup?.form_id ?? null;
    case "newsletter":
      return s.newsletter_form_id ?? null;
    case "product_enquiry":
      return s.product_enquiry?.form_id ?? null;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, message: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await request.json());
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden honeypot field; pretend success and drop it.
  if (body.website) return Response.json({ ok: true, message: "" });

  const parsed = buildSchema(body.formType).safeParse(body.data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return Response.json({ ok: false, message: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const formId = await formIdFor(body.formType, await getGlobalSettings());
  if (!formId) {
    return Response.json({ ok: false, message: "This form is not configured yet." }, { status: 503 });
  }

  const fd = new FormData();
  for (const [key, value] of Object.entries(parsed.data)) if (value) fd.append(key, String(value));
  fd.append("_wpcf7", String(formId));
  fd.append("_wpcf7_unit_tag", `wpcf7-f${formId}-o1`);
  fd.append("_wpcf7_container_post", "0");
  if (body.pageUrl) fd.append("_wpcf7_url", body.pageUrl);

  try {
    const { data } = await wp.post<Cf7Response>(`/contact-form-7/v1/contact-forms/${formId}/feedback`, fd, {
      headers: { "User-Agent": request.headers.get("user-agent") ?? "Next.js", "X-Forwarded-For": ip },
    });

    if (data.status === "validation_failed") {
      const fieldErrors = Object.fromEntries((data.invalid_fields ?? []).map((f) => [f.field, f.message]));
      return Response.json({ ok: false, message: data.message, fieldErrors }, { status: 422 });
    }
    if (data.status === "mail_sent" || data.status === "mail_failed") {
      // mail_failed: the entry is still stored by CFDB7; only the email notification failed.
      if (data.status === "mail_failed") console.warn(`[forms] CF7 form ${formId}: notification email failed`);
      return Response.json({ ok: true, message: data.message });
    }
    return Response.json({ ok: false, message: data.message }, { status: 400 });
  } catch (err) {
    console.error("[forms] WordPress submission failed:", axios.isAxiosError(err) ? err.message : err);
    return Response.json({ ok: false, message: "Something went wrong. Please try again later." }, { status: 502 });
  }
}
