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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-14">
      <div className="relative min-w-0">
        {day && (
          <span
            className={`inline-block mb-2 sm:mb-0 sm:absolute sm:-top-7 sm:-left-3 -rotate-3 sm:-rotate-6 px-3.5 py-1.5 rounded-full border-2 border-ink shadow-pop-sm text-xs sm:text-sm font-bold ${sticker}`}
            aria-hidden="true"
          >
            Day {day}
          </span>
        )}
        <Heading className="font-display uppercase text-3xl sm:text-5xl lg:text-7xl leading-[0.95] text-ink sm:pt-5 break-words">
          {title}
        </Heading>
        {description && (
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-ink/80 max-w-xl leading-snug">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {typeof count === 'number' && (
          <span className="inline-flex items-baseline gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border-2 border-ink shadow-pop-sm rotate-2">
            <span className="font-display text-2xl sm:text-3xl text-ink tabular-nums">{count}</span>
            <span className="text-xs sm:text-sm font-semibold text-ink">{countLabel}</span>
          </span>
        )}
        {action}
      </div>
    </div>
  );
}
