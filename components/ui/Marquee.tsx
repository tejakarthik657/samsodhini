import React from 'react';

interface MarqueeProps {
  items: string[];
  className?: string;
  reverse?: boolean;
  textClass?: string;
}

/** A band of oversized words drifting sideways, separated by little stars. */
export default function Marquee({ items, className = '', reverse = false, textClass = 'text-4xl sm:text-6xl' }: MarqueeProps) {
  const run = items.map((n, i) => (
    <span key={`${n}-${i}`} className="flex items-center gap-6 sm:gap-10 shrink-0">
      <span className={`font-display uppercase ${textClass}`}>{n}</span>
      <span aria-hidden="true" className="text-[0.7em] leading-none">✺</span>
    </span>
  ));

  return (
    <div className={`overflow-hidden select-none ${className}`} role="img" aria-label={items.join(', ')}>
      <div
        className={`flex w-max gap-6 sm:gap-10 py-3 sm:py-4 ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}
        aria-hidden="true"
      >
        {run}
        {run}
      </div>
    </div>
  );
}
