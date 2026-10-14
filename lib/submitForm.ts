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
