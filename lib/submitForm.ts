import axios from "axios";
import type { FormType } from "./forms";

export interface SubmitResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

/** Client-side helper: posts a form to the Next.js /api/forms route. */
export async function submitForm(
  formType: FormType,
  data: Record<string, string>,
  honeypot: string,
): Promise<SubmitResult> {
  try {
    const res = await axios.post<SubmitResult>("/api/forms/", {
      formType,
      data,
      website: honeypot,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) return err.response.data as SubmitResult;
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }
}

/** Same as submitForm, but sends multipart/form-data so a file (e.g. a resume) can be attached. */
export async function submitFormWithFile(
  formType: FormType,
  data: Record<string, string>,
  files: Record<string, File>,
  honeypot: string,
): Promise<SubmitResult> {
  const fd = new FormData();
  fd.append("formType", formType);
  fd.append("website", honeypot);
  if (typeof window !== "undefined") fd.append("pageUrl", window.location.href);
  for (const [key, value] of Object.entries(data)) fd.append(key, value ?? "");
  for (const [key, file] of Object.entries(files)) fd.append(key, file, file.name);
  try {
    const res = await axios.post<SubmitResult>("/api/forms/", fd);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) return err.response.data as SubmitResult;
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }
}
