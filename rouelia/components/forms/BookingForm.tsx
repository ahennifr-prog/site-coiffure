"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarCheck, CheckCircle2, LoaderCircle } from "lucide-react";
import { brand, cta } from "@/content";
import { fr } from "@/lib/format";
import { isEmail, normalizeFrenchPhone } from "@/lib/signup";
import { booking as t, consentText } from "@/textes/formulaires";
import { describedBy, Field, Honeypot, inputClass, NextStep } from "./Field";

interface Slot {
  id: string;
  time: string;
  free: boolean;
}
interface Day {
  day: string;
  slots: Slot[];
}

const dayFmt = (day: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", { ...opts, timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));
const longDay = (day: string) => dayFmt(day, { weekday: "long", day: "numeric", month: "long" });
const whenText = (id: string) => `${longDay(id.slice(0, 10))} à ${id.slice(11).replace(":", " h ")}`;

/** Regroupement des créneaux pour la lecture : matin, midi, après-midi, soir. */
const PERIODS = [
  { id: "matin", label: "Matin" },
  { id: "midi", label: "Midi" },
  { id: "apres-midi", label: "Après-midi" },
  { id: "soir", label: "Soir" },
] as const;
function periodOf(time: string): (typeof PERIODS)[number]["id"] {
  const h = Number(time.slice(0, 2));
  return h < 12 ? "matin" : h < 14 ? "midi" : h < 18 ? "apres-midi" : "soir";
}

type Key = "name" | "phone" | "email" | "consent";

/** Calendrier des 14 prochains jours (créneaux de 5 minutes, heure de Paris) et formulaire de réservation. */
export function BookingForm() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [v, setV] = useState({ name: "", phone: "", email: "", shop: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/rendez-vous", { cache: "no-store" });
      const data = await res.json();
      if (!data.ok) throw new Error();
      const list = data.days as Day[];
      setDays(list);
      setDay((d) => d ?? list.find((x) => x.slots.some((s) => s.free))?.day ?? list[0]?.day ?? null);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const check: Record<Key, boolean> = { name: !!v.name.trim(), phone: !!normalizeFrenchPhone(v.phone), email: isEmail(v.email.trim()), consent };
  const err = (k: Key) => (tried && !check[k] ? t.form.errors[k] : null);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((x) => ({ ...x, [k]: e.target.value }));

  function pick(id: string) {
    setSlot(id);
    setServerError(null);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    setServerError(null);
    if (!slot) {
      setServerError(t.form.errors.slot);
      return;
    }
    const first = (Object.keys(check) as Key[]).find((k) => !check[k]);
    if (first) {
      document.getElementById(`rdv-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/rendez-vous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, slot, consent, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setStatus("idle");
        setServerError(data.error === "closed" ? t.form.errors.closed : t.form.errors.taken);
        setSlot(null);
        void load();
        return;
      }
      if (!res.ok || !data.ok) {
        setStatus("idle");
        setServerError(res.status === 429 ? t.form.errors.rate : t.form.errors.server);
        return;
      }
      setDone(whenText(slot));
      setStatus("done");
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch {
      setStatus("idle");
      setServerError(t.form.errors.server);
    }
  }

  if (status === "done" && done) {
    return (
      <div role="status" className="pop-in rounded-xl bg-paper p-6 text-center shadow-md ring-1 ring-line sm:p-10">
        <CheckCircle2 aria-hidden size={44} className="mx-auto text-sauge" />
        <h2 ref={doneRef} tabIndex={-1} className="mt-3 font-display text-3xl font-semibold outline-none">
          {fr(t.success.title)}
        </h2>
        <p className="mt-2 text-lg font-semibold">{fr(t.success.text(done))}</p>
        <p className="mt-2 text-ink-soft">{fr(t.success.note)}</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-semibold text-tomette-deep underline underline-offset-4">
          Revenir à l&apos;accueil
        </Link>
      </div>
    );
  }

  const current = days?.find((d) => d.day === day);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      <section aria-labelledby="rdv-jours" className="rounded-xl bg-paper p-5 shadow-md ring-1 ring-line sm:p-7">
        <h2 id="rdv-jours" className="text-lg font-bold">
          {t.calendarTitle}
        </h2>
        {loadError ? (
          <div role="alert" className="mt-4 rounded-lg bg-danger/10 p-4 text-sm font-semibold text-danger">
            {fr(t.loadError)}{" "}
            <button type="button" onClick={() => void load()} className="underline underline-offset-2">
              {t.retry}
            </button>
          </div>
        ) : !days ? (
          <p role="status" className="mt-4 flex items-center gap-2 text-ink-soft">
            <LoaderCircle aria-hidden size={18} className="animate-spin" /> {t.loading}
          </p>
        ) : (
          <>
            <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {days.map((d) => {
                const free = d.slots.filter((s) => s.free).length;
                const on = d.day === day;
                return (
                  <li key={d.day}>
                    <button
                      type="button"
                      onClick={() => setDay(d.day)}
                      disabled={!free}
                      aria-pressed={on}
                      aria-label={`${longDay(d.day)}${free ? "" : `, ${t.closed}`}`}
                      className={`flex min-h-16 w-full flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                        on ? "bg-tomette text-white" : free ? "bg-cream ring-1 ring-line hover:ring-ink/40" : "cursor-not-allowed bg-cream/60 text-ink-soft/60"
                      }`}
                    >
                      <span className="text-xs capitalize">{dayFmt(d.day, { weekday: "short" }).replace(".", "")}</span>
                      <span className="text-lg leading-none font-bold">{dayFmt(d.day, { day: "numeric" })}</span>
                      <span className="text-[11px]">{dayFmt(d.day, { month: "short" }).replace(".", "")}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {current ? (
              <div className="mt-6">
                <h3 className="font-semibold first-letter:uppercase">{t.slotsTitle(longDay(current.day))}</h3>
                {current.slots.some((s) => s.free) ? (
                  <div className="mt-3 max-h-[380px] space-y-4 overflow-y-auto pr-1">
                    {PERIODS.map((period) => {
                      const list = current.slots.filter((s) => periodOf(s.time) === period.id);
                      if (!list.length) return null;
                      return (
                        <div key={period.id} role="group" aria-label={period.label}>
                          <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">{period.label}</p>
                          <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {list.map((s) => (
                              <li key={s.id}>
                                <button
                                  type="button"
                                  disabled={!s.free}
                                  onClick={() => pick(s.id)}
                                  aria-pressed={slot === s.id}
                                  className={`min-h-11 w-full rounded-full text-sm font-semibold tabular transition-colors ${
                                    slot === s.id ? "bg-ink text-white" : s.free ? "bg-cream ring-1 ring-line hover:ring-ink/40" : "cursor-not-allowed bg-cream/50 text-ink-soft/50 line-through"
                                  }`}
                                >
                                  {s.time.replace(":", " h ")}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-3 text-ink-soft">{fr(t.noSlot)}</p>
                )}
              </div>
            ) : null}
          </>
        )}
      </section>

      <form ref={formRef} noValidate onSubmit={submit} className="relative scroll-mt-24 rounded-xl bg-paper p-5 shadow-md ring-1 ring-line sm:p-7">
        <h2 className="text-lg font-bold">{t.form.title}</h2>
        <p aria-live="polite" className={`mt-3 flex items-center gap-2 rounded-lg p-3 text-sm font-semibold ${slot ? "bg-sauge-soft text-sauge" : "bg-cream text-ink-soft"}`}>
          <CalendarCheck aria-hidden size={18} className="shrink-0" />
          {slot ? fr(t.slotLabel(whenText(slot))) : fr(t.form.errors.slot)}
        </p>
        <Honeypot value={website} onChange={setWebsite} />
        <div className="mt-5 space-y-4">
          <Field id="rdv-name" label={t.form.name} required error={err("name")}>
            <input id="rdv-name" value={v.name} onChange={set("name")} autoComplete="name" maxLength={80} aria-invalid={!!err("name")} aria-describedby={describedBy("rdv-name", err("name"))} className={inputClass} />
          </Field>
          <Field id="rdv-phone" label={t.form.phone} required error={err("phone")}>
            <input id="rdv-phone" type="tel" inputMode="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" placeholder="06 12 34 56 78" aria-invalid={!!err("phone")} aria-describedby={describedBy("rdv-phone", err("phone"))} className={inputClass} />
          </Field>
          <Field id="rdv-email" label={t.form.email} required help={t.form.emailHelp} error={err("email")}>
            <input id="rdv-email" type="email" inputMode="email" value={v.email} onChange={set("email")} autoComplete="email" aria-invalid={!!err("email")} aria-describedby={describedBy("rdv-email", err("email"), t.form.emailHelp)} className={inputClass} />
          </Field>
          <Field id="rdv-shop" label={t.form.shop} help={t.form.shopHelp}>
            <input id="rdv-shop" value={v.shop} onChange={set("shop")} autoComplete="organization" maxLength={120} aria-describedby="rdv-shop-help" className={inputClass} />
          </Field>
          <div>
            <label className="flex cursor-pointer gap-3 text-sm text-ink-soft">
              <input id="rdv-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!err("consent")} aria-describedby={err("consent") ? "rdv-consent-err" : undefined} className="mt-0.5 h-5 w-5 shrink-0 accent-tomette" />
              <span>
                {fr(consentText)}{" "}
                <Link href="/confidentialite" className="font-semibold underline underline-offset-2">
                  Confidentialité
                </Link>
              </span>
            </label>
            {err("consent") ? (
              <p id="rdv-consent-err" className="mt-1 ml-8 text-sm font-medium text-danger">
                {fr(t.form.errors.consent)}
              </p>
            ) : null}
          </div>
        </div>
        {serverError ? (
          <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">
            {fr(serverError)}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-tomette px-7 font-semibold text-white shadow-[0_8px_20px_-8px_rgb(196_64_31/0.7)] hover:bg-tomette-deep disabled:opacity-70"
        >
          {status === "sending" ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null}
          {status === "sending" ? t.form.submitting : t.form.submit}
        </button>
        <NextStep text={t.form.next} tone="center" />
        <p className="mt-4 text-center text-sm text-ink-soft">
          {t.alternative}{" "}
          <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-tomette-deep underline underline-offset-2">
            {cta.whatsapp}
          </a>{" "}
          ou{" "}
          <a href={`mailto:${brand.email}`} className="font-semibold text-tomette-deep underline underline-offset-2">
            {brand.email}
          </a>
        </p>
      </form>
    </div>
  );
}
