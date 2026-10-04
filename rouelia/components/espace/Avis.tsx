"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, LoaderCircle, Lock, Sparkles, Star } from "lucide-react";
import type { ReviewSettings } from "@/lib/shop-config";
import { defaultSignature } from "@/lib/signature";
import { api, card, input } from "./api";

const ERRORS: Record<string, string> = {
  quota: "Vous avez utilisé toutes vos réponses de ce mois-ci. Elles reviennent le 1er du mois, ou passez en Premium pour des réponses illimitées.",
  indisponible: "Les réponses par IA ne sont pas encore activées. Elles arrivent très vite.",
  invalide: "Indiquez le nombre d'étoiles de l'avis.",
  rafale: "Beaucoup de demandes en peu de temps : patientez quelques minutes.",
  refus: "L'IA n'a pas pu rédiger de réponse pour cet avis. Essayez de reformuler votre version, ou répondez vous-même.",
};

export function Avis({ name }: { name: string }) {
  const [state, setState] = useState<{ ready: boolean; quota: number | null; used: number; settings: ReviewSettings } | null>(null);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [note, setNote] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(-1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<{ ready: boolean; quota: number | null; used: number; settings: ReviewSettings }>("/api/espace/avis").then((d) => d.ok && setState(d));
  }, []);

  async function generate() {
    if (!stars) return setError(ERRORS.invalide);
    setBusy(true);
    setError("");
    setReplies([]);
    try {
      const d = await api<{ replies: string[]; used: number }>("/api/espace/avis", { method: "POST", body: JSON.stringify({ stars, text, firstName, note }) });
      if (d.ok) {
        setReplies(d.replies);
        setState((s) => (s ? { ...s, used: d.used } : s));
      } else setError(ERRORS[d.error ?? ""] ?? "La rédaction n'a pas abouti. Réessayez dans un instant.");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    }
    setBusy(false);
  }

  async function saveSettings(next: ReviewSettings) {
    setState((s) => (s ? { ...s, settings: next } : s));
    const d = await api("/api/espace/reglages", { method: "PUT", body: JSON.stringify({ settings: { reviews: next } }) });
    if (d.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  function copy(i: number, value: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(i);
      setTimeout(() => setCopied(-1), 2000);
    });
  }

  if (!state) return <div className={`${card} h-40 animate-pulse`} />;

  if (state.quota === 0) {
    return (
      <section className={card}>
        <h2 className="font-display text-2xl font-semibold">Réponses aux avis en un clic</h2>
        <p className="mt-2 text-ink-soft">Collez un avis Google, l&apos;IA vous propose deux réponses soignées, adaptées à la note et à ce que le client a écrit. Vous copiez, vous publiez.</p>
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <Lock aria-hidden size={16} /> Inclus dans Croissance (30 réponses par mois) et Premium (illimité).
        </p>
        <a href="/espace/abonnement" className="mt-4 inline-flex min-h-12 items-center rounded-full bg-tomette px-5 font-semibold text-white hover:bg-tomette-deep">Voir les packs</a>
      </section>
    );
  }

  const left = state.quota === null ? null : Math.max(0, state.quota - state.used);
  const r = state.settings;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <section className={card}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-semibold">Répondre à un avis</h2>
            <p className="text-sm text-ink-soft">{left === null ? "Réponses illimitées" : `${left} réponse${left > 1 ? "s" : ""} restante${left > 1 ? "s" : ""} ce mois-ci`}</p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">Copiez l&apos;avis depuis votre fiche Google et collez-le ici.</p>

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">Note de l&apos;avis</legend>
            <div role="radiogroup" aria-label="Note de l'avis" className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} étoile${n > 1 ? "s" : ""}`} onClick={() => setStars(n)} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream">
                  <Star aria-hidden size={26} className={n <= stars ? "fill-safran text-safran" : "text-line"} />
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm font-semibold">
            Prénom affiché du client
            <input className={`${input} mt-1`} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Julie" maxLength={60} />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Texte de l&apos;avis
            <textarea className={`${input} mt-1 min-h-28 py-3`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Laissez vide si l'avis n'a que des étoiles." maxLength={4000} />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Votre version <span className="font-normal text-ink-soft">(facultatif)</span>
            <textarea className={`${input} mt-1 min-h-20 py-3`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ce qui s'est passé, ou ce que vous faites pour que ça ne se reproduise pas. L'IA s'en sert sans rien inventer." maxLength={1000} />
          </label>

          <button type="button" disabled={busy || !state.ready || left === 0} onClick={generate} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-tomette px-6 font-semibold text-white hover:bg-tomette-deep disabled:opacity-60">
            {busy ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : <Sparkles aria-hidden size={18} />}
            {busy ? "Rédaction en cours" : "Proposer deux réponses"}
          </button>
          {!state.ready ? <p className="mt-3 text-sm text-ink-soft">{ERRORS.indisponible}</p> : null}
          {left === 0 ? <p className="mt-3 text-sm text-ink-soft">{ERRORS.quota}</p> : null}
          {error ? <p role="alert" className="mt-3 text-sm font-semibold text-danger">{error}</p> : null}
        </section>

        {replies.map((reply, i) => (
          <section key={i} className={card}>
            <h3 className="text-sm font-bold tracking-[0.1em] text-tomette-deep uppercase">Proposition {i + 1}</h3>
            <textarea className={`${input} mt-2 min-h-56 py-3 text-base [field-sizing:content]`} value={reply} onChange={(e) => setReplies((all) => all.map((x, j) => (j === i ? e.target.value : x)))} aria-label={`Proposition ${i + 1}, modifiable`} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => copy(i, reply)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white">
                {copied === i ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />} {copied === i ? "Copiée" : "Copier"}
              </button>
              <a href="https://business.google.com/reviews" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-5 font-semibold ring-1 ring-line">
                <ExternalLink aria-hidden size={16} /> Ouvrir mes avis Google
              </a>
            </div>
          </section>
        ))}
      </div>

      <aside className={`${card} h-fit`}>
        <h2 className="font-display text-xl font-semibold">Vos réponses</h2>
        <p className="mt-1 text-sm text-ink-soft">Le ton s&apos;adapte tout seul à chaque avis : chaleureux avec un client ravi, posé avec un client déçu.</p>
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">Avec vos clients</legend>
          <div className="mt-2 flex gap-2">
            {[
              [true, "Vous"],
              [false, "Tu"],
            ].map(([v, label]) => (
              <button key={String(v)} type="button" aria-pressed={r.formal === v} onClick={() => saveSettings({ ...r, formal: v as boolean })} className={`min-h-10 rounded-full px-4 text-sm font-semibold ring-1 ${r.formal === v ? "bg-ink text-white ring-ink" : "bg-cream ring-line"}`}>
                {label as string}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">Longueur</legend>
          <div className="mt-2 flex gap-2">
            {(["courte", "normale"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={r.length === v} onClick={() => saveSettings({ ...r, length: v })} className={`min-h-10 rounded-full px-4 text-sm font-semibold capitalize ring-1 ${r.length === v ? "bg-ink text-white ring-ink" : "bg-cream ring-line"}`}>
                {v}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-4 block text-sm font-semibold">
          Signature
          <input className={`${input} mt-1`} defaultValue={r.signature} onBlur={(e) => e.target.value !== r.signature && saveSettings({ ...r, signature: e.target.value })} placeholder={defaultSignature(name)} maxLength={80} />
        </label>
        {saved ? <p role="status" className="mt-3 text-sm font-semibold text-sauge">Enregistré</p> : null}
        <p className="mt-4 text-xs text-ink-soft">L&apos;IA ne publie jamais rien à votre place et ne mentionne jamais la roue ni les cadeaux : Google interdit les avis obtenus contre une récompense.</p>
      </aside>
    </div>
  );
}
