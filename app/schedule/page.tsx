'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ScheduleTimeline from '../../components/ScheduleTimeline';
import Footer from '../../components/Footer';
import { Calendar, ChevronDown, ShieldCheck } from 'lucide-react';
import { Edition } from '../../types';
import Link from 'next/link';

export default function SchedulePage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  useEffect(() => {
    async function fetchEditions() {
      try {
        const res = await fetch('/api/editions');
        const json = await res.json();
        if (json.success && json.data) {
          setEditions(json.data);
          if (json.activeEdition) {
            setSelectedYear(json.activeEdition.year);
          }
        }
      } catch (err) {
        console.error('Failed to load editions:', err);
      }
    }
    fetchEditions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar 
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        editions={editions}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Official 2-Day Technical Fest Itinerary</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Schedule & Department Venues
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Real-time itinerary across Day 1 Flagship Masterclasses and Day 2 National Competitions, synchronized directly with verified department laboratories for Edition {selectedYear}.
          </p>

          {/* Edition Switcher Pill */}
          {editions.length > 1 && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Academic Edition:</span>
              <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 overflow-x-auto scrollbar-none max-w-full">
                {editions.map((ed) => (
                  <button
                    key={ed.year}
                    onClick={() => setSelectedYear(ed.year)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      ed.year === selectedYear 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sumshodhini &apos;{String(ed.year).slice(-2)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-8 shadow-xs">
          <ScheduleTimeline editionYear={selectedYear} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
