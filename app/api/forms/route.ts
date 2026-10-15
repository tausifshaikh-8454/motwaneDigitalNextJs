import axios from "axios";
import { z } from "zod";
import { getContactSettings, getGlobalSettings, getPageBySlug, wp } from "@/lib/wp";
import { buildSchema, FORM_TYPES, resumeError, type FormType } from "@/lib/forms";
import type { ApplyAcf, Cf7Response, GlobalSettings } from "@/types/wp";

/**
 * All site forms post here. The handler validates the input, then forwards it
 * to Contact Form 7 in WordPress (CFDB7 stores every entry in wp-admin).
 * The browser never talks to WordPress directly.
 *
 * Most forms send JSON. The job application sends multipart/form-data because
 * it includes the resume file.
 */

const requestSchema = z.object({
  formType: z.enum(FORM_TYPES as [FormType, ...FormType[]]),
  data: z.record(z.string(), z.string()),
  website: z.string().optional(), // honeypot — must stay empty
  pageUrl: z.string().max(500).optional(),
});

/** Largest request accepted: 5 MB resume + form fields. JSON forms are much smaller. */
const MAX_MULTIPART_BYTES = 6 * 1024 * 1024;
const MAX_JSON_BYTES = 64 * 1024;

/** Every response from this route is private and must never be cached. */
const NO_STORE = { "Cache-Control": "no-store" };
function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

/**
 * Basic in-memory rate limit: 5 submissions per IP per minute.
 * (Per server instance. For a stronger limit across instances, add a WAF /
 * Vercel Firewall rule or a shared store such as Upstash Redis.)
 */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some((t) => now - t < 60_000)) hits.delete(key);
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "local"
  );
}

/** Only accept submissions sent from this website's own pages (blocks CSRF / cross-site posting). */
function isSameSite(request: Request) {
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;
  let sourceHost: string;
  try {
    sourceHost = new URL(source).host;
  } catch {
    return false;
  }
  const allowed = new Set<string>();
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host) allowed.add(host);
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL) allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
  } catch {
    /* ignore a malformed env value */
  }
  return allowed.has(sourceHost);
}

/** Check the file really is a PDF / DOC / DOCX by its first bytes, not just its name. */
async function hasResumeSignature(file: File) {
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const hex = Array.from(head, (b) => b.toString(16).padStart(2, "0")).join("");
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return hex === "25504446"; // %PDF
  if (ext === "doc") return hex === "d0cf11e0"; // Word 97-2003 (OLE)
  if (ext === "docx") return hex === "504b0304"; // Office Open XML (zip)
  return false;
}

/** Keep only safe characters in the uploaded file name. */
function safeFileName(name: string) {
  const cleaned = name.replace(/[^\w.-]+/g, "_").replace(/^\.+/, "");
  return cleaned.slice(-100) || "resume";
}

async function formIdFor(type: FormType, s: GlobalSettings | null): Promise<number | string | null> {
  if (type === "job_application") {
    // Set on the Apply Now page in WordPress.
    const page = await getPageBySlug<ApplyAcf>("apply-now");
    return page?.acf?.form_id || null;
  }
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
  return null;
}

export async function POST(request: Request) {
  if (!isSameSite(request)) {
    return reply({ ok: false, message: "Forbidden." }, 403);
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return reply({ ok: false, message: "Too many requests. Please try again in a minute." }, 429);
  }

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");
  if (!isMultipart && !contentType.includes("application/json")) {
    return reply({ ok: false, message: "Unsupported content type." }, 415);
  }
  const length = Number(request.headers.get("content-length"));
  if (!length) return reply({ ok: false, message: "Length required." }, 411);
  if (length > (isMultipart ? MAX_MULTIPART_BYTES : MAX_JSON_BYTES)) {
    return reply({ ok: false, message: "The request is too large." }, 413);
  }

  let body: z.infer<typeof requestSchema>;
  let file: File | null = null;
  try {
    if (isMultipart) {
      const form = await request.formData();
      const data: Record<string, string> = {};
      for (const [key, value] of form.entries()) {
        if (typeof value === "string" && !["formType", "website", "pageUrl"].includes(key)) data[key] = value;
      }
      const upload = form.get("resume-file");
      file = upload instanceof File ? upload : null;
      body = requestSchema.parse({
        formType: form.get("formType"),
        data,
        website: form.get("website") ?? undefined,
        pageUrl: form.get("pageUrl") ?? undefined,
      });
    } else {
      body = requestSchema.parse(await request.json());
    }
  } catch {
    return reply({ ok: false, message: "Invalid request." }, 400);
  }

  // Bots fill the hidden honeypot field; pretend success and drop it.
  if (body.website) return reply({ ok: true, message: "" });

  const parsed = buildSchema(body.formType).safeParse(body.data);
  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
  }
  if (body.formType === "job_application") {
    const err = resumeError(file);
    if (err) fieldErrors["resume-file"] = err;
    else if (file && !(await hasResumeSignature(file))) {
      fieldErrors["resume-file"] = "This file doesn't look like a valid PDF, DOC or DOCX document.";
    }
  }
  if (!parsed.success || Object.keys(fieldErrors).length) {
    return reply({ ok: false, message: "Please check the highlighted fields.", fieldErrors }, 422);
  }

  const formId = await formIdFor(body.formType, await getGlobalSettings());
  if (!formId) {
    return reply({ ok: false, message: "This form is not configured yet." }, 503);
  }

  const fd = new FormData();
  for (const [key, value] of Object.entries(parsed.data)) if (value) fd.append(key, String(value));
  if (file) fd.append("resume-file", file, safeFileName(file.name));
  fd.append("_wpcf7", String(formId));
  fd.append("_wpcf7_unit_tag", `wpcf7-f${formId}-o1`);
  fd.append("_wpcf7_container_post", "0");
  if (body.pageUrl) fd.append("_wpcf7_url", body.pageUrl);

  try {
    const { data } = await wp.post<Cf7Response>(`/contact-form-7/v1/contact-forms/${formId}/feedback`, fd, {
      headers: {
        "User-Agent": request.headers.get("user-agent") ?? "Next.js",
        "X-Forwarded-For": ip,
        // Shared secret: WordPress only accepts form submissions that come through this route
        // (snippet "Motwane – only accept forms from Next.js"), so spam can't skip these checks.
        ...(process.env.WP_FORMS_SECRET ? { "X-MDG-Form-Key": process.env.WP_FORMS_SECRET } : {}),
      },
    });

    if (data.status === "validation_failed") {
      const fieldErrors = Object.fromEntries((data.invalid_fields ?? []).map((f) => [f.field, f.message]));
      return reply({ ok: false, message: data.message, fieldErrors }, 422);
    }
    if (data.status === "mail_sent" || data.status === "mail_failed") {
      // mail_failed: the entry is still stored by CFDB7; only the email notification failed.
      if (data.status === "mail_failed") console.warn(`[forms] CF7 form ${formId}: notification email failed`);
      return reply({ ok: true, message: data.message });
    }
    return reply({ ok: false, message: data.message }, 400);
  } catch (err) {
    console.error("[forms] WordPress submission failed:", axios.isAxiosError(err) ? err.message : err);
    return reply({ ok: false, message: "Something went wrong. Please try again later." }, 502);
  }
}
