'use client';

import React from 'react';
import { Workshop } from '../types';
import CapacityTicks from './ui/CapacityTicks';
import RegisterLink, { registrationLink } from './ui/RegisterLink';

const TONES = ['bg-white', 'bg-cobalt-100', 'bg-marigold-100', 'bg-coral-100', 'bg-mint-100'];

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
}

export default function WorkshopCard({ workshop, onSelect }: WorkshopCardProps) {
  const hasCap = workshop.maxCapacity > 0;
  const full = hasCap && workshop.currentRegistered >= workshop.maxCapacity;
  const tone = TONES[workshop.branch.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];
  const tilt = [-1.2, 0.8, -0.6, 1][workshop.branch.length % 4];

  return (
    <article
      className={`pop group relative flex flex-col rounded-[26px] overflow-hidden ${tone}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <button
        type="button"
        onClick={() => onSelect(workshop)}
        className="text-left block"
        aria-label={`Open details for ${workshop.title}`}
      >
        <div className="relative aspect-[4/3] bg-cobalt-900 overflow-hidden border-b-2 border-ink">
          {workshop.posterUrl ? (
            <img
              src={workshop.posterUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 bg-cobalt-500 dots flex items-end p-4">
              <span className="font-display text-7xl leading-none text-white">{workshop.branch}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 flex items-center gap-2 -rotate-3">
            {workshop.branchLogo && (
              <span className="w-9 h-9 rounded-full bg-white border-2 border-ink p-1 flex items-center justify-center">
                <img src={workshop.branchLogo} alt="" className="w-full h-full object-contain" />
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white border-2 border-ink text-sm font-bold text-ink shadow-pop-sm">{workshop.branch}</span>
          </span>
          {full && (
            <span className="absolute top-3 right-3 rotate-6 px-3 py-1 rounded-full bg-coral-500 border-2 border-ink text-sm font-bold text-white shadow-pop-sm">
              Full
            </span>
          )}
        </div>

        <div className="p-5 pb-3">
          
          <h3 className="font-sans font-extrabold text-[1.65rem] text-ink leading-[1.05] tracking-tight line-clamp-3">{workshop.title}</h3>
          <p className="mt-2 text-sm text-ink/80 line-clamp-2 leading-snug">{workshop.tagline}</p>
          {workshop.resourcePerson?.name && (
            <p className="mt-3 text-sm text-ink">
              <span className="font-bold">{workshop.resourcePerson.name}</span>
              {workshop.resourcePerson.company ? <span className="text-ink/70">, {workshop.resourcePerson.company}</span> : null}
            </p>
          )}
          <p className="mt-1 text-sm text-ink/70">
            {[workshop.dates, workshop.venue ? workshop.venue.split('(')[0].trim() : null].filter(Boolean).join(' · ')}
          </p>
        </div>
      </button>

      <div className="mt-auto px-5 pb-5 pt-1 space-y-4">
        {hasCap && <CapacityTicks filled={workshop.currentRegistered} total={workshop.maxCapacity} label="Seats taken" tone="teal" />}
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-2xl text-ink">{workshop.fees || 'Free'}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(workshop)}
              className="px-3.5 py-2 rounded-full bg-white border-2 border-ink text-sm font-bold text-ink hover:bg-lilac-100 transition-colors"
            >
              Details
            </button>
            <RegisterLink url={registrationLink(workshop)} className="px-4 py-2 rounded-full border-2 border-ink bg-marigold-400 hover:bg-marigold-300 text-sm font-bold text-ink transition-colors" />
          </div>
        </div>
      </div>
    </article>
  );
}
