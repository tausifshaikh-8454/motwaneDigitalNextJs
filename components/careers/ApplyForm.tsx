"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema, FORM_FIELDS, resumeError } from "@/lib/forms";
import { submitFormWithFile } from "@/lib/submitForm";

/** Fields that take half a row on tablet/desktop (as on the old site). */
const HALF = new Set(["experience", "resume-file"]);

/**
 * Job application form (Apply Now page). The resume is sent as a file to
 * Contact Form 7; CFDB7 keeps the entry and the uploaded file.
 * "Position of Interest" is pre-filled from ?poi= (set by the Careers page buttons).
 */
export function ApplyForm({ submitLabel, successMessage }: { submitLabel: string; successMessage?: string }) {
  const fields = FORM_FIELDS.job_application;
  const [honeypot, setHoneypot] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({ resolver: zodResolver(buildSchema("job_application")) as never });

  useEffect(() => {
    const poi = new URLSearchParams(window.location.search).get("poi");
    if (poi) setValue("poi", poi);
  }, [setValue]);

  const onSubmit = handleSubmit(
    async (values) => {
      setStatus(null);
      const err = resumeError(file);
      setFileError(err);
      if (err || !file) return;
      const result = await submitFormWithFile("job_application", values, { "resume-file": file }, honeypot);
      if (result.fieldErrors) {
        for (const [name, message] of Object.entries(result.fieldErrors)) {
          if (name === "resume-file") setFileError(message);
          else setError(name, { message });
        }
      }
      setStatus({ ok: result.ok, message: result.ok ? successMessage || result.message : result.message });
      if (result.ok) {
        reset();
        setFile(null);
        setFileKey((k) => k + 1); // remounts the file input to clear it
      }
    },
    () => setFileError(resumeError(file)),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-[52px] max-w-[840px]">
      <div className="grid gap-y-[22px] md:grid-cols-6 md:gap-x-[30px]">
        {fields.map((f) => {
          const id = `apply-${f.name}`;
          const err = f.type === "file" ? fileError : errors[f.name]?.message;
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

      <div className="mt-[25px] flex flex-col items-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded border border-primary px-[30px] py-2.5 text-lg font-medium leading-[1.1] text-primary shadow-[3px_3px_10px_0px_#0d6cb3] transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : submitLabel || "Submit"}
        </button>
        {status?.message && (
          <p role="status" className={`self-stretch text-right text-sm ${status.ok ? "text-green-700" : "text-red-600"}`}>
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
