"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { brand } from "@/content";
import { Logo } from "@/components/brand/Logo";
import { input } from "./api";

const MIN = 8;

/** Le lien d'invitation porte le jeton après « # » : il n'apparaît dans aucun journal de serveur. */
export function Invitation() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToken(window.location.hash.slice(1));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < MIN) {
      setError(`Choisissez au moins ${MIN} caractères.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/espace/activation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      if (res.ok) {
        window.location.href = "/espace#roue";
        return;
      }
      setError(res.status === 410 ? "Ce lien n'est plus valable (il a déjà servi ou a expiré)." : "L'enregistrement a échoué. Réessayez.");
    } catch {
      setError("La connexion a échoué. Vérifiez le réseau et réessayez.");
    }
    setBusy(false);
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-5 py-10">
      <form onSubmit={submit} noValidate className="w-full max-w-sm rounded-xl bg-paper p-6 shadow-md ring-1 ring-line sm:p-8">
        <Logo />
        <h1 className="mt-6 font-display text-3xl font-semibold">Bienvenue</h1>
        <p className="mt-1 text-ink-soft">Choisissez votre mot de passe. Vous vous connecterez ensuite avec votre e-mail et ce mot de passe.</p>
        {token === "" ? (
          <p role="alert" className="mt-5 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">
            Ce lien est incomplet. Ouvrez le lien reçu en entier, ou écrivez à {brand.email}.
          </p>
        ) : null}
        <label htmlFor="mdp" className="mt-6 block text-sm font-semibold">Mot de passe</label>
        <div className="relative mt-1.5">
          <input id="mdp" type={show ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="mdp-aide" className={`${input} pr-12`} />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute top-0.5 right-0.5 inline-flex h-11 w-11 items-center justify-center text-ink-soft">
            {show ? <EyeOff aria-hidden size={18} /> : <Eye aria-hidden size={18} />}
          </button>
        </div>
        <p id="mdp-aide" className="mt-1 text-xs text-ink-soft">Au moins {MIN} caractères.</p>
        {error ? <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p> : null}
        <button type="submit" disabled={busy || !token} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tomette font-semibold text-white hover:bg-tomette-deep disabled:opacity-60">
          {busy ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null} Accéder à mon espace
        </button>
      </form>
    </main>
  );
}
