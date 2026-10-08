import type { ReactNode } from "react";
import { fr } from "@/lib/format";

export const inputClass =
  "min-h-13 w-full rounded-lg bg-paper px-4 text-base ring-1 ring-line outline-none focus:ring-2 focus:ring-ink aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger";

/** Champ de formulaire : libellé, aide, erreur reliée au champ (aria-describedby posé par l'appelant). */
export function Field({ id, label, required, help, error, children }: { id: string; label: string; required?: boolean; help?: string; error?: string | null; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {required ? (
          <span aria-hidden className="text-tomette-deep">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-sm font-medium text-danger">
          {fr(error)}
        </p>
      ) : help ? (
        <p id={`${id}-help`} className="mt-1 text-xs text-ink-soft">
          {fr(help)}
        </p>
      ) : null}
    </div>
  );
}

export const describedBy = (id: string, error?: string | null, help?: string) => (error ? `${id}-err` : help ? `${id}-help` : undefined);

/** Champ piège invisible : seuls les robots le remplissent. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="site-web">Site web</label>
      <input id="site-web" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
