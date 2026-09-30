"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { admin } from "@/content";
import { fr } from "@/lib/format";
import { Logo } from "@/components/brand/Logo";

export function AdminLogin({ configured }: { configured: boolean }) {
  const t = admin.login;
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(configured ? null : t.notConfigured);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.ok) return window.location.reload();
      setError(data.error === "trop_d_essais" ? t.tooMany : data.error === "non_configure" ? t.notConfigured : t.wrong);
    } catch {
      setError(t.failed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="contenu" className="flex min-h-svh items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-paper p-7 shadow-md ring-1 ring-line">
        <Logo />
        <h1 className="mt-6 flex items-center gap-2 font-display text-2xl font-semibold">
          <Lock aria-hidden size={20} className="text-tomette" /> {t.title}
        </h1>
        <label htmlFor="mdp" className="mt-5 block text-sm font-semibold">
          {t.password}
        </label>
        <div className="relative mt-1.5">
          <input
            id="mdp"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            className="min-h-12 w-full rounded-lg bg-cream pr-12 pl-4 text-lg ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette"
          />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? t.hide : t.show} className="absolute top-1/2 right-1 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink-soft">
            {show ? <EyeOff aria-hidden size={18} /> : <Eye aria-hidden size={18} />}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {fr(error)}
          </p>
        ) : null}
        <button type="submit" disabled={loading || !password} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tomette font-semibold text-white hover:bg-tomette-deep disabled:opacity-60">
          {loading ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null} {t.submit}
        </button>
      </form>
    </main>
  );
}
