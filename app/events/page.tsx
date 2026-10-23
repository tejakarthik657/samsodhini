'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import NetflixDetailModal from '../../components/NetflixDetailModal';
import Footer from '../../components/Footer';
import PageHeader from '../../components/ui/PageHeader';
import { FestEvent, Workshop, Edition } from '../../types';
import { KITSW_BRANCHES, canonicalBranchCode } from '../../lib/branches';
import { Terminal, Search, Filter, Trophy, ShieldCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
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
    async function loadEvents() {
      try {
        const res = await fetch(`/api/events?year=${selectedYear}`);
        const data = await res.json();
        if (data.success && data.data) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadEvents();
  }, [selectedYear]);

  const categories = [
    'ALL', 
    'Competitive Coding', 
    '24-Hour Hackathon', 
    'Paper & Poster Presentation', 
    'Combat Robotics & Line Follower', 
    'Circuit Debugging & Hardware Sprint',
    'Project Innovation Expo'
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesBranch = selectedBranch === 'ALL' || canonicalBranchCode(ev.branch) === selectedBranch;
    const matchesCat = selectedCategory === 'ALL' || ev.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar 
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        editions={editions}
      />

      <PageHeader
        title="Day 2 competitions"
        description="Hackathons, speed coding, combat robotics, circuit debugging and project expos, with cash prizes for winning teams."
        tone="saffron"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-16 w-full space-y-8">
        {/* Filter Bar */}
        <div className="space-y-3 bg-white p-4 rounded-[24px] border-2 border-ink shadow-pop ">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hackathons, robotics, coding..."
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full outline-none font-medium text-ink focus:bg-white focus:ring-4 focus:ring-cobalt-200 transition-colors"
              />
            </div>

            {/* Department tabs */}
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

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100 pb-1">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-ink text-white border-ink border-slate-900 '
                    : 'bg-white text-ink border-slate-300 hover:border-ink hover:bg-lilac-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid or Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200  max-w-2xl mx-auto p-8 space-y-3">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-display text-2xl  text-slate-900">
              {searchQuery
                ? `No competitions match "${searchQuery}".`
                : `No Day 2 Competitions yet.`}
            </h3>
            <p className="text-xs text-slate-500">
              Department associations can register and manage as many technical competitions, hackathons, and challenge arenas as needed via the Organizer Portal.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Link
                href="/organizer"
                className="px-4 py-2 rounded-xl bg-ink text-white border-ink text-xs font-bold  hover:bg-teal-800 transition-colors"
              >
                Register New Competition
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 lg:[&>*:nth-child(3n+2)]:mt-14">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(ev) => setInspectItem(ev)}
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
