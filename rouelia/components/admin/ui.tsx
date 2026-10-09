"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail, MessageCircle, Phone } from "lucide-react";

/** Petites briques partagées par les onglets de l'admin. */

export function phoneDisplay(e164: string) {
  return e164.startsWith("+33") ? ("0" + e164.slice(3)).replace(/(\d{2})(?=\d)/g, "$1 ") : e164;
}

export function when(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

/** Appel, WhatsApp et e-mail en un geste. */
export function ContactButtons({ phone, email, whatsappText = "" }: { phone: string; email: string; whatsappText?: string }) {
  const wa = `https://wa.me/${phone.replace(/\D/g, "")}${whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ""}`;
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`tel:${phone}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-tomette px-4 text-sm font-semibold text-white">
        <Phone aria-hidden size={14} /> {phoneDisplay(phone)}
      </a>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#1F7A4D] px-4 text-sm font-semibold text-white">
        <MessageCircle aria-hidden size={14} /> WhatsApp
      </a>
      <a href={`mailto:${email}`} className="inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-full px-4 text-sm font-semibold ring-1 ring-line">
        <Mail aria-hidden size={14} className="shrink-0" /> <span className="truncate">{email}</span>
      </a>
    </div>
  );
}

/** Notes privées, enregistrées automatiquement quand on quitte le champ. */
export function NotesField({ id, value, onSave }: { id: string; value: string; onSave: (v: string) => Promise<boolean> }) {
  const [v, setV] = useState(value);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timer = useRef<number>(0);
  useEffect(() => setV(value), [value]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function save() {
    if (v === value) return;
    setState("saving");
    const ok = await onSave(v);
    setState(ok ? "saved" : "error");
    window.clearTimeout(timer.current);
    if (ok) timer.current = window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <div className="mt-3">
      <label htmlFor={id} className="flex items-center justify-between text-xs font-semibold text-ink-soft">
        Notes privées
        <span aria-live="polite" className={state === "error" ? "text-danger" : "text-sauge"}>
          {state === "saving" ? "Enregistrement" : state === "saved" ? "Enregistré" : state === "error" ? "Non enregistré, réessayez" : ""}
        </span>
      </label>
      <textarea
        id={id}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={save}
        rows={v ? 3 : 1}
        maxLength={2000}
        placeholder="Ex. : rappelé le 10, à relancer jeudi"
        className="mt-1 w-full rounded-lg bg-cream px-3 py-2 text-sm ring-1 ring-line outline-none focus:bg-paper focus:ring-2 focus:ring-ink"
      />
    </div>
  );
}

/** Case « Fait » / « Traitée ». */
export function DoneToggle({ done, label, onChange }: { done: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => onChange(!done)}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${done ? "bg-sauge text-white" : "bg-paper ring-1 ring-line hover:ring-ink/40"}`}
    >
      <Check aria-hidden size={14} className={done ? "" : "opacity-30"} /> {label}
    </button>
  );
}

/** Pastilles de filtre avec compteur. */
export function FilterChips<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string; count: number }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${value === o.id ? "bg-ink text-white" : "bg-paper ring-1 ring-line hover:ring-ink/40"}`}
        >
          {o.label}
          <span className={`tabular rounded-full px-1.5 text-xs ${value === o.id ? "bg-white/20" : "bg-cream"}`}>{o.count}</span>
        </button>
      ))}
    </div>
  );
}

/** Appel JSON vers une route admin ; renvoie la réponse ou null. */
export async function adminFetch<T = Record<string, unknown>>(url: string, method: string, body?: object): Promise<(T & { ok: boolean }) | null> {
  try {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    if (res.status === 401) {
      window.location.reload();
      return null;
    }
    return (await res.json()) as T & { ok: boolean };
  } catch {
    return null;
  }
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 rounded-xl bg-paper p-6 text-center text-ink-soft ring-1 ring-line">{children}</p>;
}
