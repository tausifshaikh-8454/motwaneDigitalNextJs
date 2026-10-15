"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/ui/Icons";
import { submitForm } from "@/lib/submitForm";
import { FormStatus, Honeypot } from "./useCmsForm";

export function NewsletterForm({ placeholder, successMessage }: { placeholder: string; successMessage?: string }) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    const r = await submitForm("newsletter", { "your-email": email }, honeypot);
    setBusy(false);
    setStatus({ ok: r.ok, message: r.ok ? successMessage || r.message : r.fieldErrors?.["your-email"] || r.message });
    if (r.ok) setEmail("");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative max-w-[344px]">
      <label htmlFor="newsletter-email" className="sr-only">
        {placeholder}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-primary bg-transparent py-2.5 pr-10 text-field outline-none placeholder:text-field/70"
      />
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <button
        type="submit"
        disabled={busy}
        aria-label="Subscribe"
        className="absolute right-0 top-1/2 -translate-y-1/2 text-primary transition-transform hover:translate-x-1 disabled:opacity-50"
      >
        <ArrowRight className="h-6 w-6" />
      </button>
      <FormStatus status={status} className="mt-2 text-xs" />
    </form>
  );
}
