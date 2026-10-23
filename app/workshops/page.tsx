'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import WorkshopCard from '../../components/WorkshopCard';
import NetflixDetailModal from '../../components/NetflixDetailModal';
import Footer from '../../components/Footer';
import PageHeader from '../../components/ui/PageHeader';
import { Workshop, FestEvent, Edition } from '../../types';
import { KITSW_BRANCHES, canonicalBranchCode } from '../../lib/branches';
import { BookOpen, Search, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function WorkshopsPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectItem, setInspectItem] = useState<Workshop | FestEvent | null>(null);

  useEffect(() => {
    async function loadEditions() {
      try {
        const res = await fetch('/api/editions');
        const data = await res.json();
        if (data.success && data.data) {
          setEditions(data.data);
          if (data.activeEdition) {
            setSelectedYear(data.activeEdition.year);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadEditions();
  }, []);

  useEffect(() => {
    async function loadWorkshops() {
      try {
        const res = await fetch(`/api/workshops?year=${selectedYear}`);
        const data = await res.json();
        if (data.success && data.data) {
          setWorkshops(data.data);
        } else {
          setWorkshops([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadWorkshops();
  }, [selectedYear]);

  const filteredWorkshops = workshops.filter((ws) => {
    const matchesBranch = selectedBranch === 'ALL' || canonicalBranchCode(ws.branch) === selectedBranch;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.resourcePerson?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.resourcePerson?.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar 
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        editions={editions}
      />

      <PageHeader
        title="Day 1 workshops"
        description="One full-day masterclass from each department, led by industry specialists and senior student conveners."
        tone="teal"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-16 w-full space-y-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-[24px] border-2 border-ink shadow-pop ">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workshop title, speaker or topic..."
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full outline-none font-medium text-ink focus:bg-white focus:ring-4 focus:ring-cobalt-200 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedBranch('ALL')}
              className={`px-3.5 py-1.5 rounded-full border-2 text-sm font-bold transition-colors shrink-0 ${
                selectedBranch === 'ALL'
                  ? 'bg-ink text-white border-ink '
                  : 'bg-white text-ink border-slate-300 hover:border-ink hover:bg-lilac-100'
              }`}
            >
              All Departments & Clubs
            </button>
            {KITSW_BRANCHES.map((b) => (
              <button
                key={b.code}
                onClick={() => setSelectedBranch(b.code)}
                title={b.name}
                className={`px-3.5 py-1.5 rounded-full border-2 text-sm font-bold whitespace-nowrap transition-colors shrink-0 ${
                  selectedBranch === b.code
                    ? 'bg-ink text-white border-ink '
                    : 'bg-white text-ink border-slate-300 hover:border-ink hover:bg-lilac-100'
                }`}
              >
                {b.code}
              </button>
            ))}
          </div>
        </div>

        {/* Grid or Empty State */}
        {filteredWorkshops.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200  max-w-2xl mx-auto p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-display text-2xl  text-slate-900">
              {searchQuery
                ? `No workshops match "${searchQuery}".`
                : `No Day 1 Workshops yet.`}
            </h3>
            <p className="text-xs text-slate-500">
              Department associations can publish their workshop poster, keynote speaker dossier, and syllabus through the Organizer Portal.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Link
                href="/organizer"
                className="px-4 py-2 rounded-xl bg-ink text-white border-ink text-xs font-bold  hover:bg-teal-800 transition-colors"
              >
                Open Organizer Portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 lg:[&>*:nth-child(3n+2)]:mt-14">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                onSelect={(ws) => setInspectItem(ws)}
              />
            ))}
          </div>
        )}
      </main>

      <NetflixDetailModal
        item={inspectItem}
        onClose={() => setInspectItem(null)}
      />


      <Footer />
    </div>
  );
}
