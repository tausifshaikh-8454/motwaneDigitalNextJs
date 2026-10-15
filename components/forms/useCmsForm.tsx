"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema, type FormType } from "@/lib/forms";
import { submitForm, type SubmitResult } from "@/lib/submitForm";

type Values = Record<string, string>;
type Status = { ok: boolean; message: string } | null;

/**
 * Shared logic for every Contact Form 7 form on the site:
 * validation (lib/forms.ts), honeypot, sending, server-side field errors and the status message.
 */
export function useCmsForm(
  formType: FormType,
  options: {
    successMessage?: string;
    /** Extra values sent with the form (e.g. product or webinar name) */
    extra?: Values;
    /** Custom sender (used for file uploads); return null to cancel */
    send?: (values: Values, honeypot: string) => Promise<SubmitResult | null>;
    onSuccess?: () => void;
    /** Called when the fields fail validation in the browser */
    onInvalid?: () => void;
  } = {},
) {
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const form = useForm<Values>({ resolver: zodResolver(buildSchema(formType)) as never });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus(null);
    const data = { ...values, ...options.extra };
    const result = options.send ? await options.send(data, honeypot) : await submitForm(formType, data, honeypot);
    if (!result) return;
    for (const [name, message] of Object.entries(result.fieldErrors ?? {})) form.setError(name, { message });
    setStatus({ ok: result.ok, message: result.ok ? options.successMessage || result.message : result.message });
    if (result.ok) {
      form.reset();
      options.onSuccess?.();
    }
  }, options.onInvalid);

  return { form, onSubmit, status, honeypot: { value: honeypot, onChange: setHoneypot } };
}

/** Hidden field that only bots fill in; submissions with a value are dropped by /api/forms. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 w-0 opacity-0"
    />
  );
}

/** Success / error message under a form. */
export function FormStatus({
  status,
  className = "text-sm",
  okClassName = "text-green-700",
  errorClassName = "text-red-600",
}: {
  status: Status;
  className?: string;
  okClassName?: string;
  errorClassName?: string;
}) {
  if (!status?.message) return null;
  return (
    <p role="status" className={`${className} ${status.ok ? okClassName : errorClassName}`}>
      {status.message}
    </p>
  );
}
