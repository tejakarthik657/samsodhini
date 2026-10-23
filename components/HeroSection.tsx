'use client';

import React from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { Edition } from '../types';
import Marquee from './ui/Marquee';
import EmblemStage from './EmblemStage';
import Countdown from './Countdown';
import MainPoster from './MainPoster';

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

const BRANCH_LIST = [
  'CE', 'ME', 'EEE', 'ECE', 'CSE', 'IT', 'CSN', 'CSM', 'ECV', 'CSC', 'I2RE', 'MBA',
  'ISTE', 'TECH', 'CSI', 'SAC',
];

const BRANCH_LABEL: Record<string, string> = {
  CE: 'Civil', ME: 'Mechanical', EEE: 'Electrical (EEEA)', ECE: 'Electronics & Communication (ECEA)',
  CSE: 'Computer Science (CSEA)', IT: 'Information Technology', CSN: 'CSE Networks and IoT (CSENA)',
  CSM: 'CSE AI & ML and Data Science (CSMA)', ECV: 'ECE VLSI, with ECI and EIE (ECVA)', CSC: 'Cyber Security', ISTE: 'ISTE', TECH: 'Technical Club',
  CSI: 'CSI', SAC: 'SAC',
  I2RE: 'SAIL I2RE, Innovation, Incubation, Research & Entrepreneurship', MBA: 'MBA Association',
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
}: HeroSectionProps) {
  const currentEditionObj = editions.find((e) => e.year === selectedYear);
  const isArchived = currentEditionObj ? !currentEditionObj.isActive : false;
  const yy = String(selectedYear).slice(-2);

  const tabs: { key: 'all' | 'workshops' | 'events'; label: string; count: number }[] = [
    { key: 'all', label: 'Both days', count: totalWorkshopsCount + totalEventsCount },
    { key: 'workshops', label: 'Day 1', count: totalWorkshopsCount },
    { key: 'events', label: 'Day 2', count: totalEventsCount },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-cobalt-500 text-white overflow-hidden grain w-full max-w-full">
        <div className="absolute inset-0 dots" aria-hidden="true" />

        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8 pt-28 sm:pt-40 pb-16 sm:pb-24 w-full">
          {/* Stickers */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-ink text-white border-2 border-ink shadow-pop-sm text-xs sm:text-sm font-bold rotate-1">
              Edition &apos;{yy}
            </span>
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white text-ink border-2 border-ink shadow-pop-sm text-xs sm:text-sm font-bold -rotate-2">
              KITSW Warangal
            </span>
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-marigold-400 text-ink border-2 border-ink shadow-pop-sm text-xs sm:text-sm font-bold rotate-2">
              {currentEditionObj?.dates || 'Two days, 30+ events'}
            </span>
            {isArchived && (
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-coral-500 text-white border-2 border-ink shadow-pop-sm text-xs sm:text-sm font-bold -rotate-1">
                {selectedYear} archive
              </span>
            )}
          </div>

          <h1
            className="mt-6 sm:mt-10 font-display uppercase text-marigold-400 text-4xl sm:text-[7.7vw] leading-[0.95] -ml-[0.03em] break-words"
            aria-label={`Sumshodhini ${yy}`}
          >
            Sumshodhini
          </h1>

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 min-w-0">
              <p
                className="font-display text-white text-6xl sm:text-[9vw] lg:text-[8vw] leading-[0.8] -ml-[0.03em]"
                aria-hidden="true"
              >
                &apos;{yy}
              </p>
              <p className="mt-4 sm:mt-5 text-base sm:text-xl text-white/95 leading-snug max-w-md">
                The national level technical symposium of Kakatiya Institute of Technology &amp; Science. One workshop from every department on Day 1, contests with national prizes on Day 2.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                <a
                  href="#workshops"
                  className="pop inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-marigold-400 text-ink text-sm sm:text-base font-bold"
                >
                  Browse workshops <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="#events"
                  className="pop inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white text-ink text-sm sm:text-base font-bold"
                >
                  Find a competition <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
              <div className="mt-8 sm:mt-9">
                <Countdown dates={currentEditionObj?.dates} />
              </div>
            </div>

            <div className="relative lg:col-span-6 order-1 lg:order-2 pt-6 sm:pt-14 pb-4 sm:pb-10 lg:py-0 lg:mt-[0.6vw] flex justify-center overflow-hidden lg:overflow-visible">
              <EmblemStage />
            </div>
          </div>
        </div>

        {/* Tilted ticker crossing the bottom edge */}
        <div className="relative -mb-7 sm:-mb-9 overflow-hidden max-w-full">
          <Marquee
            items={['Day 1 workshops', 'Day 2 competitions', 'National prizes', 'Student run']}
            className="bg-marigold-400 text-ink border-y-2 border-ink -rotate-1 sm:scale-[1.04] origin-left"
          />
        </div>
      </section>

      <MainPoster posterUrl={currentEditionObj?.posterUrl || (selectedYear === 2026 ? '/main-poster-2026.jpg' : null)} year={selectedYear} />

      {/* Day doors */}
      <section className="relative bg-paper pt-16 sm:pt-20 overflow-hidden" aria-label="Choose a day">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-5 sm:gap-6">
          <a
            href="#workshops"
            onClick={() => onSelectCategory('workshops')}
            className="pop group relative overflow-hidden rounded-[28px] bg-lilac-200 min-h-[240px] sm:min-h-[380px] p-6 sm:p-9 flex flex-col justify-between"
          >
            <span className="absolute -right-2 -top-8 font-display text-[8rem] sm:text-[16rem] leading-none text-cobalt-500 transition-transform duration-300 group-hover:-translate-x-3 group-hover:rotate-[-4deg] select-none" aria-hidden="true">
              1
            </span>
            <span className="relative self-start px-3 py-1 rounded-full bg-white border-2 border-ink text-sm font-bold">Day 1</span>
            <span className="relative">
              <span className="block font-display text-3xl sm:text-6xl leading-[0.95] text-ink">Workshops</span>
              <span className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-semibold text-ink">
                {totalWorkshopsCount} {totalWorkshopsCount === 1 ? 'workshop' : 'workshops'}, one per department
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </span>
          </a>

          <a
            href="#events"
            onClick={() => onSelectCategory('events')}
            className="pop group relative overflow-hidden rounded-[28px] bg-marigold-400 min-h-[240px] sm:min-h-[380px] p-6 sm:p-9 flex flex-col justify-between"
          >
            <span className="absolute -right-2 -top-8 font-display text-[8rem] sm:text-[16rem] leading-none text-ink transition-transform duration-300 group-hover:-translate-x-3 group-hover:rotate-[4deg] select-none" aria-hidden="true">
              2
            </span>
            <span className="relative self-start px-3 py-1 rounded-full bg-white border-2 border-ink text-sm font-bold">Day 2</span>
            <span className="relative">
              <span className="block font-display text-3xl sm:text-6xl leading-[0.95] text-ink">Competitions</span>
              <span className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-semibold text-ink">
                {totalEventsCount} {totalEventsCount === 1 ? 'contest' : 'contests'}, with cash prizes
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </span>
          </a>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-paper pt-12 sm:pt-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
          <div className="rounded-[28px] bg-white border-2 border-ink shadow-pop p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div role="tablist" aria-label="Show listings for" className="flex flex-wrap shrink-0 gap-1.5">
                {tabs.map((t) => {
                  const on = selectedCategory === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => onSelectCategory(t.key)}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-ink text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                        on
                          ? t.key === 'events' ? 'bg-marigold-400 text-ink' : 'bg-cobalt-500 text-white'
                          : 'bg-white text-ink hover:bg-lilac-100'
                      }`}
                    >
                      {t.label}
                      <span className="ml-1.5 tabular-nums opacity-70">{t.count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative lg:flex-1 w-full">
                <label htmlFor="listing-search" className="sr-only">Search listings</label>
                <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="listing-search"
                  type="text"
                  placeholder="Search by topic, speaker or branch"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-20 py-2.5 bg-paper rounded-full border-2 border-ink text-sm font-medium text-ink placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cobalt-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white bg-ink px-3 py-1.5 rounded-full"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2" role="group" aria-label="Filter by branch">
              {['ALL', ...BRANCH_LIST].map((code) => {
                const on = selectedBranch === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onSelectBranch(code)}
                    aria-pressed={on}
                    title={code === 'ALL' ? 'All branches' : BRANCH_LABEL[code]}
                    className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border-2 text-xs sm:text-sm font-bold transition-colors ${
                      on ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-slate-300 hover:border-ink hover:bg-lilac-100'
                    }`}
                  >
                    {code === 'ALL' ? 'All branches' : code}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
