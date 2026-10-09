"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle, X } from "lucide-react";
import { brand, cta } from "@/content";
import { fr } from "@/lib/format";
import { isEmail, normalizeFrenchPhone } from "@/lib/signup";
import { consentText, createWheel } from "@/textes/formulaires";
import { readImage } from "@/components/demo/readImage";
import { describedBy, Field, Honeypot, inputClass, NextStep } from "./Field";

const t = createWheel.form;
type Key = "shopName" | "phone" | "email" | "address" | "google" | "consent";

/** Formulaire « Créez-la pour moi » : une seule étape, envoi à contact@ et confirmation au commerçant. */
export function WheelRequestForm() {
  const [v, setV] = useState({ shopName: "", name: "", phone: "", email: "", address: "", google: "", prizes: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<{ dataUrl: string; name: string } | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }));

  const check: Record<Key, boolean> = {
    shopName: !!v.shopName.trim(),
    phone: !!normalizeFrenchPhone(v.phone),
    email: isEmail(v.email.trim()),
    address: !!v.address.trim(),
    google: !!v.google.trim(),
    consent,
  };
  const err = (k: Key) => (tried && !check[k] ? t.errors[k] : null);

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const r = await readImage(file, 5, 800);
    if ("error" in r) {
      setLogoError(r.error === "size" ? t.errors.logoSize : t.errors.logoType);
      return;
    }
    setLogoError(null);
    setLogo({ dataUrl: r.dataUrl, name: file.name });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    setServerError(null);
    const first = (Object.keys(check) as Key[]).find((k) => !check[k]);
    if (first) {
      document.getElementById(`pm-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/roue-pour-moi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, consent, website, logo: logo?.dataUrl ?? null, logoName: logo?.name ?? "" }),
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
      <div role="status" className="pop-in rounded-xl bg-paper p-6 text-center shadow-md ring-1 ring-line sm:p-10">
        <CheckCircle2 aria-hidden size={44} className="mx-auto text-sauge" />
        <h3 ref={doneRef} tabIndex={-1} className="mt-3 font-display text-3xl font-semibold outline-none">
          {fr(t.success.title)}
        </h3>
        <p className="mt-2 text-lg font-semibold">{fr(t.success.text)}</p>
        <p className="mt-2 text-ink-soft">{fr(t.success.note)}</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-semibold text-tomette-deep underline underline-offset-4">
          Revenir à l&apos;accueil
        </Link>
      </div>
    );
  }

  const input = (k: Key | "name" | "prizes" | "message", props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
    const id = `pm-${k}`;
    const error = k in check ? err(k as Key) : null;
    const help = k === "google" ? t.googleHelp : k === "name" ? t.nameHelp : undefined;
    return (
      <input
        id={id}
        value={v[k as keyof typeof v]}
        onChange={set(k as keyof typeof v)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, help)}
        className={inputClass}
        {...props}
      />
    );
  };

  return (
    <form noValidate onSubmit={submit} className="relative rounded-xl bg-paper p-5 shadow-md ring-1 ring-line sm:p-8">
      <h3 className="font-display text-2xl font-semibold sm:text-3xl">{fr(t.title)}</h3>
      <p className="mt-1 text-ink-soft">{fr(t.lead)}</p>
      <Honeypot value={website} onChange={setWebsite} />
      {tried && Object.values(check).some((x) => !x) ? (
        <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">
          {fr(t.errors.summary)}
        </p>
      ) : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="pm-shopName" label={t.shopName} required error={err("shopName")}>
          {input("shopName", { autoComplete: "organization", maxLength: 120 })}
        </Field>
        <Field id="pm-name" label={t.name} help={t.nameHelp}>
          {input("name", { autoComplete: "given-name", maxLength: 80 })}
        </Field>
        <Field id="pm-phone" label={t.phone} required error={err("phone")}>
          {input("phone", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "06 12 34 56 78" })}
        </Field>
        <Field id="pm-email" label={t.email} required error={err("email")}>
          {input("email", { type: "email", inputMode: "email", autoComplete: "email" })}
        </Field>
        <div className="sm:col-span-2">
          <Field id="pm-address" label={t.address} required error={err("address")}>
            {input("address", { autoComplete: "street-address", maxLength: 200 })}
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="pm-google" label={t.google} required help={t.googleHelp} error={err("google")}>
            {input("google", { maxLength: 300 })}
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="pm-logo" label={t.logo} help={t.logoHelp} error={logoError}>
            <div className="flex flex-wrap items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo.dataUrl} alt="" width={56} height={56} className="h-14 w-14 rounded-lg bg-cream object-contain ring-1 ring-line" />
              ) : null}
              <input ref={fileRef} id="pm-logo" type="file" accept="image/*" onChange={onLogo} className="sr-only" aria-describedby={describedBy("pm-logo", logoError, t.logoHelp)} />
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold ring-1 ring-line hover:ring-ink/40">
                <ImagePlus aria-hidden size={18} /> {logo ? t.logoReplace : t.logoChoose}
              </button>
              {logo ? (
                <button type="button" onClick={() => setLogo(null)} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-ink-soft">
                  <X aria-hidden size={16} /> {t.logoRemove}
                </button>
              ) : null}
            </div>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="pm-prizes" label={t.prizes} help={t.prizesHelp}>
            <textarea id="pm-prizes" value={v.prizes} onChange={set("prizes")} rows={3} maxLength={1000} aria-describedby="pm-prizes-help" className={`${inputClass} py-3`} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="pm-message" label={t.message} help={t.messageHelp}>
            <textarea id="pm-message" value={v.message} onChange={set("message")} rows={3} maxLength={2000} aria-describedby="pm-message-help" className={`${inputClass} py-3`} />
          </Field>
        </div>
      </div>
      <div className="mt-5">
        <label className="flex cursor-pointer gap-3 text-sm text-ink-soft">
          <input
            id="pm-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!err("consent")}
            aria-describedby={err("consent") ? "pm-consent-err" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-tomette"
          />
          <span>
            {fr(consentText)}{" "}
            <Link href="/confidentialite" className="font-semibold underline underline-offset-2">
              Confidentialité
            </Link>
          </span>
        </label>
        {err("consent") ? (
          <p id="pm-consent-err" className="mt-1 ml-8 text-sm font-medium text-danger">
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
        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-tomette px-7 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgb(196_64_31/0.7)] hover:bg-tomette-deep disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null}
        {status === "sending" ? t.submitting : t.submit}
      </button>
      <NextStep text={t.next} />
    </form>
  );
}
