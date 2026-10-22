'use client';

import React from 'react';
import { 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  Users,
  Check,
  BookOpen
} from 'lucide-react';
import { Workshop } from '../types';

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
  onQuickRegister: (workshop: Workshop) => void;
}

export default function WorkshopCard({ workshop, onSelect, onQuickRegister }: WorkshopCardProps) {
  const fillPercentage = Math.min(100, Math.round((workshop.currentRegistered / workshop.maxCapacity) * 100));

  return (
    <div 
      className="group bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer bento-card"
      onClick={() => onSelect(workshop)}
    >
      <div>
        {/* Poster Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 flex items-center justify-center">
          {workshop.posterUrl ? (
            <img 
              src={workshop.posterUrl} 
              alt={workshop.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <BookOpen className="w-10 h-10 text-slate-500 mb-1" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Day 1 Masterclass</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-black/30" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-white text-slate-900 shadow-xs">
              {workshop.branch}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-900/80 backdrop-blur-md text-blue-100 border border-blue-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Day 1 Flagship</span>
            </span>
          </div>

          {/* Bottom Telemetry */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span><strong>{workshop.currentRegistered}</strong> / {workshop.maxCapacity} Enrolled</span>
            </div>

            <span className="font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px]">
              {workshop.fees}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3.5">
          <div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
              {workshop.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
              {workshop.tagline}
            </p>
          </div>

          {/* Keynote Speaker Info */}
          {workshop.resourcePerson && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              {workshop.resourcePerson.avatar ? (
                <img 
                  src={workshop.resourcePerson.avatar} 
                  alt={workshop.resourcePerson.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {(workshop.resourcePerson.name || 'S')[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {workshop.resourcePerson.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate font-medium">
                  {workshop.resourcePerson.company || 'Industry Specialist'}
                </p>
              </div>
            </div>
          )}

          {/* Logistics */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{workshop.dates}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate" title={workshop.venue}>{workshop.venue ? workshop.venue.split('(')[0] : 'Campus Lab'}</span>
            </div>
          </div>

          {/* Capacity Progress */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Capacity</span>
              <span>{fillPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(workshop);
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
        >
          <span>View Dossier</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickRegister(workshop);
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <span>Register Pass</span>
        </button>
      </div>
    </div>
  );
}
