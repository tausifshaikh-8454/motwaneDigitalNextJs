"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema, FORM_FIELDS, type FormType } from "@/lib/forms";
import { submitForm } from "@/lib/submitForm";

/** Form used inside the Get in Touch / Request Brochure / Request Recap popups. */
export function PopupForm({
  formType,
  intro,
  successMessage,
  hidden = {},
  downloadUrl,
}: {
  formType: FormType;
  intro?: string;
  successMessage?: string;
  hidden?: Record<string, string>;
  downloadUrl?: string;
}) {
  const fields = FORM_FIELDS[formType];
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({ resolver: zodResolver(buildSchema(formType)) as never });

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null);
    const result = await submitForm(formType, { ...values, ...hidden }, honeypot);
    if (result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) setError(name, { message });
    }
    setStatus({ ok: result.ok, message: result.ok ? successMessage || result.message : result.message });
    if (result.ok) {
      reset();
      if (downloadUrl) window.open(downloadUrl, "_blank", "noopener");
    }
  });

  return (
    <>
      {intro && <p className="mb-8 leading-[1.45] text-ink">{intro}</p>}
      <form onSubmit={onSubmit} noValidate className="space-y-5 bg-form p-5">
        {fields.map((f) => {
          const id = `${formType}-${f.name}`;
          const err = errors[f.name]?.message;
          return (
            <div key={f.name}>
              <label htmlFor={id} className="block font-medium text-ink">
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={4}
                  placeholder={f.placeholder}
                  aria-invalid={!!err}
                  className="mt-2 w-full rounded border border-primary bg-transparent px-4 py-3 text-field outline-none focus:border-primary-bright"
                  {...register(f.name)}
                />
              ) : (
                <input
                  id={id}
                  type={f.type}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  aria-invalid={!!err}
                  className="w-full border-b border-line bg-transparent py-2.5 text-field outline-none placeholder:text-field/60 focus:border-primary"
                  {...register(f.name)}
                />
              )}
              {err && <p className="mt-1 text-sm text-red-600">{String(err)}</p>}
            </div>
          );
        })}
        {/* Honeypot: hidden from people, bots fill it in */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded border border-primary px-[30px] py-2.5 text-lg font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
        {status?.message && (
          <p role="status" className={`text-sm ${status.ok ? "text-green-700" : "text-red-600"}`}>
            {status.message}
          </p>
        )}
      </form>
    </>
  );
}
