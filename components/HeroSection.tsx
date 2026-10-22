'use client';

import React from 'react';
import { 
  Calendar, 
  Award, 
  Users, 
  BookOpen, 
  Terminal, 
  Search, 
  Sparkles, 
  Trophy, 
  Layers,
  Archive,
  ChevronDown
} from 'lucide-react';
import { Edition } from '../types';

interface HeroSectionProps {
  selectedBranch: string;
  onSelectBranch: (branchCode: string) => void;
  selectedCategory: 'all' | 'workshops' | 'events';
  onSelectCategory: (category: 'all' | 'workshops' | 'events') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalWorkshopsCount: number;
  totalEventsCount: number;
  selectedYear?: number;
  editions?: Edition[];
  onSelectYear?: (year: number) => void;
}

const BRANCH_DETAILS: Record<string, { assoc: string; label: string; accent: string }> = {
  CE: { assoc: 'CEA', label: 'Civil Eng', accent: 'hover:border-emerald-300' },
  ME: { assoc: 'MESA', label: 'Mechanical Eng', accent: 'hover:border-rose-300' },
  EEE: { assoc: 'ELECTRA', label: 'Electrical Eng', accent: 'hover:border-amber-300' },
  ECE: { assoc: 'ECLAT', label: 'Electronics & Comm', accent: 'hover:border-indigo-300' },
  ECI: { assoc: 'ECIEA', label: 'ECI Engineering', accent: 'hover:border-violet-300' },
  EIE: { assoc: 'EIEA', label: 'Instrumentation', accent: 'hover:border-sky-300' },
  CSE: { assoc: 'ACE', label: 'Computer Engineering', accent: 'hover:border-blue-300' },
  IT: { assoc: 'ITA', label: 'Information Tech', accent: 'hover:border-teal-300' },
  CSN: { assoc: 'NETS', label: 'Networks', accent: 'hover:border-blue-300' },
  CSM: { assoc: 'AIMS', label: 'AI & Machine Learning', accent: 'hover:border-purple-300' },
  CSO: { assoc: 'IOTA', label: 'Internet of Things', accent: 'hover:border-cyan-300' },
  CSD: { assoc: 'DATA', label: 'Data Science', accent: 'hover:border-emerald-300' },
  EVL: { assoc: 'VLSI', label: 'VLSI Design', accent: 'hover:border-fuchsia-300' },
  CSC: { assoc: 'CYBER', label: 'Cyber Security', accent: 'hover:border-red-300' },
  ISTE: { assoc: 'ISTE', label: 'ISTE Chapter', accent: 'hover:border-blue-300' },
  TECH: { assoc: 'TECH', label: 'Technical Club', accent: 'hover:border-purple-300' },
  CSI: { assoc: 'CSI', label: 'CSI Branch', accent: 'hover:border-teal-300' },
  SAC: { assoc: 'SAC', label: 'Student Activity Centre', accent: 'hover:border-amber-300' },
};

export default function HeroSection({
  selectedBranch,
  onSelectBranch,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalWorkshopsCount,
  totalEventsCount,
  selectedYear = 2026,
  editions = [],
  onSelectYear
}: HeroSectionProps) {
  const branchList = [
    'CE', 'ME', 'EEE', 'ECE', 'ECI', 'EIE', 'CSE', 'IT', 'CSN', 'CSM', 'CSO', 'CSD', 'EVL', 'CSC',
    'ISTE', 'TECH', 'CSI', 'SAC'
  ];
  const currentEditionObj = editions.find(e => e.year === selectedYear);
  const isArchived = currentEditionObj ? !currentEditionObj.isActive : false;

  return (
    <section className="relative aurora-bg bg-grid-pattern pt-28 sm:pt-36 pb-14 sm:pb-20 overflow-hidden border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges & Emblem Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Institutional Affiliation Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200/90 shadow-xs text-xs font-bold shimmer-badge">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-900">KITSW Warangal</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">ISTE Student Chapter</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Technical Club & SAC</span>
          </div>

          {/* Central Logo Emblem & Universal Title */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-2.5 bg-white border border-slate-200/90 shadow-[0_16px_36px_-12px_rgba(15,23,42,0.1)] flex items-center justify-center mb-3 transition-transform hover:scale-105 duration-300">
              <img 
                src="/Sumshodhini26icon.png" 
                alt="Sumshodhini Official Emblem" 
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-none">
                SUMSHODHINI
              </h1>

              {/* Dynamic Edition Pill */}
              <span className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                &apos;{String(selectedYear).slice(-2)}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-500 font-bold mt-2">
              National Science & Technology Symposium • 2-Day Symposium Architecture
            </p>

            {isArchived && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mt-2">
                <Archive className="w-3.5 h-3.5" />
                <span>Archived Edition ({selectedYear}) • Browsing Retrospective Records</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            The platform for student technical exploration, branch flagship masterclasses, and national challenge arenas. Archiving engineering pedagogy and innovation across Kakatiya Institute of Technology & Science.
          </p>

          {/* Real-time DB Count Pills */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/80 border border-blue-200/60 text-xs text-blue-900 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>{totalWorkshopsCount} Flagship Workshop{totalWorkshopsCount !== 1 ? 's' : ''} Published</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50/80 border border-purple-200/60 text-xs text-purple-900 font-bold">
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              <span>{totalEventsCount} Competition Arena{totalEventsCount !== 1 ? 's' : ''} Published</span>
            </div>
          </div>

          {/* 2-Day Segmented Controller */}
          <div className="pt-2">
            <div className="inline-flex p-1.5 rounded-full bg-white border border-slate-200 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)] gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                All 2-Day Tracks
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory('workshops')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === 'workshops'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Day 1: Workshops</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 font-bold">1/Branch</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory('events')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === 'events'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Day 2: Competitions</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 font-bold">Multi</span>
              </button>
            </div>
          </div>

          {/* Dynamic Arc Description Card */}
          <div className="max-w-xl mx-auto pt-1">
            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs text-xs font-medium text-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-left">
                {selectedCategory === 'workshops' ? (
                  <>
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Day 1: Flagship Masterclasses</strong>
                      <span className="text-[11px] text-slate-500">Exactly 1 intensive hands-on lab per branch curated by senior student conveners and faculty advisors.</span>
                    </div>
                  </>
                ) : selectedCategory === 'events' ? (
                  <>
                    <Trophy className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Day 2: National Arena Competitions</strong>
                      <span className="text-[11px] text-slate-500">Hackathons, robotics combat, circuit debug, paper defense & project innovation expo.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 text-slate-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Complete 2-Day Experience Arc</strong>
                      <span className="text-[11px] text-slate-500">Day 1 Masterclass exploration followed by Day 2 National competitive arena.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & Branch Chips for all 14 Academic Branches */}
        <div className="mt-8 max-w-4xl mx-auto space-y-4">
          {/* Real-time Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by workshop topic, keynote speaker, hackathon name, or branch..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>

          {/* 14 Academic Department Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => onSelectBranch('ALL')}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBranch === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              All Departments & Clubs
            </button>

            {branchList.map((code) => {
              const meta = BRANCH_DETAILS[code];
              const isSelected = selectedBranch === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSelectBranch(code)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                  title={`${code} - ${meta?.label || code}`}
                >
                  <span className="font-mono">{code}</span>
                  {meta?.assoc && (
                    <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                      {meta.assoc}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
