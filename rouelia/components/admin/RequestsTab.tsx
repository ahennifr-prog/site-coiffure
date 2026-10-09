"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Store, Trash2, UserPlus } from "lucide-react";
import { pricing } from "@/content";
import type { AdminRequest } from "@/lib/admin";
import type { SignupRecord } from "@/lib/signup";
import { adminFetch, ContactButtons, DoneToggle, Empty, FilterChips, NotesField, when } from "./ui";

type Filter = "a-traiter" | "traitees" | "toutes";

/**
 * Demandes reçues par les formulaires : « Créez-la pour moi » (aussi présentes dans les inscriptions)
 * et « Autre activité » (page /pour-qui). On les marque traitées une fois la réponse faite.
 */
export function RequestsTab({
  requests,
  setRequests,
  signups,
  onOpenSignup,
  onReload,
}: {
  requests: AdminRequest[];
  setRequests: (f: (r: AdminRequest[]) => AdminRequest[]) => void;
  signups: SignupRecord[];
  onOpenSignup: (shopName: string) => void;
  onReload: () => void;
}) {
  const [filter, setFilter] = useState<Filter>("a-traiter");
  const todo = requests.filter((r) => !r.done);
  const list = filter === "a-traiter" ? todo : filter === "traitees" ? requests.filter((r) => r.done) : requests;

  async function follow(id: string, body: { done?: boolean; notes?: string }) {
    setRequests((rs) => rs.map((r) => (r.id === id ? ({ ...r, ...body } as AdminRequest) : r)));
    return !!(await adminFetch("/api/admin/demandes", "PATCH", { id, ...body }))?.ok;
  }

  async function toSignup(id: string) {
    const d = await adminFetch<{ signupId?: string }>("/api/admin/demandes", "POST", { id });
    if (d?.ok && d.signupId) {
      setRequests((rs) => rs.map((r) => (r.id === id ? ({ ...r, signupId: d.signupId } as AdminRequest) : r)));
      onReload();
    }
  }

  async function remove(r: AdminRequest) {
    const who = r.kind === "autre-activite" ? r.name : r.shopName;
    if (!window.confirm(`Supprimer définitivement la demande de ${who} ?${r.kind !== "autre-activite" && r.signupId ? " Sa fiche dans les inscriptions est gardée." : ""}`)) return;
    const d = await adminFetch("/api/admin/demandes", "DELETE", { id: r.id });
    if (d?.ok) setRequests((rs) => rs.filter((x) => x.id !== r.id));
  }

  return (
    <section aria-label="Demandes reçues">
      <FilterChips
        label="Filtrer les demandes"
        value={filter}
        onChange={setFilter}
        options={[
          { id: "a-traiter", label: "À traiter", count: todo.length },
          { id: "traitees", label: "Traitées", count: requests.length - todo.length },
          { id: "toutes", label: "Toutes", count: requests.length },
        ]}
      />
      {list.length === 0 ? (
        <Empty>{filter === "a-traiter" ? "Rien à traiter. Les formulaires « Créez-la pour moi » et « Autre activité » arrivent ici." : "Aucune demande."}</Empty>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((r) => {
            const other = r.kind === "autre-activite";
            const signup = !other && r.signupId ? signups.find((s) => s.id === r.signupId) : undefined;
            const pack = !other && r.pack ? pricing.packs.find((p) => p.id === r.pack)?.name : undefined;
            return (
              <li key={r.id} className={`rounded-xl p-4 ring-1 ring-line sm:p-5 ${r.done ? "bg-cream" : "bg-paper"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${other ? "bg-sauge-soft text-sauge" : "bg-tomette-soft text-tomette-deep"}`}>
                      {other ? <Store aria-hidden size={12} /> : <Sparkles aria-hidden size={12} />}
                      {other ? "Autre activité" : `Créez-la pour moi${pack ? ` · ${pack}` : ""}`}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold">
                      {other ? r.name : r.shopName}
                      {!other && r.name ? <span className="font-sans text-base font-normal text-ink-soft"> · {r.name}</span> : null}
                    </p>
                    <p className="text-xs text-ink-soft">Reçue le {when(r.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DoneToggle done={!!r.done} label="Traitée" onChange={(done) => follow(r.id, { done })} />
                    <button type="button" onClick={() => remove(r)} aria-label="Supprimer la demande" title="Supprimer" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-danger">
                      <Trash2 aria-hidden size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <ContactButtons phone={r.phone} email={r.email} whatsappText={`Bonjour${!other && r.name ? ` ${r.name}` : ""}, c'est Rouelia. `} />
                </div>
                <dl className="mt-3 space-y-1.5 rounded-lg bg-cream p-3 text-sm">
                  {(other
                    ? [
                        ["Activité", r.description],
                        ["Cadeaux souhaités", r.prizes || "À proposer"],
                      ]
                    : [
                        ["Lots souhaités", r.prizes || "À proposer"],
                        ["Message", r.message || "Aucun"],
                        ["Adresse", r.address],
                        ["Fiche Google", r.google],
                        ["Logo", r.logoName ? `${r.logoName} (${signup?.request?.hasLogo ? "sur sa fiche" : "dans l'e-mail d'alerte"})` : "Aucun"],
                      ]
                  ).map(([k, v]) => (
                    <div key={k}>
                      <dt className="inline font-semibold">{k} : </dt>
                      <dd className="inline break-words whitespace-pre-line">
                        {/^https?:\/\//.test(v) ? (
                          <a href={v} target="_blank" rel="noopener noreferrer" className="font-semibold text-tomette-deep underline">
                            Ouvrir le lien
                          </a>
                        ) : (
                          v
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                {!other ? (
                  <div className="mt-3">
                    {signup ? (
                      <button type="button" onClick={() => onOpenSignup(signup.shopName)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold text-white">
                        Voir sa fiche et préparer sa roue <ArrowRight aria-hidden size={14} />
                      </button>
                    ) : (
                      <button type="button" onClick={() => toSignup(r.id)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-sauge px-4 text-sm font-semibold text-white">
                        <UserPlus aria-hidden size={14} /> Ajouter aux inscriptions
                      </button>
                    )}
                  </div>
                ) : null}
                <NotesField id={`req-${r.id}`} value={r.notes ?? ""} onSave={(notes) => follow(r.id, { notes })} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
