'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workshop, FestEvent } from '../types';
import EmptyState from './ui/EmptyState';

interface ScheduleTimelineProps {
  editionYear?: number;
}

type Row = {
  id: string;
  time: string;
  title: string;
  branch: string;
  tag?: string;
  venue?: string;
  meta?: string;
  href: string;
};

export default function ScheduleTimeline({ editionYear = 2026 }: ScheduleTimelineProps) {
  const [activeDay, setActiveDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRealData() {
      setLoading(true);
      try {
        const [wsRes, evRes] = await Promise.all([
          fetch(`/api/workshops?year=${editionYear}`),
          fetch(`/api/events?year=${editionYear}`),
        ]);
        const wsJson = await wsRes.json();
        const evJson = await evRes.json();
        setWorkshops(wsJson.success && wsJson.data ? wsJson.data : []);
        setEvents(evJson.success && evJson.data ? evJson.data : []);
      } catch (err) {
        console.error('Error fetching dynamic schedule:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRealData();
  }, [editionYear]);

  const day1: Row[] = workshops.map((ws) => ({
    id: ws.id,
    time: ws.time || '',
    title: ws.title,
    branch: ws.branch,
    tag: ws.associationShort,
    venue: ws.venue,
    meta: ws.resourcePerson?.name
      ? `${ws.resourcePerson.name}${ws.resourcePerson.company ? `, ${ws.resourcePerson.company}` : ''}`
      : undefined,
    href: `/workshops#${ws.slug}`,
  }));

  const day2: Row[] = events.map((ev) => ({
    id: ev.id,
    time: ev.time || '',
    title: ev.title,
    branch: ev.branch,
    tag: ev.category,
    venue: ev.venue,
    meta: ev.prizePool?.total ? `Prize pool ${ev.prizePool.total}` : undefined,
    href: `/events#${ev.slug}`,
  }));

  const rows = activeDay === 'Day 1' ? day1 : day2;
  const isDay1 = activeDay === 'Day 1';

  const tabs: { key: 'Day 1' | 'Day 2'; label: string; count: number }[] = [
    { key: 'Day 1', label: 'Day 1 · Workshops', count: day1.length },
    { key: 'Day 2', label: 'Day 2 · Competitions', count: day2.length },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Schedule day" className="flex flex-wrap gap-3">
        {tabs.map((t) => {
          const selected = activeDay === t.key;
          const on = t.key === 'Day 1' ? 'bg-cobalt-500 text-white' : 'bg-marigold-400 text-ink';
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveDay(t.key)}
              className={`px-5 sm:px-7 py-3 rounded-full border-2 border-ink font-display text-xl sm:text-3xl leading-none transition-all ${
                selected ? `${on} shadow-pop` : 'bg-white text-ink hover:bg-lilac-100'
              }`}
            >
              {t.label}
              <span className="ml-2 font-sans text-sm font-bold align-middle tabular-nums opacity-80">{t.count}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-8">
        {loading ? (
          <div className="py-16 text-center text-base font-semibold text-ink" role="status">
            Loading schedule…
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title={`Nothing scheduled for ${activeDay} yet`}
            body={
              isDay1
                ? 'Once departments publish their workshop, its time, venue and resource person will be listed here.'
                : 'Competition timings and venues will be listed here as departments publish them.'
            }
            primary={{ label: 'Open organizer portal', href: '/organizer' }}
          />
        ) : (
          <ul className="space-y-4">
            {rows.map((row, i) => (
              <li key={row.id}>
                <Link
                  href={row.href}
                  className={`pop group grid grid-cols-1 sm:grid-cols-[13rem_1fr_auto] gap-x-8 gap-y-2 items-center rounded-[22px] px-5 sm:px-7 py-5 ${
                    i % 2 === 0 ? 'bg-white' : isDay1 ? 'bg-cobalt-100' : 'bg-marigold-100'
                  }`}
                >
                  {row.time ? (
                    <span className="inline-flex self-start px-3.5 py-1.5 rounded-full bg-ink text-white text-sm font-bold tabular-nums">{row.time}</span>
                  ) : (
                    <span className="hidden sm:block" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-sans font-extrabold tracking-tight text-2xl sm:text-3xl text-ink leading-[1.05]">{row.title}</span>
                    <span className="mt-1 block text-sm font-medium text-ink/75">
                      {[row.venue, row.meta].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-white border-2 border-ink font-bold">{row.branch}</span>
                    {row.tag && <span className="font-semibold text-ink/75 truncate max-w-[10rem]">{row.tag}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
