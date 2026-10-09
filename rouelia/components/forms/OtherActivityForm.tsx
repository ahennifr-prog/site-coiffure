"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { brand, cta } from "@/content";
import { fr } from "@/lib/format";
import { isEmail, normalizeFrenchPhone } from "@/lib/signup";
import { consentText } from "@/textes/formulaires";
import { whoPage } from "@/textes/pour-qui";
import { describedBy, Field, Honeypot, inputClass, NextStep } from "./Field";

const t = whoPage.other.form;
type Key = "name" | "description" | "phone" | "email" | "consent";

/** Formulaire « Autre activité » de /pour-qui : envoi à contact@ et confirmation au visiteur. */
export function OtherActivityForm() {
  const [v, setV] = useState({ name: "", description: "", prizes: "", phone: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }));
  const check: Record<Key, boolean> = {
    name: !!v.name.trim(),
    description: !!v.description.trim(),
    phone: !!normalizeFrenchPhone(v.phone),
    email: isEmail(v.email.trim()),
    consent,
  };
  const err = (k: Key) => (tried && !check[k] ? t.errors[k] : null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    setServerError(null);
    const first = (Object.keys(check) as Key[]).find((k) => !check[k]);
    if (first) {
      document.getElementById(`aa-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/autre-activite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, consent, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("idle");
        setServerError(res.status === 429 ? t.errors.rate : t.errors.server);
        return;
      }
      setStatus("done");
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch {
      setStatus("idle");
      setServerError(t.errors.server);
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="pop-in rounded-xl bg-paper p-6 text-center ring-1 ring-line sm:p-8">
        <CheckCircle2 aria-hidden size={40} className="mx-auto text-sauge" />
        <h3 ref={doneRef} tabIndex={-1} className="mt-3 font-display text-2xl font-semibold outline-none">
          {fr(t.success.title)}
        </h3>
        <p className="mt-2 text-ink-soft">{fr(t.success.text)}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="relative rounded-xl bg-paper p-5 ring-1 ring-line sm:p-7">
      <h3 className="text-lg font-bold">{fr(t.title)}</h3>
      <Honeypot value={website} onChange={setWebsite} />
      {tried && Object.values(check).some((x) => !x) ? (
        <p role="alert" className="mt-3 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">
          {fr(t.errors.summary)}
        </p>
      ) : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="aa-name" label={t.name} required error={err("name")}>
            <input id="aa-name" value={v.name} onChange={set("name")} autoComplete="organization" maxLength={120} aria-invalid={!!err("name")} aria-describedby={describedBy("aa-name", err("name"))} className={inputClass} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="aa-description" label={t.description} required help={t.descriptionHelp} error={err("description")}>
            <textarea id="aa-description" value={v.description} onChange={set("description")} rows={3} maxLength={1000} aria-invalid={!!err("description")} aria-describedby={describedBy("aa-description", err("description"), t.descriptionHelp)} className={`${inputClass} py-3`} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="aa-prizes" label={t.prizes} help={t.prizesHelp}>
            <textarea id="aa-prizes" value={v.prizes} onChange={set("prizes")} rows={2} maxLength={1000} aria-describedby="aa-prizes-help" className={`${inputClass} py-3`} />
          </Field>
        </div>
        <Field id="aa-phone" label={t.phone} required error={err("phone")}>
          <input id="aa-phone" type="tel" inputMode="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" placeholder="06 12 34 56 78" aria-invalid={!!err("phone")} aria-describedby={describedBy("aa-phone", err("phone"))} className={inputClass} />
        </Field>
        <Field id="aa-email" label={t.email} required error={err("email")}>
          <input id="aa-email" type="email" inputMode="email" value={v.email} onChange={set("email")} autoComplete="email" aria-invalid={!!err("email")} aria-describedby={describedBy("aa-email", err("email"))} className={inputClass} />
        </Field>
      </div>
      <div className="mt-4">
        <label className="flex cursor-pointer gap-3 text-sm text-ink-soft">
          <input id="aa-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!err("consent")} aria-describedby={err("consent") ? "aa-consent-err" : undefined} className="mt-0.5 h-5 w-5 shrink-0 accent-tomette" />
          <span>
            {fr(consentText)}{" "}
            <Link href="/confidentialite" className="font-semibold underline underline-offset-2">
              Confidentialité
            </Link>
          </span>
        </label>
        {err("consent") ? (
          <p id="aa-consent-err" className="mt-1 ml-8 text-sm font-medium text-danger">
            {fr(t.errors.consent)}
          </p>
        ) : null}
      </div>
      {serverError ? (
        <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">
          {fr(serverError)}{" "}
          <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {cta.whatsapp}
          </a>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-tomette px-7 font-semibold text-white shadow-[0_8px_20px_-8px_rgb(196_64_31/0.7)] hover:bg-tomette-deep disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null}
        {status === "sending" ? t.submitting : t.submit}
      </button>
      <NextStep text={t.next} />
    </form>
  );
}
