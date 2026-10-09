"use client";

import { useMemo, useState } from "react";
import { CalendarX } from "lucide-react";
import type { AdminCall } from "@/lib/admin";
import { adminFetch, ContactButtons, DoneToggle, Empty, FilterChips, NotesField, when } from "./ui";

type Filter = "venir" | "passes" | "tous";

/** Appels réservés sur /rendez-vous : à venir d'abord (le plus proche en haut), puis les appels passés. */
export function CallsTab({ calls, setCalls }: { calls: AdminCall[]; setCalls: (f: (c: AdminCall[]) => AdminCall[]) => void }) {
  const now = Date.now();
  const upcoming = useMemo(() => calls.filter((c) => new Date(c.end).getTime() >= now).sort((a, b) => a.slot.localeCompare(b.slot)), [calls, now]);
  const past = useMemo(() => calls.filter((c) => new Date(c.end).getTime() < now), [calls, now]);
  const [filter, setFilter] = useState<Filter>("venir");
  const list = filter === "venir" ? upcoming : filter === "passes" ? past : [...upcoming, ...past];

  async function follow(slot: string, body: { done?: boolean; notes?: string }) {
    setCalls((cs) => cs.map((c) => (c.slot === slot ? { ...c, ...body } : c)));
    return !!(await adminFetch("/api/admin/appels", "PATCH", { slot, ...body }))?.ok;
  }

  async function cancel(c: AdminCall) {
    if (!window.confirm(`Annuler l'appel de ${c.name}, ${c.when} ? Le créneau redevient libre. Pensez à prévenir la personne.`)) return;
    const d = await adminFetch("/api/admin/appels", "DELETE", { slot: c.slot });
    if (d?.ok) setCalls((cs) => cs.filter((x) => x.slot !== c.slot));
  }

  return (
    <section aria-label="Appels réservés">
      <FilterChips
        label="Filtrer les appels"
        value={filter}
        onChange={setFilter}
        options={[
          { id: "venir", label: "À venir", count: upcoming.length },
          { id: "passes", label: "Passés", count: past.length },
          { id: "tous", label: "Tous", count: calls.length },
        ]}
      />
      {list.length === 0 ? (
        <Empty>{filter === "venir" ? "Aucun appel à venir. Les réservations faites sur /rendez-vous apparaissent ici." : "Aucun appel."}</Empty>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((c) => {
            const isPast = new Date(c.end).getTime() < now;
            return (
              <li key={c.slot} className={`rounded-xl p-4 ring-1 sm:p-5 ${c.done ? "bg-cream ring-line" : "bg-paper ring-line"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`text-sm font-bold first-letter:uppercase ${isPast ? "text-ink-soft" : "text-tomette-deep"}`}>{c.when}</p>
                    <p className="font-display text-xl font-semibold">
                      {c.name}
                      {c.shop ? <span className="font-sans text-base font-normal text-ink-soft"> · {c.shop}</span> : null}
                    </p>
                    <p className="text-xs text-ink-soft">Réservé le {when(c.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DoneToggle done={!!c.done} label="Appel fait" onChange={(done) => follow(c.slot, { done })} />
                    {!isPast ? (
                      <button type="button" onClick={() => cancel(c)} aria-label={`Annuler l'appel de ${c.name}`} title="Annuler l'appel" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-danger">
                        <CalendarX aria-hidden size={16} />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3">
                  <ContactButtons phone={c.phone} email={c.email} whatsappText={`Bonjour ${c.name}, c'est Rouelia, pour notre appel ${c.when}.`} />
                </div>
                <NotesField id={`call-${c.slot}`} value={c.notes ?? ""} onSave={(notes) => follow(c.slot, { notes })} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
