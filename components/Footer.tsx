'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  BookOpen, 
  Trophy, 
  Calendar, 
  Archive,
  ShieldCheck,
  ArrowUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const associations = [
    { code: 'CSE', name: 'ACE', full: 'Association of Computer Engineers' },
    { code: 'CSM', name: 'AIMS', full: 'AI & ML Student Society' },
    { code: 'CSD', name: 'DATA', full: 'Data Science Association' },
    { code: 'IT', name: 'ITA', full: 'Information Technology Association' },
    { code: 'ECE', name: 'ECLAT', full: 'Electronics & Communication Engineers' },
    { code: 'EEE', name: 'ELECTRA', full: 'Electrical Engineering Association' },
    { code: 'MECH', name: 'MESA', full: 'Mechanical Students Association' },
    { code: 'CIVIL', name: 'CEA', full: 'Civil Engineering Association' },
  ];

  return (
    <footer className="relative bg-[#FAF9F6] pt-16 pb-12 sm:pb-16 overflow-hidden border-t border-slate-200/80">
      {/* Massive Background Watermark Typography */}
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[15vw] font-black tracking-tighter text-slate-900/[0.025] leading-none whitespace-nowrap"
      >
        SUMSHODHINI
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Luxury White Card Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.06)] p-8 sm:p-14 space-y-12">
          {/* Top Brand Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs p-2 flex items-center justify-center shrink-0">
                <img 
                  src="/Sumshodhini26icon.png" 
                  alt="Sumshodhini Emblem" 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    SUMSHODHINI
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    KITSW
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  National Science & Technology Symposium • Kakatiya Institute of Technology & Science, Warangal
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                ISTE Student Chapter
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                Technical Club
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Student Activity Centre (SAC)
              </span>
            </div>
          </div>

          {/* Bento Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">
            {/* Column 1: Institutional Credentials & Contact */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                INSTITUTIONAL HEADQUARTERS
              </span>
              <p className="text-slate-600 leading-relaxed font-normal">
                Organized under the patronage of Kakatiya Institute of Technology & Science, Warangal (Autonomous Institute under Kakatiya University, Accredited by NAAC with &apos;A+&apos; Grade).
              </p>

              <div className="space-y-2 text-[11px] text-slate-600 font-medium">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Yerragattu Hillock, Bheemaram, Warangal - 506015, Telangana, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>sumshodhini@kitsw.ac.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>+91 870 2564888 • Desk: +91 98480 12345</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Geo-Coordinates: 17.9787° N, 79.5312° E</span>
                </div>
              </div>
            </div>

            {/* Column 2: 8 Department Associations */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                DEPARTMENT ASSOCIATIONS
              </span>
              <div className="grid grid-cols-2 gap-2">
                {associations.map((assoc) => (
                  <div key={assoc.code} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{assoc.code}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {assoc.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate mt-1">{assoc.full}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: 2-Day Structure & Quick Access */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                2-DAY SYMPOSIUM TRACKS
              </span>
              <div className="space-y-2">
                <a 
                  href="#workshops" 
                  className="p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 block transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 text-xs">Day 1: Workshops</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">1/BRANCH</span>
                  </div>
                  <p className="text-[10px] text-blue-700 mt-1">Flagship Masterclasses & Research Labs</p>
                </a>

                <a 
                  href="#events" 
                  className="p-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 block transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950 text-xs">Day 2: Competitions</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">36+ ARENAS</span>
                  </div>
                  <p className="text-[10px] text-purple-700 mt-1">Hackathons, Robotics & Project Expo</p>
                </a>

                <Link 
                  href="/organizer" 
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 block transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                      <span>Organizer Console</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">AUTH</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Branch Organizer Authentication & Management</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Back-to-Top */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Official Symposium Platform • Verified Institutional System</span>
            </div>

            <div className="flex items-center gap-4">
              <span>© Kakatiya Institute of Technology & Science, Warangal</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
