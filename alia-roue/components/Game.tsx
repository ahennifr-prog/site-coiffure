"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarCheck, Check, Copy, Crown, LoaderCircle, MapPin, Phone, Star, Volume2, VolumeX, X } from "lucide-react";
import type { PublicConfig } from "@/lib/config";
import { SALON } from "@/lib/config";
import { formatDay, parisDay } from "@/lib/dates";
import { normalizeFrenchPhone } from "@/lib/phone";
import { readableOn, segmentColors } from "@/lib/wheel";
import { Logo } from "@/components/Logo";
import { Wheel, type WheelHandle } from "@/components/wheel/Wheel";

type Step = "accueil" | "infos" | "roue" | "gain" | "deja";

interface ClientPlay {
  code: string;
  prizeName: string;
  prizeDetail: string;
  tier: "petit" | "gros";
  firstName: string;
  validFrom: string;
  expiresOn: string;
  redeemedAt: string | null;
}

const PALETTE = ["#E2336B", "#ECEEF1", "#A98BFF", "#1B1B1F", "#F6B8CC", "#C9CDD3"];
const STORAGE = "alia-cadeau";
const CONSENT =
  "J'accepte qu'ALIA coiffure enregistre mon prénom et mon numéro pour retrouver mon cadeau en caisse et limiter le jeu à une participation par personne. Ces données ne sont ni revendues ni utilisées pour de la publicité.";

function send(type: string) {
  fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }), keepalive: true }).catch(() => {});
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: Math.random() * 100,
        dx: `${(Math.random() - 0.5) * 220}px`,
        rot: `${(Math.random() - 0.5) * 900}deg`,
        delay: Math.random() * 500,
        dur: 2200 + Math.random() * 1600,
        color: ["#E2336B", "#A98BFF", "#F6B8CC", "#FFFFFF", "#C9CDD3"][i % 5],
        w: 6 + Math.random() * 6,
        round: i % 4 === 0,
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${b.left}%`,
            width: b.w,
            height: b.round ? b.w : b.w * 1.7,
            borderRadius: b.round ? 999 : 2,
            background: b.color,
            ["--dx" as string]: b.dx,
            ["--rot" as string]: b.rot,
            animation: `confetti-fall ${b.dur}ms cubic-bezier(.2,.6,.4,1) ${b.delay}ms both`,
          }}
        />
      ))}
    </div>
  );
}

function Ticket({ play, bookingUrl }: { play: ClientPlay; bookingUrl: string }) {
  const [copied, setCopied] = useState(false);
  const today = parisDay();
  const expired = today > play.expiresOn;
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl bg-blanc text-noir shadow-[0_30px_60px_-20px_rgb(226_51_107/0.55)]">
        <div className="bg-[linear-gradient(120deg,#E2336B,#A98BFF)] px-5 py-4 text-white">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase">{play.tier === "gros" ? "Gros cadeau" : "Votre cadeau"}</p>
          <p className="mt-1 flex items-center gap-2 font-display text-2xl leading-tight sm:text-3xl">
            {play.tier === "gros" ? <Crown aria-hidden size={24} className="shrink-0" /> : null}
            {play.prizeName}
          </p>
        </div>
        <div className="px-5 pt-4 pb-5">
          {play.prizeDetail ? <p className="text-sm text-[#3a3b40]">{play.prizeDetail}</p> : null}
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-[#c9cdd3] pt-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-[#55585e] uppercase">Code</p>
              <p className="tabular font-mono text-2xl font-medium tracking-wider sm:text-3xl">{play.code}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(play.code).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-noir px-4 text-sm font-semibold text-white"
            >
              {copied ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
          <p className="mt-4 flex items-start gap-2 text-sm font-medium">
            <CalendarCheck aria-hidden size={18} className="mt-0.5 shrink-0 text-framboise-fonce" />
            {play.redeemedAt
              ? "Ce cadeau a déjà été utilisé. Merci de votre visite."
              : expired
                ? `Ce code a expiré le ${formatDay(play.expiresOn)}.`
                : play.validFrom > today
                  ? `À utiliser à partir du ${formatDay(play.validFrom)}, jusqu'au ${formatDay(play.expiresOn)}.`
                  : `À utiliser jusqu'au ${formatDay(play.expiresOn)}.`}
          </p>
        </div>
        {/* Encoches de ticket */}
        <span aria-hidden className="absolute top-[88px] -left-3 h-6 w-6 rounded-full bg-noir" />
        <span aria-hidden className="absolute top-[88px] -right-3 h-6 w-6 rounded-full bg-noir" />
      </div>
      <p className="mt-4 text-center text-sm text-argent">
        Présentez ce code en caisse lors de votre prochaine visite. Pensez à faire une capture d&apos;écran.
      </p>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-framboise px-6 text-base font-semibold text-white transition-colors hover:bg-framboise-fonce"
      >
        Prendre rendez-vous
      </a>
    </div>
  );
}

export function Game({ config }: { config: PublicConfig }) {
  const [step, setStep] = useState<Step>("accueil");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<{ play: ClientPlay; prizeIndex: number } | null>(null);
  const [saved, setSaved] = useState<ClientPlay | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [sound, setSound] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [announce, setAnnounce] = useState("");
  const wheel = useRef<WheelHandle>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const spinRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const colors = segmentColors(PALETTE, config.prizes.length);
  const segments = config.prizes.map((p, i) => ({
    label: p.name,
    color: colors[i],
    textColor: readableOn(colors[i]) === "#FFFFFF" ? "#FFFFFF" : "#0D0D0D",
    icon: p.tier === "gros" ? ("couronne" as const) : p.icon,
  }));

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("alia-visite")) {
        sessionStorage.setItem("alia-visite", "1");
        send("visite");
      }
    } catch {
      send("visite");
    }
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const p = JSON.parse(raw) as ClientPlay;
        if (p?.code && parisDay() <= p.expiresOn) setSaved(p);
      }
    } catch {
      /* stockage indisponible */
    }
  }, []);

  useEffect(() => {
    if (reviewOpen) closeRef.current?.focus();
  }, [reviewOpen]);

  useEffect(() => {
    if (step === "infos") firstFieldRef.current?.focus({ preventScroll: true });
    if (step === "roue") spinRef.current?.focus({ preventScroll: true });
    if (step === "gain" || step === "deja") headingRef.current?.focus({ preventScroll: true });
    if (step !== "accueil") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function start() {
    setReviewOpen(true);
    send("avis_ouvert");
  }

  function afterReview(clicked: boolean) {
    send(clicked ? "avis_clic" : "avis_ferme");
    setReviewOpen(false);
    setStep("infos");
  }

  const phoneOk = !!normalizeFrenchPhone(phone);
  const errors = tried
    ? {
        firstName: firstName.trim() ? null : "Indiquez votre prénom.",
        phone: phone.trim() ? (phoneOk ? null : "Ce numéro ne semble pas complet. Exemple : 06 12 34 56 78.") : "Indiquez votre numéro de téléphone.",
        consent: consent ? null : "Cochez la case pour participer.",
      }
    : { firstName: null, phone: null, consent: null };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    setServerError(null);
    if (!firstName.trim() || !phoneOk || !consent) {
      const id = !firstName.trim() ? "prenom" : !phoneOk ? "tel" : "accord";
      document.getElementById(id)?.focus();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, phone, consent, consentText: CONSENT }),
      });
      const data = await res.json();
      if (!data.ok) {
        setServerError(
          data.error === "inactive"
            ? "Le jeu est en pause pour le moment. Revenez bientôt."
            : data.error === "rate"
              ? "Trop de parties depuis cette connexion. Réessayez dans un moment."
              : "Vérifiez vos informations et réessayez.",
        );
        return;
      }
      try {
        localStorage.setItem(STORAGE, JSON.stringify(data.play));
      } catch {
        /* stockage indisponible */
      }
      setResult({ play: data.play, prizeIndex: data.prizeIndex });
      setStep(data.already ? "deja" : "roue");
    } catch {
      setServerError("La connexion a échoué. Vérifiez le réseau et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function spin() {
    if (!result || spinning || !wheel.current) return;
    setSpinning(true);
    setAnnounce("La roue tourne.");
    await wheel.current.spin(result.prizeIndex);
    setSpinning(false);
    setCelebrate(true);
    navigator.vibrate?.([30, 60, 30]);
    setAnnounce(`Vous avez gagné : ${result.play.prizeName}.`);
    setTimeout(() => setStep("gain"), 650);
    setTimeout(() => setCelebrate(false), 4500);
  }

  const wheelBig = step === "accueil" || step === "roue";

  return (
    <div className="relative min-h-svh overflow-clip">
      {/* Halos de couleur */}
      <div aria-hidden className="glow pointer-events-none absolute -top-40 -left-32 h-[480px] w-[480px] rounded-full bg-framboise/35 blur-[120px]" />
      <div aria-hidden className="glow pointer-events-none absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-lilas/30 blur-[130px] [animation-delay:-2.5s]" />

      <p className="sr-only" aria-live="assertive">
        {announce}
      </p>
      {celebrate ? <Confetti /> : null}

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-24 sm:px-8 sm:pb-8">
        <header className="flex items-center justify-between">
          <Logo size="sm" />
          {step === "roue" || step === "gain" ? (
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              aria-pressed={sound}
              aria-label={sound ? "Couper le son" : "Activer le son"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-argent hover:bg-white/5"
            >
              {sound ? <Volume2 aria-hidden size={20} /> : <VolumeX aria-hidden size={20} />}
            </button>
          ) : (
            <span className="font-mono text-[11px] tracking-[0.16em] text-gris uppercase">Champigny</span>
          )}
        </header>

        <main className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* Roue : au-dessus sur téléphone, à droite sur ordinateur */}
          <div
            className={`relative mx-auto w-full transition-[max-width] duration-500 ease-(--ease-out) lg:order-2 lg:max-w-[560px] ${
              step === "accueil"
                ? "max-w-[min(72vw,40svh,440px)] sm:max-w-[min(88vw,440px)]"
                : wheelBig
                  ? "max-w-[min(88vw,440px)]"
                  : step === "infos" ? "max-w-[min(52vw,240px)]" : "hidden max-w-[240px] lg:block"
            }`}
          >
            <div aria-hidden className="absolute inset-[8%] rounded-full bg-framboise/40 blur-3xl" />
            <Wheel
              ref={wheel}
              segments={segments}
              rimColor="#26272C"
              hubColor="#0D0D0D"
              monogram="A"
              pointerColor="#ECEEF1"
              pointerDot="#E2336B"
              bulbColors={["#FFFFFF", "#F6B8CC"]}
              idle={step === "accueil" || step === "infos"}
              sound={sound}
              label={`Roue des cadeaux ALIA coiffure : ${config.prizes.map((p) => p.name).join(", ")}`}
              className="relative w-full drop-shadow-[0_30px_50px_rgb(0_0_0/0.6)]"
            />
            {step === "roue" ? (
              <button
                type="button"
                onClick={spin}
                disabled={spinning}
                aria-label="Tourner la roue"
                tabIndex={-1}
                className="absolute inset-[6%] cursor-pointer rounded-full disabled:cursor-progress"
              />
            ) : null}
          </div>

          <div className="w-full lg:order-1">
            {step === "accueil" ? (
              <div className="rise text-center lg:text-left">
                <p className="font-mono text-xs tracking-[0.2em] text-rose uppercase">Jeu offert par le salon</p>
                <h1 className="mt-2 font-display text-[2.35rem] leading-[1.05] sm:mt-3 sm:text-6xl">
                  Tentez votre <em className="chrome-text pr-1">chance</em>
                </h1>
                <p className="mx-auto mt-4 max-w-md text-lg text-argent lg:mx-0">
                  Chaque case de la roue est un cadeau, à utiliser lors de votre prochaine visite.
                </p>
                {!config.active ? (
                  <p className="mx-auto mt-7 max-w-sm rounded-xl bg-anthracite p-4 text-argent ring-1 ring-trait lg:mx-0">
                    Le jeu est en pause pour le moment. Revenez très bientôt.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={start}
                  hidden={!config.active}
                  className="pulse-ring mt-5 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full bg-framboise px-8 text-lg font-semibold text-white transition-transform hover:bg-framboise-fonce active:scale-[0.98]"
                >
                  Jouer
                </button>
                {saved ? (
                  <button
                    type="button"
                    onClick={() => {
                      setResult({ play: saved, prizeIndex: 0 });
                      setStep("deja");
                    }}
                    className="mt-3 block min-h-11 w-full text-sm font-semibold text-rose underline underline-offset-4 lg:w-auto"
                  >
                    Retrouver mon cadeau
                  </button>
                ) : null}
                <p className="mt-6 text-xs text-gris">
                  Jeu gratuit, sans obligation d&apos;achat. Une participation par personne
                  {config.replayDays > 0 ? ` tous les ${config.replayDays} jours` : ""}.{" "}
                  <Link href="/reglement" className="underline underline-offset-2">
                    Règlement et données
                  </Link>
                </p>
              </div>
            ) : null}

            {step === "infos" ? (
              <form noValidate onSubmit={submit} className="rise mx-auto max-w-md rounded-xl bg-anthracite/90 p-5 ring-1 ring-trait backdrop-blur sm:p-7 lg:mx-0">
                <h1 className="font-display text-3xl">Une dernière chose</h1>
                <p className="mt-2 text-argent">Pour retrouver votre cadeau en caisse, on a juste besoin de votre prénom et de votre numéro.</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-semibold">
                      Prénom
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="prenom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      maxLength={40}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "prenom-err" : undefined}
                      className="mt-1.5 min-h-13 w-full rounded-lg bg-noir px-4 text-lg ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose aria-[invalid=true]:ring-alerte"
                    />
                    {errors.firstName ? <p id="prenom-err" className="mt-1 text-sm text-alerte">{errors.firstName}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="tel" className="block text-sm font-semibold">
                      Téléphone
                    </label>
                    <input
                      id="tel"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      placeholder="06 12 34 56 78"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "tel-err" : undefined}
                      className="mt-1.5 min-h-13 w-full rounded-lg bg-noir px-4 text-lg ring-1 ring-trait outline-none placeholder:text-gris/70 focus:ring-2 focus:ring-rose aria-[invalid=true]:ring-alerte"
                    />
                    {errors.phone ? <p id="tel-err" className="mt-1 text-sm text-alerte">{errors.phone}</p> : null}
                  </div>
                  <div>
                    <label className="flex cursor-pointer gap-3 text-sm text-argent">
                      <input
                        id="accord"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        aria-invalid={!!errors.consent}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-framboise"
                      />
                      <span>{CONSENT}</span>
                    </label>
                    {errors.consent ? <p className="mt-1 text-sm text-alerte">{errors.consent}</p> : null}
                  </div>
                </div>
                {serverError ? (
                  <p role="alert" className="mt-4 rounded-lg bg-alerte/10 p-3 text-sm font-semibold text-alerte">
                    {serverError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-framboise px-6 text-lg font-semibold text-white hover:bg-framboise-fonce disabled:opacity-80"
                >
                  {loading ? <LoaderCircle aria-hidden size={20} className="animate-spin" /> : null}
                  {loading ? "Un instant" : "Accéder à la roue"}
                </button>
              </form>
            ) : null}

            {step === "roue" ? (
              <div className="rise text-center lg:text-left">
                <h1 className="font-display text-3xl sm:text-5xl">
                  À vous, <span className="font-script text-[1.2em] text-rose">{firstName.trim()}</span>
                </h1>
                <p className="mt-2 text-argent">Touchez la roue ou le bouton. Chaque case est gagnante.</p>
                <button
                  ref={spinRef}
                  type="button"
                  onClick={spin}
                  disabled={spinning}
                  className={`mt-6 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full bg-framboise px-8 text-lg font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-80 ${spinning ? "" : "pulse-ring"}`}
                >
                  {spinning ? "La roue tourne…" : "Tourner la roue"}
                </button>
              </div>
            ) : null}

            {(step === "gain" || step === "deja") && result ? (
              <div className="pop-in mx-auto max-w-md lg:mx-0">
                <h1 ref={headingRef} tabIndex={-1} className="text-center font-display text-4xl outline-none sm:text-5xl lg:text-left">
                  {step === "gain" ? (
                    <>
                      Bravo <span className="font-script text-[1.15em] text-rose">{result.play.firstName}</span>
                    </>
                  ) : (
                    "Vous avez déjà joué"
                  )}
                </h1>
                <p className="mt-2 mb-5 text-center text-argent lg:text-left">
                  {step === "gain"
                    ? "Voici votre cadeau."
                    : `Une participation par personne${config.replayDays > 0 ? ` tous les ${config.replayDays} jours` : ""}. Voici le cadeau que vous avez gagné.`}
                </p>
                <Ticket play={result.play} bookingUrl={config.bookingUrl} />
              </div>
            ) : null}
          </div>
        </main>

        <footer className="mt-auto flex flex-col items-center gap-1 border-t border-trait pt-5 text-center text-xs text-gris sm:flex-row sm:justify-between sm:text-left">
          <p className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden size={14} /> {SALON.address}
          </p>
          <a href={SALON.phoneHref} className="inline-flex min-h-11 items-center gap-1.5 hover:text-blanc">
            <Phone aria-hidden size={14} /> {SALON.phone} · {SALON.hours}
          </a>
        </footer>
      </div>

      {/* Invitation à l'avis : facultative, se ferme d'un geste, la roue reste accessible dans tous les cas. */}
      {reviewOpen ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center" onClick={(e) => e.target === e.currentTarget && afterReview(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="avis-texte"
            onKeyDown={(e) => e.key === "Escape" && afterReview(false)}
            className="pop-in relative w-full max-w-md rounded-xl bg-blanc p-6 pt-7 text-noir shadow-2xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => afterReview(false)}
              aria-label="Fermer"
              className="absolute top-1.5 right-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-noir text-white">
                <X aria-hidden size={18} strokeWidth={3} />
              </span>
            </button>
            <div aria-hidden className="flex gap-0.5 text-framboise">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p id="avis-texte" className="mt-3 pr-8 text-lg font-semibold">
              Votre avis compte beaucoup pour nous. Souhaitez-vous laisser un avis Google ?
            </p>
            <a
              href={config.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => afterReview(true)}
              className="mt-5 flex min-h-13 w-full items-center justify-center rounded-full bg-noir px-6 font-semibold text-white"
            >
              Laisser un avis
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
