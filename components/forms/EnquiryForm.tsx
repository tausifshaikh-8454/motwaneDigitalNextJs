"use client";

import { FORM_FIELDS } from "@/lib/forms";
import { FormStatus, Honeypot, useCmsForm } from "./useCmsForm";

/** Inline "Get In Touch" form at the bottom of product pages (placeholder-style fields). */
export function EnquiryForm({ productName, successMessage }: { productName: string; successMessage?: string }) {
  const fields = FORM_FIELDS.product_enquiry;
  const { form, onSubmit, status, honeypot } = useCmsForm("product_enquiry", {
    successMessage,
    extra: { "product-name": productName },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

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
      <Honeypot {...honeypot} />
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent px-[30px] py-[15px] text-lg font-medium leading-none text-ink shadow-sm transition-colors hover:bg-white disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
        <FormStatus status={status} className="mt-3 text-sm" okClassName="text-white" errorClassName="text-accent" />
      </div>
    </form>
  );
}
