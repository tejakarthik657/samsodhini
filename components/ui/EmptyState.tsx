import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  body: string;
  primary?: { label: string; href?: string; onClick?: () => void };
  secondary?: { label: string; href: string };
}

export default function EmptyState({ title, body, primary, secondary }: EmptyStateProps) {
  const primaryClass =
    'pop inline-flex items-center justify-center px-5 py-3 rounded-full bg-ink text-white text-sm font-bold';
  const secondaryClass =
    'pop inline-flex items-center justify-center px-5 py-3 rounded-full bg-white text-ink text-sm font-bold';

  return (
    <div className="relative rounded-[28px] border-2 border-dashed border-ink bg-white/70 px-6 py-14 sm:py-20 text-center overflow-hidden">
      <span className="font-display text-[9rem] sm:text-[12rem] leading-none text-lilac-200 absolute inset-x-0 -top-4 select-none" aria-hidden="true">
        ?
      </span>
      <div className="relative">
        <h3 className="font-display text-3xl sm:text-5xl text-ink leading-[0.95] max-w-xl mx-auto">{title}</h3>
        <p className="mt-3 text-base text-ink/75 max-w-md mx-auto leading-snug">{body}</p>
        {(primary || secondary) && (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {primary &&
              (primary.href ? (
                <Link href={primary.href} className={primaryClass}>{primary.label}</Link>
              ) : (
                <button type="button" onClick={primary.onClick} className={primaryClass}>{primary.label}</button>
              ))}
            {secondary && <Link href={secondary.href} className={secondaryClass}>{secondary.label}</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
