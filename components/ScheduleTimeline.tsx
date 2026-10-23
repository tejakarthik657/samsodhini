'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  BookOpen, 
  Trophy, 
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { Workshop, FestEvent } from '../types';

interface ScheduleTimelineProps {
  editionYear?: number;
}

export default function ScheduleTimeline({ editionYear = 2026 }: ScheduleTimelineProps) {
  const [activeDay, setActiveDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRealData() {
      setLoading(true);
      try {
        const [wsRes, evRes] = await Promise.all([
          fetch(`/api/workshops?year=${editionYear}`),
          fetch(`/api/events?year=${editionYear}`)
        ]);
        const wsJson = await wsRes.json();
        const evJson = await evRes.json();

        if (wsJson.success && wsJson.data) {
          setWorkshops(wsJson.data);
        } else {
          setWorkshops([]);
        }

        if (evJson.success && evJson.data) {
          setEvents(evJson.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching dynamic schedule:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRealData();
  }, [editionYear]);

  // Filter Day 1 (Workshops) by branch
  const filteredWorkshops = workshops.filter((ws) => 
    selectedBranch === 'ALL' || ws.branch === selectedBranch
  );

  // Filter Day 2 (Events) by branch
  const filteredEvents = events.filter((ev) => 
    selectedBranch === 'ALL' || ev.branch === selectedBranch
  );

  return (
    <div className="space-y-8">
      {/* 2-Day Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="grid grid-cols-2 gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveDay('Day 1')}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center ${
              activeDay === 'Day 1'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Day 1: Flagship Masterclasses</span>
            <span className="sm:hidden">Day 1: Workshops</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 font-bold shrink-0">
              {workshops.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDay('Day 2')}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center ${
              activeDay === 'Day 2'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Day 2: National Arena</span>
            <span className="sm:hidden">Day 2: Contests</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 font-bold shrink-0">
              {events.length}
            </span>
          </button>
        </div>

        {/* Edition Context Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Synchronized with Edition {editionYear} Records</span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading official symposium schedule...</p>
        </div>
      ) : activeDay === 'Day 1' ? (
        /* DAY 1: WORKSHOPS ITINERARY */
        filteredWorkshops.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs max-w-2xl mx-auto">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900">
              No Day 1 Flagship Masterclasses Registered Yet for Edition {editionYear}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              When academic departments publish their flagship workshop via the Organizer Portal, verified lab venues, resource persons, and schedule timings will appear here automatically.
            </p>
            <div className="mt-5">
              <Link
                href="/organizer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Publish Workshop as Branch Organizer</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 font-medium px-1">
              <span>Showing {filteredWorkshops.length} department flagship workshop{filteredWorkshops.length > 1 ? 's' : ''}</span>
              <span className="font-mono text-[10px] sm:text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 self-start sm:self-auto">
                DAY 1 LAB ACCESS • ISTE ACCREDITED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkshops.map((ws) => (
                <div
                  key={ws.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                          {ws.branch}
                        </span>
                        {ws.associationShort && (
                          <span className="text-[10px] font-bold text-slate-500">
                            {ws.associationShort}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ws.time || '09:30 AM - 04:30 PM'}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-950 leading-snug">
                      {ws.title}
                    </h4>

                    {ws.venue && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Venue: {ws.venue}</span>
                      </p>
                    )}

                    {ws.resourcePerson?.name && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Resource Person: <strong className="text-slate-800">{ws.resourcePerson.name}</strong> {ws.resourcePerson.company ? `(${ws.resourcePerson.company})` : ''}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Fee: <strong className="text-slate-900">{ws.fees || 'Free'}</strong>
                    </span>
                    <Link
                      href={`/workshops#${ws.slug}`}
                      className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 text-xs"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* DAY 2: COMPETITIONS ITINERARY */
        filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs max-w-2xl mx-auto">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900">
              No Day 2 Technical Arenas Registered Yet for Edition {editionYear}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              When academic departments publish their hackathons, robotics challenges, paper presentations, and project expos, their timings and laboratory locations will be populated here in real-time.
            </p>
            <div className="mt-5">
              <Link
                href="/organizer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold shadow-xs hover:bg-purple-800 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5 text-purple-300" />
                <span>Create Competition as Organizer</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Showing {filteredEvents.length} national competition{filteredEvents.length > 1 ? 's' : ''}</span>
              <span className="font-mono text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                DAY 2 ARENA • CASH PRIZES & CITATIONS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                          {ev.branch}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {ev.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ev.time || '10:00 AM - 01:00 PM'}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-950 leading-snug">
                      {ev.title}
                    </h4>

                    {ev.venue && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Venue: {ev.venue}</span>
                      </p>
                    )}

                    {ev.prizePool?.total && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Prize Pool: <strong className="text-slate-900">{ev.prizePool.total}</strong></span>
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Team: <strong className="text-slate-900">{ev.teamSize || '1-2 Members'}</strong>
                    </span>
                    <Link
                      href={`/events#${ev.slug}`}
                      className="text-purple-700 hover:text-purple-900 font-bold inline-flex items-center gap-1 text-xs"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
