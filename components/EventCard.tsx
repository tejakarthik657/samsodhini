'use client';

import React from 'react';
import { FestEvent } from '../types';
import CapacityTicks from './ui/CapacityTicks';
import RegisterLink, { registrationLink } from './ui/RegisterLink';

const TONES = ['bg-white', 'bg-cobalt-100', 'bg-marigold-100', 'bg-coral-100', 'bg-mint-100'];

interface EventCardProps {
  event: FestEvent;
  onSelect: (event: FestEvent) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const lead = event.coordinators?.[0] || event.juniorCoordinators?.[0];
  const hasCap = event.maxSlots > 0;
  const full = hasCap && event.currentRegistered >= event.maxSlots;
  const tone = TONES[event.branch.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];
  const tilt = [-1.2, 0.8, -0.6, 1][event.branch.length % 4];

  return (
    <article
      className={`pop group relative flex flex-col rounded-[26px] overflow-hidden ${tone}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <button
        type="button"
        onClick={() => onSelect(event)}
        className="text-left block"
        aria-label={`Open details for ${event.title}`}
      >
        <div className="relative aspect-[4/3] bg-cobalt-900 overflow-hidden border-b-2 border-ink">
          {event.posterUrl ? (
            <img
              src={event.posterUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 bg-marigold-400 dots-ink flex items-end p-4">
              <span className="font-display text-7xl leading-none text-ink">{event.branch}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 flex items-center gap-2 -rotate-3">
            {event.branchLogo && (
              <span className="w-9 h-9 rounded-full bg-white border-2 border-ink p-1 flex items-center justify-center">
                <img src={event.branchLogo} alt="" className="w-full h-full object-contain" />
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white border-2 border-ink text-sm font-bold text-ink shadow-pop-sm">{event.branch}</span>
          </span>
          {full && (
            <span className="absolute top-3 right-3 rotate-6 px-3 py-1 rounded-full bg-coral-500 border-2 border-ink text-sm font-bold text-white shadow-pop-sm">
              Full
            </span>
          )}
        </div>

        <div className="p-5 pb-3">
          <p className="inline-block px-2.5 py-1 rounded-full bg-white border-2 border-ink text-xs font-bold text-ink">{event.category}</p>
          <h3 className="mt-2 font-sans font-extrabold text-[1.65rem] text-ink leading-[1.05] tracking-tight line-clamp-3">{event.title}</h3>
          <p className="mt-2 text-sm text-ink/80 line-clamp-2 leading-snug">{event.tagline}</p>
          {lead?.name && (
            <p className="mt-3 text-sm text-ink">
              <span className="text-ink/70">Lead: </span>
              <span className="font-bold">{lead.name}</span>
            </p>
          )}
          <p className="mt-1 text-sm text-ink/70">
            {[event.teamSize, event.venue ? event.venue.split('(')[0].trim() : null].filter(Boolean).join(' · ')}
          </p>
        </div>
      </button>

      <div className="mt-auto px-5 pb-5 pt-1 space-y-4">
        {hasCap && <CapacityTicks filled={event.currentRegistered} total={event.maxSlots} label="Slots taken" tone="saffron" />}
        <div className="flex items-center justify-between gap-3">
          <div className="leading-tight">
            <span className="block text-xs font-semibold text-ink/70">Prize pool</span>
            <span className="font-display text-2xl text-ink">{event.prizePool?.total || 'To be announced'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(event)}
              className="px-3.5 py-2 rounded-full bg-white border-2 border-ink text-sm font-bold text-ink hover:bg-lilac-100 transition-colors"
            >
              Rules
            </button>
            <RegisterLink url={registrationLink(event)} className="px-4 py-2 rounded-full border-2 border-ink bg-cobalt-500 hover:bg-cobalt-600 text-white text-sm font-bold text-white transition-colors" />
          </div>
        </div>
      </div>
    </article>
  );
}
