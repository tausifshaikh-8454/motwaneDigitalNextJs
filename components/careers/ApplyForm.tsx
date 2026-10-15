"use client";

import { useEffect, useState } from "react";
import { FORM_FIELDS, resumeError } from "@/lib/forms";
import { submitFormWithFile } from "@/lib/submitForm";
import { FormStatus, Honeypot, useCmsForm } from "@/components/forms/useCmsForm";

/** Fields that take half a row on tablet/desktop (as on the old site). */
const HALF = new Set(["experience", "resume-file"]);

/**
 * Job application form (Apply Now page). The resume is sent as a file to
 * Contact Form 7; CFDB7 keeps the entry and the uploaded file.
 * "Position of Interest" is pre-filled from ?poi= (set by the Careers page buttons).
 */
export function ApplyForm({ submitLabel, successMessage }: { submitLabel: string; successMessage?: string }) {
  const fields = FORM_FIELDS.job_application;
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const { form, onSubmit, status, honeypot } = useCmsForm("job_application", {
    successMessage,
    send: async (values, hp) => {
      const err = resumeError(file);
      setFileError(err);
      if (err || !file) return null;
      return submitFormWithFile("job_application", values, { "resume-file": file }, hp);
    },
    onSuccess: () => {
      setFile(null);
      setFileKey((k) => k + 1); // remounts the file input to clear it
    },
    onInvalid: () => setFileError(resumeError(file)),
  });
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    const poi = new URLSearchParams(window.location.search).get("poi");
    if (poi) setValue("poi", poi);
  }, [setValue]);

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-[52px] max-w-[840px]">
      <div className="grid gap-y-[22px] md:grid-cols-6 md:gap-x-[30px]">
        {fields.map((f) => {
          const id = `apply-${f.name}`;
          // Resume errors come from the browser check or from the server (via the form errors).
          const err = (f.type === "file" && fileError) || errors[f.name]?.message;
          const span = f.type === "textarea" ? "md:col-span-6" : HALF.has(f.name) ? "md:col-span-3" : "md:col-span-2";
          return (
            <div key={f.name} className={span}>
              <label htmlFor={id} className="block font-medium leading-5 text-ink">
                {f.label}
                {f.required && <span className="text-red-600"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={id}
                  aria-invalid={!!err}
                  className="mt-[5px] block h-[200px] w-full resize-y rounded border border-primary bg-transparent px-4 py-3 leading-6 text-field outline-none focus:border-primary-bright"
                  {...register(f.name)}
                />
              ) : f.type === "file" ? (
                <input
                  id={id}
                  key={fileKey}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  aria-invalid={!!err}
                  onChange={(e) => {
                    const picked = e.target.files?.[0] ?? null;
                    setFile(picked);
                    setFileError(picked ? resumeError(picked) : null);
                    clearErrors("resume-file");
                  }}
                  className="mt-[5px] block w-full border-b border-primary bg-[#fafafa] text-sm text-field file:mr-2 file:cursor-pointer file:border file:border-[#767676] file:bg-[#efefef] file:px-1.5 file:py-0.5 file:text-sm"
                />
              ) : (
                <input
                  id={id}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  aria-invalid={!!err}
                  className="mt-[5px] block h-[35px] w-full border-b border-primary bg-transparent leading-6 text-field outline-none focus:border-primary-bright"
                  {...register(f.name)}
                />
              )}
              {err && <p className="mt-1 text-sm text-red-600">{String(err)}</p>}
            </div>
          );
        })}
      </div>

      <Honeypot {...honeypot} />

      <div className="mt-[25px] flex flex-col items-end gap-3">
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
