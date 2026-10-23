import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  tone?: 'teal' | 'saffron';
  children?: React.ReactNode;
}

/** Colour-block band that opens every inner page. */
export default function PageHeader({ title, description, tone = 'teal', children }: PageHeaderProps) {
  const bg = tone === 'saffron' ? 'bg-marigold-400 text-ink' : 'bg-cobalt-500 text-white';
  const sub = tone === 'saffron' ? 'text-ink/80' : 'text-white/90';
  return (
    <header className={`relative overflow-hidden grain ${bg}`}>
      <div className={`absolute inset-0 ${tone === 'saffron' ? 'dots-ink' : 'dots'}`} aria-hidden="true" />
      <span
        className="hidden md:block absolute -right-6 -top-10 font-display text-[22rem] leading-none opacity-20 select-none"
        aria-hidden="true"
      >
        ✺
      </span>
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8 pt-36 sm:pt-44 pb-12 sm:pb-16">
        <h1 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.95] max-w-5xl">{title}</h1>
        {description && <p className={`mt-6 text-lg sm:text-xl max-w-xl leading-snug ${sub}`}>{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
