"use client";

import { useState } from "react";
import { Download, ExternalLink, Gift, ImageIcon, LoaderCircle, Pencil, Sparkles, Trash2 } from "lucide-react";
import { admin, pricing, trades, type PackId } from "@/content";
import { formatEuroCents, fr } from "@/lib/format";
import { offerSummary } from "@/lib/offers";
import { SIGNUP_STATUSES, type SignupRecord, type SignupStatus } from "@/lib/signup";
import { ShopPanel, type AdminShop } from "./ShopPanel";
import { adminFetch, ContactButtons, NotesField, phoneDisplay, when } from "./ui";

export const STATUS_STYLE: Record<SignupStatus, string> = {
  essai_en_attente: "bg-safran-soft text-ink",
  essai_en_cours: "bg-tomette-soft text-ink",
  client: "bg-sauge text-white",
  perdu: "bg-line text-ink-soft",
};

type Draft = { firstName: string; shopName: string; email: string; phone: string; pack: PackId };
const FIELD_LABEL: Record<keyof Draft, string> = { firstName: "Prénom", shopName: "Commerce", email: "E-mail", phone: "Téléphone", pack: "Pack" };
const FIELD_ERROR: Record<keyof Draft, string> = {
  firstName: "Indiquez un prénom.",
  shopName: "Indiquez le nom du commerce.",
  email: "E-mail invalide.",
  phone: "Numéro français invalide (exemple : 06 12 34 56 78).",
  pack: "Pack inconnu.",
};

const input = "min-h-11 w-full rounded-lg bg-paper px-3 ring-1 ring-line outline-none focus:ring-2 focus:ring-ink aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger";

/** Fiche d'une inscription : coordonnées, demande, roue, statut, notes, et ouverture de l'essai. Tout est modifiable. */
export function SignupCard({ s, shop, onSaved, onRemoved, onReload }: { s: SignupRecord; shop?: AdminShop; onSaved: (s: SignupRecord) => void; onRemoved: (id: string) => void; onReload: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>({ firstName: s.firstName, shopName: s.shopName, email: s.email, phone: phoneDisplay(s.phone), pack: s.pack });
  const [errors, setErrors] = useState<(keyof Draft)[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const trade = trades.find((t) => t.id === s.trade)?.label ?? "";
  const pack = pricing.packs.find((p) => p.id === s.pack)?.name ?? s.pack;
  const source = [s.utm.source, s.utm.medium, s.utm.campaign].filter(Boolean).join(" / ") || s.utm.referrer || admin.direct;
  const isRequest = !!s.request;

  async function patch(body: object): Promise<SignupRecord | null> {
    const d = await adminFetch<{ signup?: SignupRecord; errors?: (keyof Draft)[] }>("/api/admin/signups", "PATCH", { id: s.id, ...body });
    if (d?.ok && d.signup) {
      onSaved(d.signup);
      return d.signup;
    }
    if (d?.errors) setErrors(d.errors);
    return null;
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    setFailed(false);
    const ok = await patch(draft);
    setBusy(false);
    if (ok) setEditing(false);
    else setFailed(true);
  }

  async function remove() {
    if (!window.confirm(admin.confirmRemove(`${s.firstName} (${s.shopName})`))) return;
    const d = await adminFetch("/api/admin/signups", "DELETE", { id: s.id });
    if (d?.ok) onRemoved(s.id);
  }

  return (
    <li className="rounded-xl bg-paper p-4 ring-1 ring-line sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-xl font-semibold">
            {s.shopName} <span className="font-sans text-base font-normal text-ink-soft">· {s.firstName}</span>
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
            <span>{when(s.createdAt)}</span>
            {trade ? <span>· {trade}</span> : null}
            <span>· Pack {pack}</span>
            {isRequest ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-tomette-soft px-2 py-0.5 text-xs font-bold text-tomette-deep">
                <Sparkles aria-hidden size={12} /> Créez-la pour moi
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <label className="sr-only" htmlFor={`st-${s.id}`}>
            {admin.statusLabel}
          </label>
          <select id={`st-${s.id}`} value={s.status} onChange={(e) => patch({ status: e.target.value })} className={`min-h-10 rounded-full px-3 text-sm font-semibold ${STATUS_STYLE[s.status]}`}>
            {SIGNUP_STATUSES.map((st) => (
              <option key={st} value={st}>
                {admin.statuses[st]}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setEditing((x) => !x)} aria-expanded={editing} aria-label={`Modifier ${s.shopName}`} title="Modifier" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-cream hover:text-ink">
            <Pencil aria-hidden size={16} />
          </button>
          <button type="button" onClick={remove} aria-label={`${admin.remove} ${s.shopName}`} title={admin.remove} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-danger">
            <Trash2 aria-hidden size={16} />
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={saveEdit} noValidate className="mt-4 grid gap-3 rounded-lg bg-cream p-3 sm:grid-cols-2">
          {(["shopName", "firstName", "email", "phone"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={`${k}-${s.id}`} className="text-xs font-semibold">
                {FIELD_LABEL[k]}
              </label>
              <input
                id={`${k}-${s.id}`}
                value={draft[k]}
                onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                type={k === "email" ? "email" : k === "phone" ? "tel" : "text"}
                aria-invalid={errors.includes(k)}
                aria-describedby={errors.includes(k) ? `${k}-${s.id}-err` : undefined}
                className={`${input} mt-1`}
              />
              {errors.includes(k) ? (
                <p id={`${k}-${s.id}-err`} className="mt-1 text-xs font-semibold text-danger">
                  {FIELD_ERROR[k]}
                </p>
              ) : null}
            </div>
          ))}
          <div>
            <label htmlFor={`pack-edit-${s.id}`} className="text-xs font-semibold">
              {FIELD_LABEL.pack}
            </label>
            <select id={`pack-edit-${s.id}`} value={draft.pack} onChange={(e) => setDraft((d) => ({ ...d, pack: e.target.value as PackId }))} className={`${input} mt-1`}>
              {pricing.packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
            <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white disabled:opacity-60">
              {busy ? <LoaderCircle aria-hidden size={16} className="animate-spin" /> : null} Enregistrer
            </button>
            <button type="button" onClick={() => setEditing(false)} className="inline-flex min-h-11 items-center rounded-full px-4 font-semibold ring-1 ring-line">
              Annuler
            </button>
            {shop ? <p className="text-xs text-ink-soft">L&apos;essai est ouvert : l&apos;e-mail, le prénom et le téléphone du commerce sont mis à jour aussi.</p> : null}
            {failed && !errors.length ? (
              <p role="alert" className="text-sm font-semibold text-danger">
                L&apos;enregistrement a échoué. Réessayez.
              </p>
            ) : null}
          </div>
        </form>
      ) : (
        <div className="mt-3">
          <ContactButtons phone={s.phone} email={s.email} whatsappText={`Bonjour ${s.firstName}, `} />
        </div>
      )}

      {s.request ? (
        <div className="mt-3 rounded-lg bg-tomette-soft/40 p-3 text-sm ring-1 ring-tomette-soft">
          <p className="font-semibold">Ce qu&apos;il demande pour sa roue</p>
          <div className="mt-2 flex gap-3">
            {s.request.hasLogo ? (
              <div className="shrink-0 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/admin/signups/logo?id=${s.id}`} alt={`Logo envoyé par ${s.shopName}`} className="h-20 w-20 rounded-lg bg-paper object-contain p-1 ring-1 ring-line" />
                <a href={`/api/admin/signups/logo?id=${s.id}&telecharger=1`} className="mt-1 inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-tomette-deep underline">
                  <Download aria-hidden size={12} /> Logo
                </a>
              </div>
            ) : s.request.logoName ? (
              <p className="flex shrink-0 items-center gap-1 text-xs text-ink-soft">
                <ImageIcon aria-hidden size={14} /> Logo dans l&apos;e-mail d&apos;alerte
              </p>
            ) : null}
            <dl className="min-w-0 space-y-1.5">
              {[
                ["Lots souhaités", s.request.prizes || "À proposer"],
                ["Message", s.request.message || "Aucun"],
                ["Adresse", s.request.address],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="inline font-semibold">{k} : </dt>
                  <dd className="inline break-words whitespace-pre-line">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="inline font-semibold">Fiche Google : </dt>
                <dd className="inline break-words">
                  {/^https?:\/\//.test(s.request.google) ? (
                    <a href={s.request.google} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-tomette-deep underline">
                      Ouvrir <ExternalLink aria-hidden size={12} />
                    </a>
                  ) : (
                    s.request.google
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : null}

      {s.wheelConfig ? (
        <div className="mt-3 rounded-lg bg-cream p-3 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            {admin.wheel} · {formatEuroCents(s.wheelConfig.averageCost)} {admin.avgCost}
            {s.wheelConfig.logo ? (
              <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                <ImageIcon aria-hidden size={12} /> {admin.logo}
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-ink-soft">{s.wheelConfig.prizes.map((p) => `${p.name} ${p.percent} %`).join(" · ")}</p>
        </div>
      ) : null}

      {s.offer ? (
        <p className={`mt-3 flex gap-2 rounded-lg p-3 text-sm ${s.offer.status === "applied" ? "bg-sauge/10" : "bg-safran-soft"}`}>
          <Gift aria-hidden size={16} className="mt-0.5 shrink-0" />
          <span>
            <span className="font-semibold">{admin.offer.title} : </span>
            {fr(offerSummary(s.offer))}
          </span>
        </p>
      ) : null}

      <ShopPanel signup={s} shop={shop} onChange={onReload} />

      <NotesField id={`notes-${s.id}`} value={s.notes ?? ""} onSave={async (notes) => !!(await patch({ notes }))} />

      <p className="mt-2 text-xs text-ink-soft">
        {admin.source} : {source}
      </p>
    </li>
  );
}
