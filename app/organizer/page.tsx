"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import OrganizerDashboard from '../../components/OrganizerDashboard';
import Footer from '../../components/Footer';

export default function OrganizerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 w-full pt-28 sm:pt-32 pb-20">
        <OrganizerDashboard />
      </main>

      <Footer />
    </div>
  );
}
