"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Login({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.ok) return window.location.reload();
      setError(
        data.error === "trop_d_essais"
          ? "Trop d'essais. Patientez 15 minutes."
          : data.error === "non_configure"
            ? "Le mot de passe n'est pas encore réglé sur l'hébergement (variable ADMIN_PASSWORD)."
            : "Mot de passe incorrect.",
      );
    } catch {
      setError("La connexion a échoué. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-anthracite p-7 ring-1 ring-trait">
        <Logo className="mx-auto block" />
        <h1 className="mt-6 flex items-center gap-2 font-display text-2xl">
          <Lock aria-hidden size={20} className="text-rose" /> Espace gestion
        </h1>
        {!configured ? (
          <p className="mt-3 rounded-lg bg-alerte/10 p-3 text-sm text-alerte">
            Le mot de passe n&apos;est pas encore réglé. Ajoutez la variable ADMIN_PASSWORD dans Vercel, puis redéployez.
          </p>
        ) : null}
        <label htmlFor="mdp" className="mt-5 block text-sm font-semibold">
          Mot de passe
        </label>
        <div className="relative mt-1.5">
          <input
            id="mdp"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            className="min-h-13 w-full rounded-lg bg-noir pr-12 pl-4 text-lg ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose"
          />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute top-1/2 right-1 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gris">
            {show ? <EyeOff aria-hidden size={18} /> : <Eye aria-hidden size={18} />}
          </button>
        </div>
        {error ? <p role="alert" className="mt-3 text-sm font-medium text-alerte">{error}</p> : null}
        <button type="submit" disabled={loading || !password} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-framboise font-semibold text-white disabled:opacity-60">
          {loading ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null} Se connecter
        </button>
      </form>
    </main>
  );
}
