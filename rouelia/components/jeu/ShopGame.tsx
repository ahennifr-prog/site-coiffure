"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Check, Copy, Crown, Gift, LoaderCircle, MapPin, Phone, Share2, Star, Volume2, VolumeX, X } from "lucide-react";
import { reviewPrompt } from "@/content";
import { formatDay, parisDay } from "@/lib/dates";
import { fr } from "@/lib/format";
import type { PublicShop } from "@/lib/shop-config";
import { normalizeFrenchPhone } from "@/lib/signup";
import { readableOn, segmentColors } from "@/lib/wheel";
import { Confetti, Monogram } from "@/components/demo/PhoneScreen";
import { Wheel, type WheelHandle } from "@/components/wheel/Wheel";

type Step = "accueil" | "infos" | "roue" | "gain" | "deja";

interface ClientPlay {
  code: string;
  prizeName: string;
  prizeDetail: string;
  big: boolean;
  firstName: string;
  validFrom: string;
  expiresOn: string;
  redeemedAt: string | null;
}

const consentText = (name: string) =>
  `J'accepte que ${name} enregistre mon prénom et mon numéro pour retrouver mon cadeau en caisse et limiter le jeu à une participation par personne. Ces données ne sont ni revendues ni utilisées pour de la publicité.`;
const marketingText = (name: string) => `J'accepte de recevoir des offres de ${name} par SMS. Je peux me désinscrire à tout moment. (Facultatif)`;

/** Invitation d'un ami : le lien porte le code du client. */
function Referral({ play, shop }: { play: ClientPlay; shop: PublicShop }) {
  const [done, setDone] = useState(false);
  if (!shop.referral || play.redeemedAt) return null;
  const url = `${window.location.origin}/j/${shop.slug}?parrain=${encodeURIComponent(play.code)}`;
  const text = `Je viens de gagner un cadeau chez ${shop.name}. Tente ta chance toi aussi, chaque case est gagnante :`;
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: shop.name, text, url });
      else await navigator.clipboard.writeText(`${text} ${url}`);
      setDone(true);
    } catch {
      /* partage annulé */
    }
  }
  return (
    <div className="mt-5 rounded-xl bg-paper p-4 ring-1 ring-line">
      <p className="flex gap-2 font-semibold">
        <Gift aria-hidden size={18} className="mt-0.5 shrink-0" />
        <span>Invitez un ami : s&apos;il vient retirer son cadeau, vous recevez en plus : {shop.referral}.</span>
      </p>
      <p className="mt-1 pl-6.5 text-sm text-ink-soft">Montrez votre code en caisse pour retirer ce bonus.</p>
      <button type="button" onClick={share} className="mt-3 ml-6.5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">
        {done ? <Check aria-hidden size={16} /> : <Share2 aria-hidden size={16} />} {done ? "Lien partagé" : "Inviter un ami"}
      </button>
    </div>
  );
}

function Social({ shop }: { shop: PublicShop }) {
  if (!shop.instagramUrl && !shop.facebookUrl) return null;
  return (
    <div className="mt-5 text-center">
      <p className="text-sm font-semibold">Suivez {shop.name}</p>
      <div className="mt-2 flex justify-center gap-2">
        {shop.instagramUrl ? (
          <a href={shop.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-paper px-5 text-sm font-semibold ring-1 ring-line">
            Instagram
          </a>
        ) : null}
        {shop.facebookUrl ? (
          <a href={shop.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-paper px-5 text-sm font-semibold ring-1 ring-line">
            Facebook
          </a>
        ) : null}
      </div>
    </div>
  );
}

function Ticket({ play, shop }: { play: ClientPlay; shop: PublicShop }) {
  const [copied, setCopied] = useState(false);
  const today = parisDay();
  const expired = today > play.expiresOn;
  const { primary, onPrimary } = shop.theme;
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl bg-paper shadow-lg ring-1 ring-line">
        <div className="px-5 py-4" style={{ background: primary, color: onPrimary }}>
          <p className="text-xs font-bold tracking-[0.14em] uppercase">{play.big ? "Gros cadeau" : "Votre cadeau"}</p>
          <p className="mt-1 flex items-center gap-2 font-display text-2xl leading-tight font-semibold sm:text-3xl">
            {play.big ? <Crown aria-hidden size={24} className="shrink-0" /> : null}
            {fr(play.prizeName)}
          </p>
        </div>
        <div className="px-5 pt-4 pb-5">
          {play.prizeDetail ? <p className="text-sm text-ink-soft">{fr(play.prizeDetail)}</p> : null}
          <div className={`flex items-end justify-between gap-3 ${play.prizeDetail ? "mt-4 border-t border-dashed border-line pt-4" : ""}`}>
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Code</p>
              <p className="tabular font-mono text-2xl font-bold tracking-wider sm:text-3xl">{play.code}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(play.code).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold text-white"
            >
              {copied ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
          <p className="mt-4 flex items-start gap-2 text-sm font-medium">
            <CalendarCheck aria-hidden size={18} className="mt-0.5 shrink-0 text-sauge" />
            {play.redeemedAt
              ? "Ce cadeau a déjà été utilisé. Merci de votre visite."
              : expired
                ? `Ce code a expiré le ${formatDay(play.expiresOn)}.`
                : play.validFrom > today
                  ? `À utiliser à partir du ${formatDay(play.validFrom)}, jusqu'au ${formatDay(play.expiresOn)}.`
                  : `À utiliser jusqu'au ${formatDay(play.expiresOn)}.`}
          </p>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-ink-soft">
        Montrez ce code en caisse lors de votre prochaine visite. Pensez à faire une capture d&apos;écran.
      </p>
      {shop.bookingUrl ? (
        <a
          href={shop.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex min-h-13 w-full items-center justify-center rounded-full px-6 text-base font-semibold shadow-md"
          style={{ background: primary, color: onPrimary }}
        >
          Prendre rendez-vous
        </a>
      ) : null}
      <Referral play={play} shop={shop} />
      <Social shop={shop} />
    </div>
  );
}

export function ShopGame({ shop }: { shop: PublicShop }) {
  const [step, setStep] = useState<Step>("accueil");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
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
  const storageKey = `rouelia-cadeau-${shop.slug}`;
  const { primary, onPrimary, monogram } = shop.theme;
  const open = shop.state === "ouvert";
  // La roue du moment peut changer (saison, heures creuses) : le serveur renvoie la bonne au moment de jouer.
  const [prizes, setPrizes] = useState(shop.prizes);
  const [referrer, setReferrer] = useState<string | null>(null);
  const colors = segmentColors(shop.theme.base, prizes.length);
  const segments = prizes.map((p, i) => ({ label: p.name, color: colors[i], textColor: readableOn(colors[i]), icon: p.icon }));

  function send(type: string) {
    fetch(`/api/j/${shop.slug}/evenement`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }), keepalive: true }).catch(() => {});
  }

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(`${storageKey}-visite`)) {
        sessionStorage.setItem(`${storageKey}-visite`, "1");
        send("visites");
      }
    } catch {
      send("visites");
    }
    const ref = new URLSearchParams(window.location.search).get("parrain");
    if (ref && shop.referral) setReferrer(ref.slice(0, 20));
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const p = JSON.parse(raw) as ClientPlay;
        if (p?.code && parisDay() <= p.expiresOn) setSaved(p);
      }
    } catch {
      /* stockage indisponible */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Sans lien d'avis réglé, on passe directement au jeu.
    if (!shop.reviewUrl) {
      setStep("infos");
      return;
    }
    setReviewOpen(true);
    send("avis_ouverts");
  }

  function afterReview(clicked: boolean) {
    send(clicked ? "avis_clics" : "avis_fermes");
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
      const res = await fetch(`/api/j/${shop.slug}/jouer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, phone, consent, marketing, referrer, consentText: consentText(shop.name) + (marketing ? ` ${marketingText(shop.name)}` : "") }),
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
        localStorage.setItem(storageKey, JSON.stringify(data.play));
      } catch {
        /* stockage indisponible */
      }
      if (Array.isArray(data.prizes) && data.prizes.length) setPrizes(data.prizes);
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

  const replay = shop.replayDays > 0 ? ` tous les ${shop.replayDays} jours` : "";
  const buttonStyle = { background: primary, color: onPrimary };

  return (
    <div className="relative min-h-svh overflow-clip bg-cream">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 h-[460px] w-[460px] rounded-full opacity-25 blur-[110px]" style={{ background: primary }} />
      <p className="sr-only" aria-live="assertive">
        {announce}
      </p>
      {celebrate ? <Confetti colors={[...colors.slice(0, 3), primary]} /> : null}

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-6 sm:px-8">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper ring-1 ring-line">
              {shop.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shop.logoUrl} alt="" className="h-full w-full object-contain" />
              ) : (
                <Monogram text={monogram} color={primary} className="h-full w-full" />
              )}
            </span>
            <p className="truncate font-display text-xl font-semibold">{shop.name}</p>
          </div>
          {step === "roue" || step === "gain" ? (
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              aria-pressed={sound}
              aria-label={sound ? "Couper le son" : "Activer le son"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper"
            >
              {sound ? <Volume2 aria-hidden size={20} /> : <VolumeX aria-hidden size={20} />}
            </button>
          ) : null}
        </header>

        <main className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div
            className={`relative mx-auto w-full transition-[max-width] duration-500 lg:order-2 lg:max-w-[540px] ${
              step === "accueil"
                ? "max-w-[min(76vw,42svh,440px)] sm:max-w-[min(88vw,440px)]"
                : step === "roue"
                  ? "max-w-[min(88vw,440px)]"
                  : step === "infos"
                    ? "max-w-[min(50vw,230px)]"
                    : "hidden max-w-[240px] lg:block"
            }`}
          >
            <span aria-hidden className="absolute inset-x-[8%] top-[10%] bottom-[4%] rounded-full shadow-wheel" />
            <Wheel
              ref={wheel}
              segments={segments}
              logo={shop.logoUrl}
              monogram={monogram}
              hubColor={primary}
              rimColor={shop.theme.rim}
              idle={step === "accueil" || step === "infos"}
              sound={sound}
              label={`Roue des cadeaux de ${shop.name} : ${prizes.map((p) => p.name).join(", ")}`}
              className="relative w-full"
            />
            {step === "roue" ? (
              <button type="button" onClick={spin} disabled={spinning} aria-label="Tourner la roue" tabIndex={-1} className="absolute inset-[6%] cursor-pointer rounded-full disabled:cursor-progress" />
            ) : null}
          </div>

          <div className="w-full lg:order-1">
            {step === "accueil" ? (
              <div className="pop-in text-center lg:text-left">
                <p className="text-xs font-bold tracking-[0.16em] text-ink-soft uppercase">Jeu offert par {shop.name}</p>
                <h1 className="mt-2 font-display text-[2.4rem] leading-[1.05] font-semibold sm:text-6xl">Tentez votre chance</h1>
                <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft lg:mx-0">
                  Chaque case de la roue est un cadeau, à utiliser lors de votre prochaine visite.
                </p>
                {referrer ? <p className="mx-auto mt-3 max-w-md font-semibold lg:mx-0">Un ami vous a invité : à vous de jouer.</p> : null}
                {!open ? (
                  <p role="status" className="mx-auto mt-6 max-w-sm rounded-xl bg-paper p-4 font-medium ring-1 ring-line lg:mx-0">
                    Le jeu est en pause pour le moment. Revenez très bientôt.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={start}
                    className="mt-6 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full px-8 text-lg font-semibold shadow-lg transition-transform active:scale-[0.98]"
                    style={buttonStyle}
                  >
                    Jouer
                  </button>
                )}
                {saved ? (
                  <button
                    type="button"
                    onClick={() => {
                      setResult({ play: saved, prizeIndex: 0 });
                      setStep("deja");
                    }}
                    className="mt-3 block min-h-11 w-full text-sm font-semibold underline underline-offset-4 lg:w-auto"
                  >
                    Retrouver mon cadeau
                  </button>
                ) : null}
                <p className="mt-6 text-xs text-ink-soft">
                  Jeu gratuit, sans obligation d&apos;achat. Une participation par personne{replay}.{" "}
                  <Link href={`/j/${shop.slug}/reglement`} className="underline underline-offset-2">
                    Règlement et données
                  </Link>
                </p>
              </div>
            ) : null}

            {step === "infos" ? (
              <form noValidate onSubmit={submit} className="pop-in mx-auto max-w-md rounded-xl bg-paper p-5 shadow-md ring-1 ring-line sm:p-7 lg:mx-0">
                <h1 className="font-display text-3xl font-semibold">Une dernière chose</h1>
                <p className="mt-2 text-ink-soft">Pour retrouver votre cadeau en caisse, il suffit de votre prénom et de votre numéro.</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-semibold">Prénom</label>
                    <input
                      ref={firstFieldRef}
                      id="prenom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      maxLength={40}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "prenom-err" : undefined}
                      className="mt-1.5 min-h-13 w-full rounded-lg bg-cream px-4 text-lg ring-1 ring-line outline-none focus:ring-2 focus:ring-ink aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger"
                    />
                    {errors.firstName ? <p id="prenom-err" className="mt-1 text-sm font-medium text-danger">{errors.firstName}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="tel" className="block text-sm font-semibold">Téléphone</label>
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
                      className="mt-1.5 min-h-13 w-full rounded-lg bg-cream px-4 text-lg ring-1 ring-line outline-none focus:ring-2 focus:ring-ink aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger"
                    />
                    {errors.phone ? <p id="tel-err" className="mt-1 text-sm font-medium text-danger">{errors.phone}</p> : null}
                  </div>
                  <div>
                    <label className="flex cursor-pointer gap-3 text-sm text-ink-soft">
                      <input
                        id="accord"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        aria-invalid={!!errors.consent}
                        aria-describedby={errors.consent ? "accord-err" : undefined}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
                      />
                      <span>{consentText(shop.name)}</span>
                    </label>
                    {errors.consent ? <p id="accord-err" className="mt-1 text-sm font-medium text-danger">{errors.consent}</p> : null}
                  </div>
                  <label className="flex cursor-pointer gap-3 text-sm text-ink-soft">
                    <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
                    <span>{marketingText(shop.name)}</span>
                  </label>
                </div>
                {serverError ? (
                  <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-semibold text-danger">{serverError}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-lg font-semibold shadow-md disabled:opacity-80"
                  style={buttonStyle}
                >
                  {loading ? <LoaderCircle aria-hidden size={20} className="animate-spin" /> : null}
                  {loading ? "Un instant" : "Accéder à la roue"}
                </button>
              </form>
            ) : null}

            {step === "roue" ? (
              <div className="pop-in text-center lg:text-left">
                <h1 className="font-display text-3xl font-semibold sm:text-5xl">À vous, {firstName.trim()}</h1>
                <p className="mt-2 text-ink-soft">Touchez la roue ou le bouton. Chaque case est gagnante.</p>
                <button
                  ref={spinRef}
                  type="button"
                  onClick={spin}
                  disabled={spinning}
                  className="mt-6 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full px-8 text-lg font-semibold shadow-lg transition-transform active:scale-[0.98] disabled:opacity-80"
                  style={buttonStyle}
                >
                  {spinning ? "La roue tourne" : "Tourner la roue"}
                </button>
              </div>
            ) : null}

            {(step === "gain" || step === "deja") && result ? (
              <div className="pop-in mx-auto max-w-md lg:mx-0">
                <h1 ref={headingRef} tabIndex={-1} className="text-center font-display text-4xl font-semibold outline-none sm:text-5xl lg:text-left">
                  {step === "gain" ? `Bravo ${result.play.firstName}` : "Vous avez déjà joué"}
                </h1>
                <p className="mt-2 mb-5 text-center text-ink-soft lg:text-left">
                  {step === "gain" ? "Voici votre cadeau." : `Une participation par personne${replay}. Voici le cadeau que vous avez gagné.`}
                </p>
                <Ticket play={result.play} shop={shop} />
              </div>
            ) : null}
          </div>
        </main>

        <footer className="mt-auto flex flex-col items-center gap-1 border-t border-line pt-4 text-center text-xs text-ink-soft sm:flex-row sm:flex-wrap sm:justify-between sm:text-left">
          {shop.address ? (
            <p className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden size={14} /> {shop.address}
            </p>
          ) : null}
          {shop.phone ? (
            <a href={`tel:${shop.phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center gap-1.5">
              <Phone aria-hidden size={14} /> {shop.phone}
            </a>
          ) : null}
          {shop.poweredBy ? (
            <a href="/" className="inline-flex min-h-11 items-center font-semibold">
              Propulsé par Rouelia
            </a>
          ) : null}
        </footer>
      </div>

      {/* Invitation à l'avis : facultative, se ferme d'un geste, la roue reste accessible dans tous les cas. */}
      {reviewOpen ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-3 sm:items-center" onClick={(e) => e.target === e.currentTarget && afterReview(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="avis-texte"
            onKeyDown={(e) => e.key === "Escape" && afterReview(false)}
            className="pop-in relative w-full max-w-md rounded-xl bg-paper p-6 pt-7 shadow-2xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => afterReview(false)}
              aria-label={reviewPrompt.close}
              className="absolute top-1.5 right-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                <X aria-hidden size={18} strokeWidth={3} />
              </span>
            </button>
            <div aria-hidden className="flex gap-0.5 text-safran">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p id="avis-texte" className="mt-3 pr-8 text-lg font-semibold">
              {fr(reviewPrompt.text)}
            </p>
            <a
              href={shop.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => afterReview(true)}
              className="mt-5 flex min-h-13 w-full items-center justify-center rounded-full bg-ink px-6 font-semibold text-white"
            >
              {reviewPrompt.button}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
