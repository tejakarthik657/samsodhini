'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import NetflixDetailModal from '../../components/NetflixDetailModal';
import RegistrationModal from '../../components/RegistrationModal';
import Footer from '../../components/Footer';
import { FestEvent, Workshop, Edition } from '../../types';
import { KITSW_BRANCHES } from '../../lib/branches';
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
  const [registerItem, setRegisterItem] = useState<Workshop | FestEvent | null>(null);

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
    const matchesBranch = selectedBranch === 'ALL' || ev.branch === selectedBranch;
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar 
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        editions={editions}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 w-full space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              <span>DAY 2 EXCLUSIVE • NATIONAL COMPETITIONS & ARENA</span>
            </div>
            <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-700 shadow-2xs">
              Edition &apos;{String(selectedYear).slice(-2)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            National Technical Competitions
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Day 2 arena challenges across 24-hour hackathons, algorithmic speed sprints, combat robotics, hardware circuit debugging, and grand project innovation expos. Compete for national recognition and cash awards.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hackathons, robotics, coding..."
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-900 focus:bg-white focus:border-slate-400 transition-colors"
              />
            </div>

            {/* Department tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedBranch('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  selectedBranch === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Departments & Clubs
              </button>
              {KITSW_BRANCHES.map((b) => (
                <button
                  key={b.code}
                  onClick={() => setSelectedBranch(b.code)}
                  title={b.name}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                    selectedBranch === b.code
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b.code}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid or Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-2xl mx-auto p-8 space-y-3">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              {searchQuery
                ? `No competitions match "${searchQuery}" for department ${selectedBranch}.`
                : `No Day 2 Competitions published yet for ${selectedBranch} in this academic edition.`}
            </h3>
            <p className="text-xs text-slate-500">
              Department associations can register and manage as many technical competitions, hackathons, and challenge arenas as needed via the Organizer Portal.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Link
                href="/organizer"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors"
              >
                Register New Competition
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(ev) => setInspectItem(ev)}
                onQuickRegister={(ev) => setRegisterItem(ev)}
              />
            ))}
          </div>
        )}
      </main>

      <NetflixDetailModal
        item={inspectItem}
        onClose={() => setInspectItem(null)}
        onRegisterClick={(item) => {
          setInspectItem(null);
          setRegisterItem(item);
        }}
      />

      <RegistrationModal
        item={registerItem}
        onClose={() => setRegisterItem(null)}
      />

      <Footer />
    </div>
  );
}
