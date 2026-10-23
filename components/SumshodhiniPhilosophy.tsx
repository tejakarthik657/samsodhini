'use client';

import React, { useState } from 'react';
import ScrollReveal from './ui/ScrollReveal';

const DIMENSIONS = [
  {
    title: 'Exploration',
    tagline: 'Discover what the syllabus does not cover.',
    desc: 'Delegates meet emerging technologies, new system architectures and engineering frontiers that textbooks have not caught up with yet.',
    points: ['Industry-relevant masterclasses', 'Exposure to several tech stacks', 'Research-grade tools and frameworks'],
    bar: 'bg-marigold-400 text-ink',
  },
  {
    title: 'Application',
    tagline: 'Turn classroom theory into working things.',
    desc: 'Knowing a concept and applying it under unfamiliar constraints are different skills. Sumshodhini turns theory into prototypes, running circuits and compiled code.',
    points: ['Hands-on laboratory problem sets', 'Live debugging and rapid prototyping', 'A working system at the end of the day'],
    bar: 'bg-lilac-200 text-ink',
  },
  {
    title: 'Collaboration',
    tagline: 'Work with people from other institutes.',
    desc: 'Students, faculty and domain specialists from engineering colleges across Telangana and India exchange methods and ways of framing problems.',
    points: ['Delegates from multiple institutions', 'Projects that cross branches', 'Faculty and industry mentors'],
    bar: 'bg-mint-300 text-ink',
  },
  {
    title: 'Achievement',
    tagline: 'Leave with proof of what you can do.',
    desc: 'A national stage where technical work earns merit citations, cash prizes and credentials verified by the ISTE chapter.',
    points: ['National recognition', 'ISTE KITSW verified credentials', 'Cash awards and trophies'],
    bar: 'bg-coral-400 text-ink',
  },
  {
    title: 'Leadership',
    tagline: 'Students run the whole event.',
    desc: 'Department associations plan, budget and deliver Sumshodhini themselves, which teaches coordination, crisis handling and accountability.',
    points: ['Association-level autonomy', 'Large-scale operations', 'Institutional stewardship year to year'],
    bar: 'bg-cobalt-300 text-ink',
  },
];

export default function SumshodhiniPhilosophy() {
  const [open, setOpen] = useState(0);

  return (
    <section id="about" className="relative bg-ink text-white py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 dots opacity-40" aria-hidden="true" />
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8">
        <ScrollReveal
          className="font-sans font-extrabold tracking-[-0.035em] text-[2.2rem] sm:text-6xl lg:text-[5.4rem] leading-[1] max-w-6xl"
          text="Students who stopped reading about technology and started building it. Day one is depth, a workshop from every department. Day two is the arena, with national prizes."
        />

        <div className="mt-20 sm:mt-28 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="font-display uppercase text-4xl sm:text-5xl leading-[0.95] text-marigold-400">Five ideas behind it</h2>
            <p className="mt-4 text-base text-white/80 max-w-xs leading-snug">
              Pick one. These are what every workshop and contest is built to deliver.
            </p>
          </div>

          <ul className="lg:col-span-8 space-y-3">
            {DIMENSIONS.map((d, i) => {
              const isOpen = open === i;
              return (
                <li key={d.title}>
                  <div className={`rounded-[22px] border-2 border-ink ${d.bar} overflow-hidden transition-shadow ${isOpen ? 'shadow-[6px_6px_0_0_#FFAB00]' : ''}`}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-8 py-4 sm:py-5"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="text-sm font-bold tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-display text-2xl sm:text-4xl leading-none">{d.title}</span>
                      </span>
                      <span
                        className={`shrink-0 w-10 h-10 rounded-full border-2 border-ink bg-white flex items-center justify-center text-2xl font-bold transition-transform ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-8 pb-6 sm:pb-8 grid sm:grid-cols-2 gap-6 animate-slide-up">
                        <div>
                          <p className="font-sans font-extrabold tracking-tight text-xl sm:text-2xl leading-[1.1]">{d.tagline}</p>
                          <p className="mt-3 text-base leading-snug">{d.desc}</p>
                        </div>
                        <ul className="space-y-2">
                          {d.points.map((pt) => (
                            <li key={pt} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 border-2 border-ink text-sm font-semibold">
                              <span aria-hidden="true">✺</span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
