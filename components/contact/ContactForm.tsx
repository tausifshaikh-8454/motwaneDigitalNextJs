"use client";

import { FORM_FIELDS } from "@/lib/forms";
import { FormStatus, Honeypot, useCmsForm } from "@/components/forms/useCmsForm";

/** Fields that take two columns on tablet/desktop (as on the old site). */
const WIDE = new Set(["company-name"]);

/**
 * Contact Us page form. Posts to /api/forms → Contact Form 7 in WordPress
 * (entries are stored by CFDB7). Field names come from lib/forms.ts.
 */
export function ContactForm({ submitLabel, successMessage }: { submitLabel: string; successMessage?: string }) {
  const fields = FORM_FIELDS.contact;
  const { form, onSubmit, status, honeypot } = useCmsForm("contact", { successMessage });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form method="post" onSubmit={onSubmit} noValidate className="mt-10 lg:mt-[53px]">
      <div className="grid gap-y-[30px] md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:gap-x-[65px]">
        {fields.map((f) => {
          const id = `contact-${f.name}`;
          const err = errors[f.name]?.message;
          const label = (
            <label htmlFor={id} className="block font-medium leading-5 text-ink">
              {f.label}
              {f.required && <span className="text-red-600">*</span>}
            </label>
          );
          if (f.type === "textarea") {
            return (
              <div key={f.name} className="md:col-span-3">
                {label}
                <textarea
                  id={id}
                  aria-invalid={!!err}
                  className="mt-2.5 block h-[190px] w-full resize-y rounded border border-primary bg-transparent px-4 py-3 leading-6 text-field shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] outline-none focus:border-primary-bright"
                  {...register(f.name)}
                />
                {err && <p className="mt-1 text-sm text-red-600">{String(err)}</p>}
              </div>
            );
          }
          return (
            <div key={f.name} className={WIDE.has(f.name) ? "md:col-span-2" : undefined}>
              {label}
              <input
                id={id}
                type={f.type}
                autoComplete={f.autoComplete}
                aria-invalid={!!err}
                className="mt-[5px] block h-10 w-full border-b border-primary bg-transparent leading-6 text-field outline-none focus:border-primary-bright"
                {...register(f.name)}
              />
              {err && <p className="mt-1 text-sm text-red-600">{String(err)}</p>}
            </div>
          );
        })}
      </div>

      <Honeypot {...honeypot} />

      <div className="mt-[37px] flex flex-col items-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded border border-primary px-[30px] py-2.5 text-lg font-medium leading-[1.1] text-primary shadow-[3px_3px_10px_0px_#0d6cb3] transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : submitLabel || "Submit"}
        </button>
        <FormStatus status={status} className="self-stretch text-right text-sm" />
      </div>
    </form>
  );
}
