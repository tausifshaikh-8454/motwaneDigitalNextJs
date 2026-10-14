import { z } from "zod";

/**
 * Field definitions for each form. Field `name`s must match the
 * Contact Form 7 form tags in WordPress (CFDB7 stores entries under these names).
 */

export type FormType =
  | "get_in_touch"
  | "brochure"
  | "recap"
  | "newsletter"
  | "contact"
  | "product_enquiry"
  | "job_application";

export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "file";
  required: boolean;
  placeholder?: string;
  autoComplete?: string;
}

const name: FieldDef = { name: "your-name", label: "Full Name", type: "text", required: true, autoComplete: "name" };
const email: FieldDef = { name: "your-email", label: "Email Address", type: "email", required: true, autoComplete: "email" };
const officialEmail: FieldDef = { ...email, label: "Official Email Address", placeholder: "Enter your work email" };
const phone: FieldDef = { name: "your-phone", label: "Contact Number", type: "tel", required: true, autoComplete: "tel" };
const location: FieldDef = { name: "your-location", label: "Location", type: "text", required: true };
const company: FieldDef = { name: "your-company", label: "Organization / Company Name", type: "text", required: true, autoComplete: "organization", placeholder: "Enter the name of your organization" };

export const FORM_FIELDS: Record<FormType, FieldDef[]> = {
  get_in_touch: [
    name,
    email,
    phone,
    { name: "company-name", label: "Company Name", type: "text", required: true, autoComplete: "organization" },
    location,
    { name: "your-message", label: "Write your message/query:", type: "textarea", required: true },
  ],
  contact: [
    name,
    email,
    phone,
    { name: "company-name", label: "Company Name", type: "text", required: true, autoComplete: "organization" },
    location,
    { name: "your-message", label: "Write your message/query:", type: "textarea", required: false },
  ],
  brochure: [
    { ...name, placeholder: "Please enter your full name" },
    officialEmail,
    { ...phone, label: "Mobile Number", placeholder: "Enter your 10-digit contact number" },
    { ...location, placeholder: "Enter your Location" },
    company,
  ],
  recap: [{ ...name, placeholder: "Please enter your full name" }, officialEmail, company],
  newsletter: [{ ...email, label: "Email", placeholder: "" }],
  product_enquiry: [
    { name: "first-name", label: "First Name*", type: "text", required: true, autoComplete: "given-name" },
    { name: "last-name", label: "Last Name*", type: "text", required: true, autoComplete: "family-name" },
    { name: "your-phone", label: "Phone Number*", type: "tel", required: true, autoComplete: "tel" },
    { name: "your-email", label: "Email Address*", type: "email", required: true, autoComplete: "email" },
    { name: "your-message", label: "Write a message...", type: "textarea", required: false },
  ],
  job_application: [
    { name: "candidate-name", label: "Candidate Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "contact-number", label: "Contact No.", type: "tel", required: true, autoComplete: "tel" },
    { name: "current-org", label: "Current Organization", type: "text", required: true, autoComplete: "organization" },
    { name: "current-designation", label: "Current Designation", type: "text", required: true, autoComplete: "organization-title" },
    { name: "poi", label: "Position of Interest", type: "text", required: true },
    { name: "experience", label: "Experience in Years", type: "text", required: true },
    { name: "resume-file", label: "Upload Resume", type: "file", required: true },
    { name: "cover-letter", label: "Add Cover Letter", type: "textarea", required: false },
  ],
};

/** Resume upload rules (must match the CF7 tag: limit:5mb filetypes:pdf|doc|docx). */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];

export function resumeError(file: File | null | undefined): string | null {
  if (!file || !file.size) return "Please upload your resume.";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!RESUME_EXTENSIONS.includes(ext)) return "Please upload a PDF, DOC or DOCX file.";
  if (file.size > RESUME_MAX_BYTES) return "The file is too large (maximum 5 MB).";
  return null;
}

/** Hidden fields each form may carry (context such as the product or webinar). */
export const HIDDEN_FIELDS: Partial<Record<FormType, string[]>> = {
  brochure: ["product-name"],
  recap: ["webinar-title"],
  product_enquiry: ["product-name"],
};

const phoneRegex = /^[+\d][\d\s-]{6,19}$/;

function fieldSchema(f: FieldDef) {
  let s = z.string({ error: "Please fill out this field." }).trim().max(f.type === "textarea" ? 5000 : 200);
  if (f.type === "email") s = s.email("Please enter a valid email address.") as typeof s;
  if (f.type === "tel") s = s.regex(phoneRegex, "Please enter a valid phone number.");
  return f.required ? s.min(1, "Please fill out this field.") : s.optional().or(z.literal(""));
}

export function buildSchema(type: FormType) {
  const shape: Record<string, z.ZodType> = {};
  // File fields are checked separately (see resumeError).
  for (const f of FORM_FIELDS[type]) if (f.type !== "file") shape[f.name] = fieldSchema(f);
  for (const h of HIDDEN_FIELDS[type] ?? []) shape[h] = z.string().max(300).optional();
  return z.object(shape);
}

export const FORM_TYPES = Object.keys(FORM_FIELDS) as FormType[];
