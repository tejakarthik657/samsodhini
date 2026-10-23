"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import Marquee from './ui/Marquee';

const ASSOCIATIONS = [
  { code: 'CSE', name: 'CSEA' }, { code: 'CSM', name: 'CSMA' }, { code: 'CSN', name: 'CSENA' }, { code: 'IT', name: 'ITA' },
  { code: 'ECE', name: 'ECEA' }, { code: 'ECV', name: 'ECVA' }, { code: 'EEE', name: 'EEEA' }, { code: 'MECH', name: 'MESA' },
  { code: 'CIVIL', name: 'CEA' }, { code: 'I2RE', name: 'SAIL I2RE' }, { code: 'MBA', name: 'MBA' },
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkClass = 'text-white/85 hover:text-marigold-300 transition-colors';

  return (
    <footer className="bg-ink text-white relative overflow-hidden">
      <Marquee
        items={['See you in Warangal', 'Build something', 'Two days', 'Thirty events']}
        reverse
        className="bg-marigold-400 text-ink border-b-2 border-ink"
        textClass="text-4xl sm:text-6xl"
      />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-white border-2 border-white overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src="/Sumshodhini26icon.png"
                  alt=""
                  className="w-full h-full object-contain scale-110"
                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
              </span>
              <span className="font-display uppercase text-3xl sm:text-4xl leading-none">Sumshodhini</span>
            </div>
            <p className="mt-5 text-base text-white/80 leading-snug max-w-sm">
              The national level technical symposium of Kakatiya Institute of Technology &amp; Science, Warangal.
              Autonomous institute under Kakatiya University, NAAC A+.
            </p>
            <address className="mt-5 not-italic text-sm text-white/80 space-y-1">
              <p>Yerragattu Hillock, Bheemaram, Warangal 506015, Telangana</p>
              <p><a href="mailto:sumshodhini@kitsw.ac.in" className={linkClass}>sumshodhini@kitsw.ac.in</a></p>
              <p><a href="tel:+918702564888" className={linkClass}>+91 870 2564888</a></p>
            </address>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <h3 className="font-display text-2xl text-marigold-400">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-base font-medium">
              <li><Link href="/#workshops" className={linkClass}>Day 1 workshops</Link></li>
              <li><Link href="/#events" className={linkClass}>Day 2 competitions</Link></li>
              <li><Link href="/#schedule" className={linkClass}>Schedule</Link></li>
              <li><Link href="/gallery" className={linkClass}>Gallery</Link></li>
              <li><Link href="/#heritage" className={linkClass}>Heritage vault</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h3 className="font-display text-2xl text-marigold-400">Associations</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {ASSOCIATIONS.map((a, i) => (
                <li
                  key={a.code}
                  className={`px-3.5 py-1.5 rounded-full border-2 border-white/80 text-sm font-bold ${
                    i % 3 === 0 ? 'bg-cobalt-500' : i % 3 === 1 ? 'bg-marigold-400 text-ink border-marigold-400' : 'bg-transparent'
                  }`}
                  title={a.code}
                >
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t-2 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/70">
          <p>© Kakatiya Institute of Technology &amp; Science, Warangal</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:ml-auto">
          <Link
            href="/organizer"
            className="inline-flex items-center px-4 py-2.5 rounded-full border-2 border-white/70 hover:border-marigold-400 hover:text-marigold-300 text-white text-sm font-bold transition-colors"
          >
            Organizer sign in
          </Link>
          <button
            type="button"
            onClick={scrollToTop}
            className="pop inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-ink text-sm font-bold"
          >
            Back to top <ArrowUp className="w-4 h-4" />
          </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
