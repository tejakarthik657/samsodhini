import React from 'react';

interface SectionHeaderProps {
  day?: '1' | '2';
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  action?: React.ReactNode;
  as?: 'h1' | 'h2';
  onColor?: boolean;
}

/** Giant heading with a tilted day sticker. `onColor` flips text colours for coloured section blocks. */
export default function SectionHeader({
  day,
  title,
  description,
  count,
  countLabel,
  action,
  as: Heading = 'h2',
  onColor = false,
}: SectionHeaderProps) {
  const sticker = day === '2' ? 'bg-cobalt-500 text-white' : 'bg-marigold-400 text-ink';

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
      <div className="relative">
        {day && (
          <span
            className={`absolute -top-5 sm:-top-7 -left-1 sm:-left-3 -rotate-6 px-3.5 py-1.5 rounded-full border-2 border-ink shadow-pop-sm text-sm font-bold ${sticker}`}
            aria-hidden="true"
          >
            Day {day}
          </span>
        )}
        <Heading className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-ink pt-5">
          {title}
        </Heading>
        {description && (
          <p className="mt-4 text-base sm:text-lg text-ink/80 max-w-xl leading-snug">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {typeof count === 'number' && (
          <span className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-white border-2 border-ink shadow-pop-sm rotate-2">
            <span className="font-display text-3xl text-ink tabular-nums">{count}</span>
            <span className="text-sm font-semibold text-ink">{countLabel}</span>
          </span>
        )}
        {action}
      </div>
    </div>
  );
}
