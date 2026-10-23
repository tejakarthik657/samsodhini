'use client';

import React, { useEffect, useState } from 'react';

/** Reads "October 30–31, 2026" or "October 30, 2026" into a start and end-of-day timestamp. */
function parseRange(text?: string): { start: number; end: number } | null {
  if (!text) return null;
  const m = text.match(/([A-Za-z]+)\s+(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?,?\s*(\d{4})/);
  if (!m) return null;
  const [, month, d1, d2, year] = m;
  const start = new Date(`${month} ${d1}, ${year} 00:00:00`).getTime();
  const end = new Date(`${month} ${d2 || d1}, ${year} 23:59:59`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return { start, end };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function Countdown({ dates }: { dates?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const range = parseRange(dates);
  if (!range || now === null) return null;

  if (now > range.end) return null;

  if (now >= range.start) {
    return (
      <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-300 border-2 border-ink shadow-pop-sm text-sm font-bold text-ink">
        <span className="w-2.5 h-2.5 rounded-full bg-ink motion-safe:animate-pulse" aria-hidden="true" />
        Happening now
      </p>
    );
  }

  const diff = range.start - now;
  const parts = [
    { label: 'days', value: Math.floor(diff / 86400000) },
    { label: 'hours', value: Math.floor((diff % 86400000) / 3600000) },
    { label: 'minutes', value: Math.floor((diff % 3600000) / 60000) },
    { label: 'seconds', value: Math.floor((diff % 60000) / 1000) },
  ];

  return (
    <div role="timer" aria-label={`Starts in ${parts[0].value} days, ${parts[1].value} hours`}>
      <p className="text-sm font-semibold text-white/90 mb-2.5">The gates open in</p>
      <div className="flex gap-2.5 sm:gap-3">
        {parts.map((p, i) => (
          <div
            key={p.label}
            className={`min-w-[4.2rem] sm:min-w-[5rem] px-3 py-2.5 rounded-2xl bg-white border-2 border-ink shadow-pop-sm text-center ${
              i % 2 ? 'rotate-1' : '-rotate-1'
            }`}
          >
            <span className="block font-display text-3xl sm:text-4xl leading-none text-ink tabular-nums">{pad(p.value)}</span>
            <span className="mt-1 block text-[0.7rem] sm:text-xs font-bold text-ink/70">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
