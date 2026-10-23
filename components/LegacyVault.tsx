'use client';

import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  Download, 
  FileText,
  Calendar,
  Users,
  Award
} from 'lucide-react';
import { LegacyEdition } from '../types';

export default function LegacyVault() {
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

  return (
    <section className="bg-slate-50 py-12 sm:py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-semibold">
            <Archive className="w-3.5 h-3.5 text-slate-500" />
            <span>Digital Heritage Repository</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            The Samshodhani Legacy Vault
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Preserving technical symposium proceedings, keynote abstracts, and event memories across five decades of engineering education at KITSW.
          </p>
        </div>

        {!currentEdition ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto">
            <Archive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Heritage Vault Initialized</h3>
            <p className="text-xs text-slate-500 mt-1">
              Historical symposium editions and souvenir journals will be published here as archives are deposited.
            </p>
          </div>
        ) : (
          <>
            {/* Year Selector */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-6">
              {editions.map((edition) => {
                const isSelected = selectedYear === edition.year;
            return (
              <button
                key={edition.year}
                onClick={() => setSelectedYear(edition.year)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Samshodhani '{edition.year.toString().slice(-2)}</span>
                {edition.year === 2026 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-1.5"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Exhibition Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="relative aspect-[16/10] sm:aspect-[21/8] min-h-[200px] sm:min-h-[240px] max-h-[320px] w-full overflow-hidden bg-slate-900">
            <img 
              src={currentEdition.coverImage} 
              alt={`Samshodhani ${currentEdition.year}`}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-white">
              <span className="text-[10px] font-mono text-slate-300 uppercase block">
                {currentEdition.dates}
              </span>
              <h3 className="text-base sm:text-2xl font-bold mt-1 line-clamp-2">
                &quot;{currentEdition.theme || 'Innovating at the Frontiers of Engineering'}&quot;
              </h3>
              {currentEdition.chiefGuest?.name && (
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-1">
                  Chief Guest: <strong className="text-white">{currentEdition.chiefGuest.name}</strong> ({currentEdition.chiefGuest.title || 'Distinguished Keynote'})
                </p>
              )}
            </div>
          </div>

          {/* Telemetry Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 text-center text-xs py-3 bg-slate-50/50">
            <div className="p-2">
              <span className="text-[10px] text-slate-400 block uppercase">Delegates</span>
              <span className="text-base font-bold text-slate-900">{currentEdition.totalAttendees.toLocaleString()}</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 block uppercase">Workshops</span>
              <span className="text-base font-bold text-slate-900">{currentEdition.totalWorkshops} Senior Tracks</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 block uppercase">Competitions</span>
              <span className="text-base font-bold text-slate-900">{currentEdition.totalEvents} Contests</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 block uppercase">Prize Pool</span>
              <span className="text-base font-bold text-slate-900">{currentEdition.prizeMoneyDisbursed}</span>
            </div>
          </div>

          {/* Highlights & Souvenir */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
            <div className="md:col-span-8 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm">Edition Highlights</h4>
              <div className="space-y-1.5">
                {Array.isArray(currentEdition.highlights) && currentEdition.highlights.length > 0 ? (
                  currentEdition.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-mono text-[10px] mt-0.5">{i + 1}.</span>
                      <span className="text-slate-700">{h}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Proceedings preserved in institutional library archives.</p>
                )}
              </div>
            </div>

            <div className="md:col-span-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Annual Publication</span>
                <h5 className="font-bold text-slate-900">Souvenir Digest PDF</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Download proceedings and committee messages.
                </p>
              </div>

              <a
                href={currentEdition.souvenirPdfUrl}
                download
                className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
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
