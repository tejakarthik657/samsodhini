'use client';

import React, { useEffect, useState } from 'react';
import { Download, Maximize2, X } from 'lucide-react';

interface MainPosterProps {
  posterUrl?: string | null;
  year: number;
}

/** The festival's official poster, shown straight after the opening section. */
export default function MainPoster({ posterUrl, year }: MainPosterProps) {
  const [open, setOpen] = useState(false);
  const yy = String(year).slice(-2);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <section id="poster" className="relative bg-paper pt-24 sm:pt-32 pb-8 overflow-hidden" aria-label="Official poster">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-marigold-400 border-2 border-ink shadow-pop-sm text-sm font-bold -rotate-2">
              Edition &apos;{yy}
            </span>
            <h2 className="mt-5 font-display uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-ink">
              The official poster
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink/80 leading-snug max-w-xl">
              Every workshop, contact and date for both days. Save it, share it, pin it up.
            </p>
          </div>

          {posterUrl && (
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="pop inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-cobalt-500 text-white text-base font-bold"
              >
                <Maximize2 className="w-5 h-5" /> View full size
              </button>
              <a
                href={posterUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="pop inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-ink text-base font-bold"
              >
                <Download className="w-5 h-5" /> Download
              </a>
            </div>
          )}
        </div>

        <div className="relative max-w-[1280px] mx-auto">
          <span
            aria-hidden="true"
            className="absolute -top-4 left-1/2 -translate-x-1/2 -rotate-2 w-32 h-8 bg-marigold-300/90 border-2 border-ink z-10"
          />
          <div className="p-3 sm:p-5 bg-white border-2 border-ink rounded-[24px] shadow-pop-lg -rotate-[0.6deg]">
            {posterUrl ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="block w-full overflow-hidden rounded-xl border-2 border-ink bg-lilac-100 group cursor-zoom-in"
                aria-label="Open the official poster full size"
              >
                <img
                  src={posterUrl}
                  alt={`Official Sumshodhini '${yy} poster: workshops, contacts and dates`}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none"
                />
              </button>
            ) : (
              <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-ink bg-cobalt-500 text-white relative overflow-hidden flex flex-col items-center justify-center text-center p-8">
                <div className="absolute inset-0 dots" aria-hidden="true" />
                <p className="relative font-display text-[7rem] sm:text-[10rem] leading-none text-marigold-400">&apos;{yy}</p>
                <p className="relative mt-2 text-sm font-semibold text-white/85">Poster reveal coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {open && posterUrl && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 bg-ink/90 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Official poster"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white border-2 border-ink flex items-center justify-center"
            aria-label="Close poster"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={posterUrl}
            alt={`Official Sumshodhini '${yy} poster`}
            className="max-h-[92vh] max-w-[96vw] w-auto rounded-xl border-2 border-white/80 shadow-pop-lg animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
