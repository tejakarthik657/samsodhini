'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import OrganizerDashboard from '../../components/OrganizerDashboard';
import Footer from '../../components/Footer';

export default function OrganizerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 w-full pt-28 sm:pt-36 pb-16">
        <OrganizerDashboard />
      </main>

      <Footer />
    </div>
  );
}
