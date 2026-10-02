"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Info, RotateCcw, Settings2, Star, Volume2, VolumeX, X } from "lucide-react";
import { demo as demoText, reviewPrompt, winScreen } from "@/content";
import { formatDate, fr } from "@/lib/format";
import { deadlineFrom, generateCode, pickWeighted, readableOn } from "@/lib/wheel";
import { Wheel, type WheelHandle } from "@/components/wheel/Wheel";
import { prizeIcons } from "@/components/wheel/icons";
import { useAppState } from "@/components/AppState";

type Phase = "review" | "ready" | "spinning" | "won";

export interface PhoneScreenProps {
  mode: "preview" | "test";
  onStartTest?: () => void;
  onExitTest?: () => void;
  compact?: boolean;
}

/** Visuel généré quand le commerçant n'a pas de logo : initiales sur la couleur principale. */
export function Monogram({ text, color, className = "" }: { text: string; color: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white ${className}`}
      style={{ background: color }}
    >
      {text}
    </span>
  );
}

export function Confetti({ colors }: { colors: string[] }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: Math.random() * 100,
        dx: `${(Math.random() - 0.5) * 120}px`,
        rot: `${(Math.random() - 0.5) * 720}deg`,
        delay: Math.random() * 250,
        dur: 1400 + Math.random() * 900,
        color: colors[i % colors.length],
        w: 6 + Math.random() * 5,
        round: i % 3 === 0,
      })),
    [colors],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${b.left}%`,
            width: b.w,
            height: b.round ? b.w : b.w * 1.6,
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

export function PhoneScreen({ mode, onStartTest, onExitTest, compact = false }: PhoneScreenProps) {
  const app = useAppState();
  const { demo, colors, segmentTextColors, primary, displayName, monogram } = app;
  const wheel = useRef<WheelHandle>(null);
  const [phase, setPhase] = useState<Phase>(mode === "test" ? "review" : "ready");
  const [reviewNotice, setReviewNotice] = useState(false);
  const [sound, setSound] = useState(false);
  const [win, setWin] = useState<{ index: number; name: string; code: string; deadline: Date } | null>(null);
  const [announce, setAnnounce] = useState("");
  const closeBtn = useRef<HTMLButtonElement>(null);
  const winTitle = useRef<HTMLHeadingElement>(null);
  const spinBtn = useRef<HTMLButtonElement>(null);
  const wasReview = useRef(false);

  useEffect(() => {
    setPhase(mode === "test" ? "review" : "ready");
    setWin(null);
    setReviewNotice(false);
  }, [mode]);

  useEffect(() => {
    if (phase === "review") closeBtn.current?.focus({ preventScroll: true });
    if (phase === "won") winTitle.current?.focus({ preventScroll: true });
    // Après la fenêtre d'avis, le focus va directement au bouton de la roue.
    if (phase === "ready" && wasReview.current) spinBtn.current?.focus({ preventScroll: true });
    wasReview.current = phase === "review";
  }, [phase]);

  const segments = demo.prizes.map((p, i) => ({
    label: p.name || demoText.prizes.newPrizeName,
    color: colors[i],
    textColor: segmentTextColors[i],
    icon: p.icon,
    image: p.image,
  }));

  async function spin() {
    if (mode !== "test") return onStartTest?.();
    if (phase !== "ready" || !wheel.current) return;
    setPhase("spinning");
    setReviewNotice(false);
    setAnnounce(demoText.preview.spinning);
    const index = pickWeighted(demo.prizes);
    await wheel.current.spin(index);
    const prize = demo.prizes[index];
    const w = {
      index,
      name: prize?.name || demoText.prizes.newPrizeName,
      code: generateCode(winScreen.codePrefix),
      deadline: deadlineFrom(new Date(), winScreen.validityDays),
    };
    setWin(w);
    setPhase("won");
    setAnnounce(winScreen.announce(w.name));
  }

  function replay() {
    setWin(null);
    setReviewNotice(false);
    setPhase("review");
  }

  const wonPrize = win ? demo.prizes[win.index] : null;
  const WonIcon = wonPrize?.icon ? prizeIcons[wonPrize.icon]?.Icon : undefined;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-cream text-ink">
      <p className="sr-only" aria-live="assertive">
        {announce}
      </p>

      {/* En-tête du commerce */}
      <div className={`flex items-center gap-2.5 ${compact ? "px-4 pt-3" : "px-5 pt-5"}`}>
        {demo.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={demo.logo} alt="" className={`${compact ? "h-8 w-8" : "h-10 w-10"} shrink-0 rounded-full bg-white object-contain ring-1 ring-line`} />
        ) : (
          <Monogram text={monogram} color={primary} className={compact ? "h-8 w-8 text-sm" : "h-10 w-10 text-base"} />
        )}
        <div className="min-w-0">
          <p className={`truncate font-display font-semibold ${compact ? "text-base" : "text-lg"}`}>{displayName}</p>
          {!compact ? <p className="text-xs text-ink-soft">{fr(demoText.preview.tagline)}</p> : null}
        </div>
        {mode === "test" ? (
          <button
            type="button"
            onClick={() => setSound((s) => !s)}
            aria-pressed={sound}
            aria-label={sound ? demoText.preview.sound.on : demoText.preview.sound.off}
            className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-paper"
          >
            {sound ? <Volume2 aria-hidden size={20} /> : <VolumeX aria-hidden size={20} />}
          </button>
        ) : null}
      </div>

      {/* Roue */}
      <div className={`flex min-h-0 flex-1 items-center justify-center ${compact ? "px-6 py-1" : "px-4 py-3"}`}>
        <div className="relative aspect-[400/414] h-full max-h-full max-w-full">
          <Wheel
            ref={wheel}
            segments={segments}
            logo={demo.logo}
            monogram={monogram}
            hubColor={primary}
            rimColor={primary}
            idle={mode === "preview"}
            sound={sound}
            label={demoText.preview.phoneLabel}
            className="h-full w-full"
          />
          <button
            type="button"
            onClick={spin}
            disabled={phase === "spinning" || phase === "review" || phase === "won"}
            tabIndex={mode === "test" && phase === "ready" ? 0 : -1}
            aria-hidden={mode !== "test" || phase !== "ready" ? true : undefined}
            aria-label={demoText.preview.spin}
            className="absolute inset-[4%] cursor-pointer rounded-full disabled:cursor-default"
          />
        </div>
      </div>

      {/* Action */}
      <div className={compact ? "px-4 pb-3" : "px-5 pb-6"}>
        {mode === "preview" ? (
          <button
            type="button"
            onClick={onStartTest}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-tomette px-5 font-semibold text-white shadow-md transition-colors hover:bg-tomette-deep"
          >
            {demoText.preview.test}
          </button>
        ) : (
          <button
            ref={spinBtn}
            type="button"
            onClick={spin}
            disabled={phase !== "ready"}
            className="flex min-h-12 w-full items-center justify-center rounded-full px-5 font-semibold text-white shadow-md transition-opacity disabled:opacity-70"
            style={{ background: readableOn(primary) === "#FFFFFF" ? primary : "#1D1A16" }}
          >
            {phase === "spinning" ? demoText.preview.spinning : demoText.preview.spin}
          </button>
        )}
      </div>

      {/* Note affichée après « Laisser un avis » dans la démo */}
      {reviewNotice && phase === "ready" ? (
        <div role="status" className="pop-in absolute inset-x-3 top-3 z-10 flex items-start gap-2 rounded-lg bg-night p-3 text-sm text-cream shadow-lg">
          <Info aria-hidden size={18} className="mt-0.5 shrink-0 text-safran" />
          <p className="flex-1">{fr(reviewPrompt.demoNotice)}</p>
          <button
            type="button"
            onClick={() => setReviewNotice(false)}
            aria-label={reviewPrompt.close}
            className="-m-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            <X aria-hidden size={18} />
          </button>
        </div>
      ) : null}

      {/* Invitation à l'avis : identique au vrai produit. Facultative, se ferme au premier appui. */}
      {phase === "review" ? (
        <div className="absolute inset-0 z-20 flex items-end bg-ink/45 p-3 sm:items-center">
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="avis-texte"
            onKeyDown={(e) => e.key === "Escape" && setPhase("ready")}
            className="pop-in relative w-full rounded-xl bg-paper p-5 pt-6 shadow-lg">
            <button
              ref={closeBtn}
              type="button"
              onClick={() => setPhase("ready")}
              aria-label={reviewPrompt.close}
              className="absolute top-1 right-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-cream"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                <X aria-hidden size={18} strokeWidth={3} />
              </span>
            </button>
            <div aria-hidden className="mb-3 flex gap-0.5 text-safran">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p id="avis-texte" className="pr-8 text-base font-semibold">
              {fr(reviewPrompt.text)}
            </p>
            <button
              type="button"
              onClick={() => {
                setReviewNotice(true);
                setPhase("ready");
              }}
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-5 font-semibold text-white"
            >
              {reviewPrompt.button}
            </button>
          </div>
        </div>
      ) : null}

      {/* Écran de gain */}
      {phase === "won" && win ? (
        <div className="absolute inset-0 z-30 flex flex-col overflow-y-auto bg-sauge text-white">
          <Confetti colors={["#F3B23C", "#FBF6EE", "#F6D9CE", primary]} />
          <div className="relative flex flex-1 flex-col items-center px-5 pt-7 pb-5 text-center">
            <h3 ref={winTitle} tabIndex={-1} className="pop-in font-display text-2xl font-semibold outline-none">
              {fr(winScreen.title)}
            </h3>
            <div className="pop-in mt-4 w-full rounded-xl bg-paper p-4 text-ink shadow-lg" style={{ animationDelay: "120ms" }}>
              <p className="text-xs font-semibold tracking-wider text-ink-soft uppercase">{winScreen.prizeLabel}</p>
              <div className="mt-2 flex items-center justify-center gap-2.5">
                {wonPrize?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={wonPrize.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : WonIcon ? (
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tomette-soft text-tomette-deep">
                    <WonIcon aria-hidden size={22} />
                  </span>
                ) : null}
                <p className="font-display text-xl leading-tight font-semibold">{win.name}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-dashed border-line pt-3 text-left">
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-ink-soft uppercase">{winScreen.codeLabel}</p>
                  <p className="tabular text-lg font-bold tracking-wide">{win.code}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-ink-soft uppercase">{fr(winScreen.deadlineLabel)}</p>
                  <p className="text-sm font-bold">{formatDate(win.deadline)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{fr(winScreen.howTo(displayName))}</p>
            </div>
            <p className="mt-3 text-xs text-white">{fr(winScreen.emailNote)}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-night/35 px-3 py-1 text-xs font-semibold">
              <Info aria-hidden size={14} /> {fr(winScreen.demoNotice)}
            </p>
            <div className="mt-auto flex w-full flex-col gap-2 pt-5">
              <button
                type="button"
                onClick={replay}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-paper px-5 font-semibold text-ink"
              >
                <RotateCcw aria-hidden size={18} /> {demoText.preview.restart}
              </button>
              {onExitTest ? (
                <button
                  type="button"
                  onClick={onExitTest}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white underline-offset-4 hover:underline"
                >
                  <Settings2 aria-hidden size={16} /> {demoText.preview.backToSettings}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
