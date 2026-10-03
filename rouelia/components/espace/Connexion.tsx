"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { brand } from "@/content";
import { Logo } from "@/components/brand/Logo";
import { input } from "./api";

export function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgot, setForgot] = useState<"no" | "form" | "sent">("no");

  async function sendReset() {
    if (!email.trim()) {
      setError("Indiquez votre e-mail ci-dessus, puis touchez à nouveau « Mot de passe oublié ».");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/espace/oubli", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.status === 429) setError("Trop de demandes. Patientez une heure ou écrivez-nous.");
      else setForgot("sent");
    } catch {
      setError("La connexion a échoué. Vérifiez le réseau et réessayez.");
    }
    setBusy(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/espace/connexion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (res.ok) {
        window.location.href = "/espace";
        return;
      }
      setError(res.status === 429 ? "Trop d'essais. Patientez une heure ou écrivez-nous." : "E-mail ou mot de passe incorrect.");
    } catch {
      setError("La connexion a échoué. Vérifiez le réseau et réessayez.");
    }
    setBusy(false);
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-paper p-6 shadow-md ring-1 ring-line sm:p-8">
        <Logo />
        <h1 className="mt-6 font-display text-3xl font-semibold">Votre espace</h1>
        <p className="mt-1 text-sm text-ink-soft">Caisse, suivi et réglages de votre roue.</p>
        <label htmlFor="email" className="mt-6 block text-sm font-semibold">E-mail</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-1.5`} />
        <label htmlFor="mdp" className="mt-4 block text-sm font-semibold">Mot de passe</label>
        <div className="relative mt-1.5">
          <input id="mdp" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} pr-12`} />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute top-0.5 right-0.5 inline-flex h-11 w-11 items-center justify-center text-ink-soft">
            {show ? <EyeOff aria-hidden size={18} /> : <Eye aria-hidden size={18} />}
          </button>
        </div>
        {error ? <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p> : null}
        <button type="submit" disabled={busy} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tomette font-semibold text-white hover:bg-tomette-deep disabled:opacity-70">
          {busy ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null} Se connecter
        </button>
        {forgot === "sent" ? (
          <p role="status" className="mt-5 rounded-lg bg-sauge-soft p-3 text-sm font-semibold text-sauge">
            Si un compte existe pour cette adresse, un lien pour choisir un nouveau mot de passe vient de lui être envoyé.
          </p>
        ) : (
          <button type="button" onClick={sendReset} disabled={busy} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
            Mot de passe oublié
          </button>
        )}
        <p className="mt-2 text-sm text-ink-soft">
          Un souci ? Écrivez à <a href={`mailto:${brand.email}`} className="font-semibold underline underline-offset-2">{brand.email}</a>.
        </p>
      </form>
    </main>
  );
}
