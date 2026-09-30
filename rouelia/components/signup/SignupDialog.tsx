"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, ImagePlus, LoaderCircle, X } from "lucide-react";
import { demo as demoText, pricing, signup as t } from "@/content";
import { formatEuro, fr } from "@/lib/format";
import { freeTextEstablishment } from "@/lib/places";
import { validateSignup, type SignupErrorKey, type SignupField, type SignupPayload } from "@/lib/signup";
import { useAppState } from "@/components/AppState";
import { Monogram } from "@/components/demo/PhoneScreen";
import { readImage } from "@/components/demo/readImage";

type Status = "idle" | "submitting" | "success" | "error";

function Field({
  id,
  label,
  error,
  help,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {help && !error ? (
        <p id={`${id}-help`} className="mt-1 text-xs text-ink-soft">
          {fr(help)}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-medium text-danger">
          {fr(error)}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "min-h-12 w-full rounded-lg bg-cream px-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger";

export function SignupDialog() {
  const app = useAppState();
  const dialog = useRef<HTMLDialogElement>(null);
  const uid = useId();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [consent, setConsent] = useState(false);
  const [pack, setPack] = useState(app.signup.pack);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [logoError, setLogoError] = useState<string | null>(null);
  // Champ piège invisible pour les robots.
  const [website, setWebsite] = useState("");

  // Ouverture : on reprend la roue et le pack choisis.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (app.signup.open && !d.open) {
      setPack(app.signup.pack);
      setShopName((s) => s || app.demo.shopName);
      if (status === "success") {
        setStatus("idle");
        setSubmitted(false);
      }
      d.showModal();
    } else if (!app.signup.open && d.open) d.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.signup.open]);

  const errors: Partial<Record<SignupField, SignupErrorKey>> = submitted
    ? validateSignup({ firstName, email, phone, shopName, consent })
    : {};
  const msg = (f: SignupField) => (errors[f] ? t.errors[errors[f] as SignupErrorKey] : undefined);
  const aria = (f: SignupField, help = false) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `${uid}-${f}-error` : help ? `${uid}-${f}-help` : undefined,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateSignup({ firstName, email, phone, shopName, consent });
    if (Object.keys(errs).length > 0) {
      const first = (["firstName", "email", "phone", "shopName", "consent"] as SignupField[]).find((f) => errs[f]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    const payload: SignupPayload = {
      firstName,
      email,
      phone,
      establishment: freeTextEstablishment(shopName),
      pack,
      wheel: { ...app.wheelConfig(), shopName: app.demo.shopName.trim() || shopName.trim() },
      utm: app.utm ?? { source: null, medium: null, campaign: null, term: null, content: null, referrer: null, landingPath: null },
      consent: { accepted: consent, text: t.consent },
    };
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  async function onLogo(file: File | undefined) {
    if (!file) return;
    const res = await readImage(file, demoText.maxLogoSizeMb);
    if ("error" in res) setLogoError(res.error === "type" ? demoText.fields.logo.errorType : demoText.fields.logo.errorSize);
    else {
      setLogoError(null);
      app.setLogo(res.dataUrl);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <dialog
      ref={dialog}
      onClose={app.closeSignup}
      aria-labelledby={`${uid}-title`}
      className="m-auto max-h-[100svh] w-full max-w-lg overflow-y-auto bg-transparent p-0 sm:max-h-[92svh] sm:p-4"
    >
      <div className="relative min-h-[100svh] bg-paper p-6 sm:min-h-0 sm:rounded-xl sm:p-8 sm:shadow-lg">
        <button
          type="button"
          onClick={app.closeSignup}
          aria-label={t.close}
          className="absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream"
        >
          <X aria-hidden size={22} />
        </button>

        {status === "success" ? (
          <div className="py-10 text-center" role="status">
            <span className="pop-in mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-sauge text-white">
              <Check aria-hidden size={32} strokeWidth={3} />
            </span>
            <h2 id={`${uid}-title`} className="mt-5 font-display text-3xl font-semibold">
              {fr(t.success.title)}
            </h2>
            <p className="mt-3 text-ink-soft">{fr(t.success.text(firstName.trim()))}</p>
            <button
              type="button"
              onClick={app.closeSignup}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-semibold text-white"
            >
              {t.success.close}
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit}>
            <h2 id={`${uid}-title`} className="pr-10 font-display text-3xl font-semibold">
              {fr(t.title)}
            </h2>
            <p className="mt-2 text-ink-soft">{fr(t.lead)}</p>

            {hasErrors ? (
              <p role="alert" className="mt-5 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">
                {fr(t.errors.summary)}
              </p>
            ) : null}

            <div className="mt-6 space-y-4">
              <p id={`${uid}-pack-label`} className="text-sm font-semibold">
                {t.fields.pack.label}
              </p>
              <div role="radiogroup" aria-labelledby={`${uid}-pack-label`} className="-mt-2 grid grid-cols-3 gap-2">
                {pricing.packs.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={pack === p.id}
                    onClick={() => setPack(p.id)}
                    className={`min-h-14 rounded-lg px-2 text-sm font-semibold ring-1 transition-colors ${
                      pack === p.id ? "bg-ink text-white ring-ink" : "bg-cream ring-line hover:ring-ink/40"
                    }`}
                  >
                    {p.name}
                    <span className={`block text-xs font-medium ${pack === p.id ? "text-white/85" : "text-ink-soft"}`}>
                      {formatEuro(p.price)} {pricing.perMonth}
                    </span>
                  </button>
                ))}
              </div>

              <Field id={`${uid}-firstName`} label={t.fields.firstName.label} error={msg("firstName")}>
                <input id={`${uid}-firstName`} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete={t.fields.firstName.autocomplete} className={inputClass} {...aria("firstName")} />
              </Field>

              <Field id={`${uid}-email`} label={t.fields.email.label} error={msg("email")}>
                <input id={`${uid}-email`} type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete={t.fields.email.autocomplete} className={inputClass} {...aria("email")} />
              </Field>

              <Field id={`${uid}-phone`} label={t.fields.phone.label} error={msg("phone")} help={t.fields.phone.help}>
                <div className="flex">
                  <span className="inline-flex min-h-12 items-center rounded-l-lg bg-line px-3 font-semibold" aria-hidden>
                    {t.fields.phone.prefix}
                  </span>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete={t.fields.phone.autocomplete}
                    placeholder={t.fields.phone.placeholder}
                    className={`${inputClass} rounded-l-none`}
                    {...aria("phone", true)}
                  />
                </div>
              </Field>

              <Field id={`${uid}-shopName`} label={t.fields.shopName.label} error={msg("shopName")} help={t.fields.shopName.help}>
                <input id={`${uid}-shopName`} value={shopName} onChange={(e) => setShopName(e.target.value)} autoComplete="organization" className={inputClass} {...aria("shopName", true)} />
              </Field>

              <div>
                <p className="text-sm font-semibold">{t.fields.logo.label}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-cream ring-1 ring-line">
                    {app.demo.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.demo.logo} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <Monogram text={app.monogram} color={app.primary} className="h-full w-full" />
                    )}
                  </span>
                  <input id={`${uid}-logo`} type="file" accept="image/*" className="sr-only" onChange={(e) => onLogo(e.target.files?.[0])} />
                  <label htmlFor={`${uid}-logo`} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold ring-1 ring-line">
                    <ImagePlus aria-hidden size={18} /> {app.demo.logo ? demoText.fields.logo.replace : demoText.fields.logo.upload}
                  </label>
                </div>
                <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" checked={app.demo.noLogo} onChange={(e) => app.setNoLogo(e.target.checked)} className="h-5 w-5 accent-tomette" />
                  {t.fields.logo.none}
                </label>
                {logoError ? <p className="mt-1 text-sm font-medium text-danger">{fr(logoError)}</p> : null}
              </div>

              <div>
                <label className="flex cursor-pointer gap-3 rounded-lg bg-cream p-3 text-sm ring-1 ring-line has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tomette">
                  <input
                    id={`${uid}-consent`}
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-tomette"
                    {...aria("consent")}
                  />
                  <span>{fr(t.consent)}</span>
                </label>
                {msg("consent") ? (
                  <p id={`${uid}-consent-error`} className="mt-1 text-sm font-medium text-danger">
                    {fr(msg("consent") as string)}
                  </p>
                ) : null}
              </div>

              <p className="text-xs text-ink-soft">
                {fr(t.info)}{" "}
                <Link href="/confidentialite" className="font-semibold text-tomette-deep underline underline-offset-2" target="_blank">
                  {t.privacyLink}
                </Link>
              </p>
            </div>

            {status === "error" ? (
              <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">
                {fr(t.errors.server)}
              </p>
            ) : null}

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-tomette px-6 text-lg font-semibold text-white shadow-md hover:bg-tomette-deep disabled:opacity-80"
            >
              {status === "submitting" ? (
                <>
                  <LoaderCircle aria-hidden size={20} className="animate-spin" /> {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
