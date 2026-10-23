'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import LegacyVault from '../../components/LegacyVault';
import Footer from '../../components/Footer';
import PageHeader from '../../components/ui/PageHeader';

export default function LegacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />
      <PageHeader
        title="Heritage vault"
        description="Proceedings, keynote abstracts and souvenir magazines from past editions, kept for the students who come next."
        tone="saffron"
      />

      <main className="flex-1 w-full">
        <LegacyVault showHeading={false} />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Why an archive</h2>
          <p className="mt-3 text-base text-slate-700 leading-relaxed">
            Symposium records used to live in chat groups and expiring drive links. Keeping proceedings, keynotes,
            delegate rosters and souvenir magazines in one repository means future alumni, researchers and student
            leaders can still find them decades from now.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
