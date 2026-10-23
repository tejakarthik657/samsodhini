"use client";

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { LegacyEdition } from '../types';

export default function LegacyVault({ showHeading = true }: { showHeading?: boolean }) {
  const [editions, setEditions] = useState<LegacyEdition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  useEffect(() => {
    async function loadEditions() {
      try {
        const res = await fetch('/api/legacy');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setEditions(data.data);
          setSelectedYear(data.data[0].year);
        }
      } catch (err) {
        console.error('Failed to load legacy data:', err);
      }
    }
    loadEditions();
  }, []);

  const currentEdition = editions.find((e) => e.year === selectedYear) || editions[0];
  const statColors = ['bg-marigold-400', 'bg-cobalt-500 text-white', 'bg-coral-400', 'bg-mint-300'];

  return (
    <section className="bg-white py-20 sm:py-28 border-t-2 border-ink">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        {showHeading && (
          <div className="mb-10 sm:mb-14">
            <h2 className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-ink">Heritage vault</h2>
            <p className="mt-4 text-base sm:text-lg text-ink/80 max-w-xl leading-snug">
              Proceedings, keynote abstracts and souvenir magazines from past editions, kept for the students who come next.
            </p>
          </div>
        )}

        {!currentEdition ? (
          <div className="rounded-[28px] border-2 border-dashed border-ink px-6 py-16 text-center bg-lilac-100">
            <h3 className="font-display text-3xl sm:text-5xl leading-[0.95]">The vault is open, with nothing in it yet</h3>
            <p className="mt-3 text-base text-ink/80 max-w-md mx-auto leading-snug">
              Past editions and souvenir magazines appear here once they are deposited.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-8" role="tablist" aria-label="Past editions">
              {editions.map((edition) => {
                const selected = selectedYear === edition.year;
                return (
                  <button
                    key={edition.year}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setSelectedYear(edition.year)}
                    className={`px-6 py-2.5 rounded-full border-2 border-ink font-display text-3xl leading-none transition-all ${
                      selected ? 'bg-marigold-400 shadow-pop' : 'bg-white hover:bg-lilac-100'
                    }`}
                  >
                    &apos;{edition.year.toString().slice(-2)}
                  </button>
                );
              })}
            </div>

            <div className="rounded-[28px] border-2 border-ink shadow-pop-lg overflow-hidden bg-lilac-100">
              <div className="relative min-h-[260px] sm:min-h-[360px] bg-cobalt-500 text-white border-b-2 border-ink">
                {currentEdition.coverImage && (
                  <img src={currentEdition.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-multiply" />
                )}
                <div className="absolute inset-0 dots" aria-hidden="true" />
                <div className="relative h-full min-h-[260px] sm:min-h-[360px] p-6 sm:p-10 flex flex-col justify-end">
                  <span className="self-start px-3.5 py-1.5 rounded-full bg-marigold-400 text-ink border-2 border-ink text-sm font-bold -rotate-2">
                    {currentEdition.dates}
                  </span>
                  <h3 className="mt-4 font-display text-3xl sm:text-5xl leading-[1] max-w-4xl">
                    {currentEdition.theme || 'Innovating at the frontiers of engineering'}
                  </h3>
                  {currentEdition.chiefGuest?.name && (
                    <p className="mt-3 text-base text-white/90">
                      Chief guest: <strong>{currentEdition.chiefGuest.name}</strong>
                      {currentEdition.chiefGuest.title ? `, ${currentEdition.chiefGuest.title}` : ''}
                    </p>
                  )}
                </div>
              </div>

              <dl className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-ink">
                {[
                  ['Delegates', currentEdition.totalAttendees.toLocaleString()],
                  ['Workshops', String(currentEdition.totalWorkshops)],
                  ['Competitions', String(currentEdition.totalEvents)],
                  ['Prize money', currentEdition.prizeMoneyDisbursed],
                ].map(([label, value], i) => (
                  <div key={label} className={`p-5 sm:p-6 ${statColors[i]} ${i > 0 ? 'md:border-l-2' : ''} ${i % 2 === 1 ? 'border-l-2' : ''} ${i > 1 ? 'border-t-2 md:border-t-0' : ''} border-ink`}>
                    <dt className="text-sm font-semibold opacity-80">{label}</dt>
                    <dd className="mt-1 font-display text-2xl sm:text-4xl tabular-nums leading-none">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="p-6 sm:p-10 grid md:grid-cols-12 gap-8">
                <div className="md:col-span-8">
                  <h4 className="font-display text-3xl text-ink">Highlights</h4>
                  {Array.isArray(currentEdition.highlights) && currentEdition.highlights.length > 0 ? (
                    <ul className="mt-4 space-y-2.5">
                      {currentEdition.highlights.map((h, i) => (
                        <li key={i} className="flex gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-ink text-base font-medium text-ink">
                          <span aria-hidden="true">✺</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-base text-ink/80">Proceedings are kept in the institutional library.</p>
                  )}
                </div>

                <div className="md:col-span-4 rounded-[22px] bg-marigold-400 border-2 border-ink shadow-pop p-6 flex flex-col gap-4 rotate-1">
                  <div>
                    <h5 className="font-display text-3xl leading-[0.95] text-ink">Souvenir magazine</h5>
                    <p className="mt-2 text-sm font-medium text-ink/80">Proceedings and committee messages from this edition.</p>
                  </div>
                  <a
                    href={currentEdition.souvenirPdfUrl}
                    download
                    className="pop mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ink text-white text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
