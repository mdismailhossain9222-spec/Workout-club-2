import { useEffect, useState } from "react";
import { OFFER } from "@/config/pricing";

/** Offer countdown — silently renders nothing if no endDate is configured. */
export default function Countdown() {
  const [left, setLeft] = useState(() => diff());
  useEffect(() => {
    if (!OFFER.endDate) return;
    const t = setInterval(() => setLeft(diff()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!OFFER.active || !OFFER.endDate || !left) return null;

  const items: [string, number][] = [
    ["Days", left.d],
    ["Hrs", left.h],
    ["Min", left.m],
    ["Sec", left.s],
  ];
  return (
    <div className="flex gap-3">
      {items.map(([label, v]) => (
        <div key={label} className="clip-notch min-w-[68px] border border-violet-400/30 bg-black/50 px-3 py-2 text-center">
          <div className="font-[Syncopate] text-xl font-bold text-white tabular-nums">{String(v).padStart(2, "0")}</div>
          <div className="text-[9px] tracking-[0.25em] text-silver-dim uppercase">{label}</div>
        </div>
      ))}
    </div>
  );
}

function diff() {
  if (!OFFER.endDate) return null;
  const ms = new Date(OFFER.endDate).getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
}
