'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import LegacyVault from '../../components/LegacyVault';
import Footer from '../../components/Footer';
import { ShieldCheck, Archive } from 'lucide-react';

export default function LegacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 w-full pt-28 sm:pt-36 pb-16">
        <LegacyVault />

        {/* Institutional Charter */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Institutional Digital Charter
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              50-Year Heritage & Pedagogy Preservation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Samshodhani is engineered to replace ephemeral WhatsApp groups and broken Google Drive links. 
              By archiving symposium proceedings, resource person keynotes, delegate rosters, 
              and souvenir magazines into the central repository, KITSW ensures five decades of engineering pedagogy 
              remains accessible to future alumni, researchers, and student leaders.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
