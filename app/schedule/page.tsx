'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ScheduleTimeline from '../../components/ScheduleTimeline';
import Footer from '../../components/Footer';
import PageHeader from '../../components/ui/PageHeader';
import { Edition } from '../../types';

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
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar 
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        editions={editions}
      />

      <PageHeader
        title="Schedule"
        description={`Times and venues for both days of the '${String(selectedYear).slice(-2)} edition, taken from what each department has published.`}
      >
        {editions.length > 1 && (
          <div className="inline-flex gap-1 overflow-x-auto scrollbar-none max-w-full" role="group" aria-label="Edition">
            {editions.map((ed) => (
              <button
                key={ed.year}
                onClick={() => setSelectedYear(ed.year)}
                aria-pressed={ed.year === selectedYear}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${
                  ed.year === selectedYear ? 'bg-saffron-500 text-ink-deep' : 'text-teal-100 hover:bg-white/10'
                }`}
              >
                &apos;{String(ed.year).slice(-2)}
              </button>
            ))}
          </div>
        )}
      </PageHeader>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 w-full">
        <ScheduleTimeline editionYear={selectedYear} />
      </main>

      <Footer />
    </div>
  );
}
