'use client';

import React from 'react';
import { 
  Trophy, 
  Users, 
  MapPin, 
  ArrowUpRight
} from 'lucide-react';
import { FestEvent } from '../types';

interface EventCardProps {
  event: FestEvent;
  onSelect: (event: FestEvent) => void;
  onQuickRegister: (event: FestEvent) => void;
}

export default function EventCard({ event, onSelect, onQuickRegister }: EventCardProps) {
  const fillPercentage = Math.min(100, Math.round((event.currentRegistered / event.maxSlots) * 100));

  return (
    <div 
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer bento-card"
      onClick={() => onSelect(event)}
    >
      <div>
        {/* Poster Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 flex items-center justify-center">
          {event.posterUrl ? (
            <img 
              src={event.posterUrl} 
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Trophy className="w-10 h-10 text-slate-500 mb-1" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Day 2 Challenge</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-black/30" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {event.branchLogo && (
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white p-0.5 shadow-xs border border-white/70 shrink-0">
                  <img src={event.branchLogo} alt={event.branch} className="w-full h-full object-contain" />
                </div>
              )}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-white text-slate-900 shadow-xs">
                {event.branch}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-900/80 backdrop-blur-md text-purple-100 border border-purple-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>Day 2 Arena</span>
            </span>
          </div>

          {/* Prize Pool Tag on Poster */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold text-[11px]">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Pool: <strong className="text-amber-200">{event.prizePool?.total || 'INR 15,000'}</strong></span>
            </div>

            <span className="font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px]">
              {event.day || 'Day 2'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5">
          <div>
            <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 mb-1.5">
              {event.category}
            </div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
              {event.tagline}
            </p>
          </div>

          {/* Student Coordinator Preview */}
          {(event.coordinators?.length > 0 || event.juniorCoordinators?.length > 0) && (
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              {(event.coordinators?.[0] || event.juniorCoordinators?.[0])?.avatar ? (
                <img 
                  src={(event.coordinators?.[0] || event.juniorCoordinators?.[0])?.avatar} 
                  alt={(event.coordinators?.[0] || event.juniorCoordinators?.[0])?.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                  {((event.coordinators?.[0] || event.juniorCoordinators?.[0])?.name || 'C')[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-[11px] truncate">
                  Lead: {(event.coordinators?.[0] || event.juniorCoordinators?.[0])?.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {(event.coordinators?.[0] || event.juniorCoordinators?.[0])?.role || 'Coordinator'}
                </p>
              </div>
            </div>
          )}

          {/* Logistics */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.teamSize || '1 to 2 Members'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate" title={event.venue}>{event.venue ? event.venue.split('(')[0] : 'Campus Lab'}</span>
            </div>
          </div>

          {/* Slots Fill Progress */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Slots Claimed</span>
              <span>{event.currentRegistered} / {event.maxSlots}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-900 rounded-full transition-all duration-500"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(event);
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
        >
          <span>View Rules</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickRegister(event);
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-purple-900 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <span>Register Team</span>
        </button>
      </div>
    </div>
  );
}
