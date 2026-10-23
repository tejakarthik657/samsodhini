import React from 'react';

interface CapacityTicksProps {
  filled: number;
  total: number;
  label: string;
  tone?: 'teal' | 'saffron';
  onDark?: boolean;
}

const SEGMENTS = 12;

/** Chunky segmented meter for seats and slots. */
export default function CapacityTicks({ filled, total, label, tone = 'teal', onDark = false }: CapacityTicksProps) {
  const ratio = total > 0 ? Math.min(1, filled / total) : 0;
  const lit = Math.round(ratio * SEGMENTS);
  const litColor = tone === 'saffron' ? 'bg-marigold-400' : 'bg-cobalt-500';

  return (
    <div>
      <div className={`flex items-baseline justify-between text-sm font-semibold ${onDark ? 'text-white' : 'text-ink'}`}>
        <span>{label}</span>
        <span className="tabular-nums">
          {filled}
          <span className="font-normal opacity-60"> / {total}</span>
        </span>
      </div>
      <div
        className="mt-1.5 flex gap-1"
        role="img"
        aria-label={`${filled} of ${total} ${label.toLowerCase()}`}
      >
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 h-3 rounded-[4px] border-2 ${
              i < lit
                ? `${litColor} ${onDark ? 'border-white' : 'border-ink'}`
                : onDark ? 'border-white/30 bg-transparent' : 'border-slate-300 bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
