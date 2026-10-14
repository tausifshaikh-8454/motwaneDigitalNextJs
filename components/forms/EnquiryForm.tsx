"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema, FORM_FIELDS } from "@/lib/forms";
import { submitForm } from "@/lib/submitForm";

/** Inline "Get In Touch" form at the bottom of product pages (placeholder-style fields). */
export function EnquiryForm({ productName, successMessage }: { productName: string; successMessage?: string }) {
  const fields = FORM_FIELDS.product_enquiry;
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({ resolver: zodResolver(buildSchema("product_enquiry")) as never });

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null);
    const r = await submitForm("product_enquiry", { ...values, "product-name": productName }, honeypot);
    if (r.fieldErrors) for (const [name, message] of Object.entries(r.fieldErrors)) setError(name, { message });
    setStatus({ ok: r.ok, message: r.ok ? successMessage || r.message : r.message });
    if (r.ok) reset();
  });

  const input =
    "w-full border-b border-primary bg-[#3d89c2] px-[18px] py-3 text-white outline-none placeholder:text-white focus:border-white";

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-x-3 gap-y-5 sm:grid-cols-2">
      {fields.map((f) => {
        const err = errors[f.name]?.message;
        return (
          <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={`enq-${f.name}`} className="sr-only">
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={`enq-${f.name}`}
                rows={4}
                placeholder={f.label}
                className={`${input} mt-2 rounded border-t border-x border-t-primary border-x-primary border-b-white`}
                {...register(f.name)}
              />
            ) : (
              <input
                id={`enq-${f.name}`}
                type={f.type}
                placeholder={f.label}
                autoComplete={f.autoComplete}
                aria-invalid={!!err}
                className={input}
                {...register(f.name)}
              />
            )}
            {err && <p className="mt-1 text-sm text-accent">{String(err)}</p>}
          </div>
        );
      })}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent px-[30px] py-[15px] text-lg font-medium leading-none text-ink shadow-sm transition-colors hover:bg-white disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
        {status?.message && (
          <p role="status" className={`mt-3 text-sm ${status.ok ? "text-white" : "text-accent"}`}>
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
