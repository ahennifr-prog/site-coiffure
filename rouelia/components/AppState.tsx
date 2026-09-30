"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { palettes, trades, type PackId, type TradeId } from "@/content";
import type { Utm, WheelConfig } from "@/lib/signup";
import {
  addPrize, averageCost, normalize, paletteFromPrimary, readableOn, removePrize, segmentColors,
  setPercent, withIds, type WheelPrize,
} from "@/lib/wheel";

export interface DemoState {
  shopName: string;
  trade: TradeId;
  paletteId: string;
  /** Couleur libre : remplace la palette si elle est définie. */
  primaryColor: string | null;
  logo: string | null;
  noLogo: boolean;
  prizes: WheelPrize[];
  /** Le visiteur a touché aux réglages : on garde sa roue pour l'essai. */
  touched: boolean;
}

interface AppState {
  demo: DemoState;
  setShopName: (v: string) => void;
  setTrade: (t: TradeId) => void;
  setPalette: (id: string) => void;
  setPrimaryColor: (hex: string) => void;
  setLogo: (dataUrl: string | null) => void;
  setNoLogo: (v: boolean) => void;
  updatePrize: (index: number, patch: Partial<WheelPrize>) => void;
  setPrizePercent: (index: number, value: number) => void;
  togglePrizeLock: (index: number) => void;
  addNewPrize: (name: string) => void;
  removePrizeAt: (index: number) => void;
  colors: string[];
  segmentTextColors: string[];
  primary: string;
  avgCost: number;
  displayName: string;
  monogram: string;
  wheelConfig: () => WheelConfig;
  signup: { open: boolean; pack: PackId };
  openSignup: (pack?: PackId) => void;
  closeSignup: () => void;
  utm: Utm | null;
}

const Ctx = createContext<AppState | null>(null);
const STORAGE_KEY = "rouelia-demo-v1";

function initialDemo(trade: TradeId = "coiffeur"): DemoState {
  const t = trades.find((x) => x.id === trade) ?? trades[0];
  return {
    shopName: "",
    trade: t.id,
    paletteId: "tomette",
    primaryColor: null,
    logo: null,
    noLogo: false,
    prizes: withIds(t.prizes),
    touched: false,
  };
}

export function monogramOf(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .split(" ")
    .filter((w) => w.length > 1 && !["le", "la", "les", "de", "du", "des", "chez", "et", "au", "aux"].includes(w.toLowerCase()));
  if (words.length === 0) return name.trim().charAt(0).toUpperCase() || "R";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [demo, setDemo] = useState<DemoState>(() => initialDemo());
  const [signup, setSignup] = useState<{ open: boolean; pack: PackId }>({ open: false, pack: "croissance" });
  const [utm, setUtm] = useState<Utm | null>(null);
  const loaded = useRef(false);

  // Reprend la roue du visiteur s'il revient sur la page (stockage local, jamais envoyé).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as DemoState;
        if (saved && Array.isArray(saved.prizes) && saved.prizes.length >= 3) {
          setDemo({ ...initialDemo(saved.trade), ...saved, prizes: normalize(saved.prizes) });
        }
      }
    } catch {
      /* stockage indisponible */
    }
    loaded.current = true;

    const q = new URLSearchParams(window.location.search);
    setUtm({
      source: q.get("utm_source"),
      medium: q.get("utm_medium"),
      campaign: q.get("utm_campaign"),
      term: q.get("utm_term"),
      content: q.get("utm_content"),
      referrer: document.referrer || null,
      landingPath: window.location.pathname + window.location.search,
    });
  }, []);

  useEffect(() => {
    if (!loaded.current || !demo.touched) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    } catch {
      // Logo trop lourd pour le stockage : on garde le reste.
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...demo, logo: null }));
      } catch {
        /* stockage indisponible */
      }
    }
  }, [demo]);

  const patch = useCallback((p: Partial<DemoState> | ((d: DemoState) => Partial<DemoState>)) => {
    setDemo((d) => ({ ...d, ...(typeof p === "function" ? p(d) : p), touched: true }));
  }, []);

  const palette = palettes.find((p) => p.id === demo.paletteId) ?? palettes[0];
  const base = demo.primaryColor ? paletteFromPrimary(demo.primaryColor) : [...palette.colors];
  const colors = segmentColors(base, demo.prizes.length);
  const primary = demo.primaryColor ?? (palette.id === "nuit" ? palette.colors[1] : palette.colors[0]);
  const trade = trades.find((t) => t.id === demo.trade) ?? trades[0];
  const displayName = demo.shopName.trim() || trade.sampleName;
  const avg = averageCost(demo.prizes);

  const value = useMemo<AppState>(
    () => ({
      demo,
      setShopName: (v) => patch({ shopName: v.slice(0, 40) }),
      setTrade: (t) =>
        patch(() => {
          const tr = trades.find((x) => x.id === t) ?? trades[0];
          return { trade: tr.id, prizes: withIds(tr.prizes) };
        }),
      setPalette: (id) => patch({ paletteId: id, primaryColor: null }),
      setPrimaryColor: (hex) => patch({ primaryColor: hex.toUpperCase() }),
      setLogo: (logo) => patch({ logo, noLogo: false }),
      setNoLogo: (v) => patch(v ? { noLogo: true, logo: null } : { noLogo: false }),
      updatePrize: (i, p) => patch((d) => ({ prizes: d.prizes.map((x, k) => (k === i ? { ...x, ...p } : x)) })),
      setPrizePercent: (i, v) => patch((d) => ({ prizes: setPercent(d.prizes, i, v) })),
      togglePrizeLock: (i) =>
        patch((d) => {
          const unlockedOthers = d.prizes.filter((p, k) => k !== i && !p.locked).length;
          // Il faut au moins deux lots libres pour que la redistribution reste possible.
          if (!d.prizes[i].locked && unlockedOthers < 2) return {};
          return { prizes: d.prizes.map((x, k) => (k === i ? { ...x, locked: !x.locked } : x)) };
        }),
      addNewPrize: (name) => patch((d) => ({ prizes: addPrize(d.prizes, { name, icon: "cadeau", cost: 1 }) })),
      removePrizeAt: (i) => patch((d) => ({ prizes: removePrize(d.prizes, i) })),
      colors,
      segmentTextColors: colors.map(readableOn),
      primary,
      avgCost: avg,
      displayName,
      monogram: monogramOf(displayName),
      wheelConfig: () => ({
        shopName: demo.shopName.trim(),
        trade: demo.trade,
        paletteId: demo.paletteId,
        primaryColor: demo.primaryColor,
        logo: demo.logo,
        noLogo: demo.noLogo,
        prizes: demo.prizes.map((p) => ({ name: p.name, icon: p.icon, cost: p.cost, percent: p.percent, hasImage: !!p.image })),
        averageCost: Math.round(avg * 100) / 100,
      }),
      signup,
      openSignup: (pack) => setSignup((s) => ({ open: true, pack: pack ?? s.pack })),
      closeSignup: () => setSignup((s) => ({ ...s, open: false })),
      utm,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [demo, signup, utm, patch],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppState doit être utilisé dans AppStateProvider");
  return v;
}
