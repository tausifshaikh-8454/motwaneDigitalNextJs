"use client";

import { FORM_FIELDS, type FormType } from "@/lib/forms";
import { FormStatus, Honeypot, useCmsForm } from "./useCmsForm";

/** Form used inside the Get in Touch / Request Brochure / Request Recap popups. */
export function PopupForm({
  formType,
  intro,
  successMessage,
  hidden,
  downloadUrl,
}: {
  formType: FormType;
  intro?: string;
  successMessage?: string;
  hidden?: Record<string, string>;
  downloadUrl?: string;
}) {
  const { form, onSubmit, status, honeypot } = useCmsForm(formType, {
    successMessage,
    extra: hidden,
    onSuccess: () => {
      if (downloadUrl) window.open(downloadUrl, "_blank", "noopener");
    },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <>
      {intro && <p className="mb-8 leading-[1.45] text-ink">{intro}</p>}
      <form onSubmit={onSubmit} noValidate className="space-y-5 bg-form p-5">
        {FORM_FIELDS[formType].map((f) => {
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
        <Honeypot {...honeypot} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded border border-primary px-[30px] py-2.5 text-lg font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
        <FormStatus status={status} />
      </form>
    </>
  );
}
