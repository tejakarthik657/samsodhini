'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Linkedin, Download, Share2, Phone, Check } from 'lucide-react';
import { Workshop, FestEvent } from '../types';
import CapacityTicks from './ui/CapacityTicks';
import RegisterLink, { registrationLink } from './ui/RegisterLink';

interface NetflixDetailModalProps {
  item: Workshop | FestEvent | null;
  onClose: () => void;
}

type Tab = 'syllabus' | 'rules' | 'takeaways' | 'gallery';

export default function NetflixDetailModal({ item, onClose }: NetflixDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('syllabus');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setActiveTab('syllabus');
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const isWorkshop = 'isFlagship' in item;
  const ws = item as Workshop;
  const ev = item as FestEvent;
  const accent = isWorkshop ? 'bg-cobalt-500' : 'bg-marigold-400';
  const railBg = isWorkshop ? 'bg-cobalt-500 text-white' : 'bg-marigold-400 text-ink';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maxCap = isWorkshop ? ws.maxCapacity : ev.maxSlots;
  const currentReg = item.currentRegistered;
  const hasCap = maxCap > 0;
  const seatsLeft = Math.max(0, maxCap - currentReg);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'syllabus', label: isWorkshop ? 'Syllabus' : 'Rounds' },
    { key: 'rules', label: isWorkshop ? 'Prerequisites' : 'Rules' },
    { key: 'takeaways', label: isWorkshop ? 'You will get' : 'Prizes' },
    { key: 'gallery', label: 'Photos' },
  ];

  const facts: [string, string][] = [
    [isWorkshop ? 'Date' : 'Day', isWorkshop ? ws.dates : ev.day],
    ['Time', item.time],
    ['Venue', item.venue],
    [isWorkshop ? 'Fee' : 'Prize pool', isWorkshop ? ws.fees : ev.prizePool?.total],
  ];

  const listItems = isWorkshop
    ? Array.isArray(ws.prerequisites) ? ws.prerequisites : []
    : Array.isArray(ev.rules) ? ev.rules : [];

  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <li className="py-3 flex gap-3 text-sm text-slate-800 leading-relaxed">
      <span className="w-2 h-2 mt-1.5 rotate-45 bg-marigold-400 border border-ink shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white border-2 border-ink shadow-pop-lg sm:rounded-[28px] overflow-hidden z-10 my-auto grid md:grid-cols-12 max-h-screen sm:max-h-[92vh] animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-ink hover:bg-cobalt-800 text-white border-2 border-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Poster rail */}
        <div className={`md:col-span-5 ${railBg} border-b-2 md:border-b-0 md:border-r-2 border-ink flex flex-col md:max-h-[92vh] md:overflow-y-auto`}>
          <div className="relative aspect-[4/5] md:aspect-auto md:flex-1 md:min-h-[320px] bg-cobalt-900 border-b-2 border-ink">
            {item.posterUrl ? (
              <img src={item.posterUrl} alt={`${item.title} poster`} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 blueprint flex items-end p-6">
                <span className="font-display text-8xl leading-none text-white">
                  {item.branch}
                </span>
              </div>
            )}
          </div>

          <div className="p-5 space-y-4">
            {hasCap && <CapacityTicks
              filled={currentReg}
              total={maxCap}
              label={isWorkshop ? 'Seats taken' : 'Slots taken'}
              tone={isWorkshop ? 'teal' : 'saffron'}
              onDark={isWorkshop}
            />}
            {hasCap && (
            <p className="text-sm font-semibold">
              {seatsLeft > 0 ? `${seatsLeft} ${seatsLeft === 1 ? 'place' : 'places'} left` : 'Registration is full'}
            </p>
            )}
            <RegisterLink url={registrationLink(item)} label={isWorkshop ? 'Register for this workshop' : 'Register your team'} className="pop w-full py-3 rounded-full bg-ink text-white font-bold text-sm" disabledClassName="block w-full py-3 rounded-full border-2 border-dashed border-current text-center text-sm font-bold opacity-80" />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className="py-2.5 rounded-full bg-white text-ink border-2 border-ink text-sm font-bold flex items-center justify-center gap-2 hover:bg-lilac-100 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Link copied' : 'Copy link'}
              </button>
              {item.posterUrl && (
                <a
                  href={item.posterUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="py-2.5 rounded-full bg-white text-ink border-2 border-ink text-sm font-bold flex items-center justify-center gap-2 hover:bg-lilac-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Poster
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-7 p-5 sm:p-8 md:max-h-[92vh] overflow-y-auto">
          <div className="flex items-center gap-2 pr-12">
            {item.branchLogo && (
              <span className="w-8 h-8 rounded-full border border-slate-200 p-1 flex items-center justify-center bg-white">
                <img src={item.branchLogo} alt="" className="w-full h-full object-contain" />
              </span>
            )}
            <span className={`px-3 py-1 rounded-full border-2 border-ink text-xs font-bold ${accent} ${isWorkshop ? 'text-white' : 'text-ink'}`}>
              {item.branch}
            </span>
            <span className="text-sm text-slate-600">{isWorkshop ? 'Day 1 workshop' : `Day 2 · ${ev.category}`}</span>
          </div>

          <h2 className="mt-4 font-sans font-extrabold tracking-tight text-3xl sm:text-4xl text-ink leading-[1.05]">{item.title}</h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">{item.tagline}</p>

          <dl className="mt-6 grid grid-cols-2 border-y border-slate-200 divide-slate-200 [&>div]:py-3 [&>div:nth-child(odd)]:pr-4 [&>div:nth-child(even)]:pl-4 [&>div:nth-child(even)]:border-l [&>div:nth-child(n+3)]:border-t border-slate-200">
            {facts.filter(([label, value]) => value || (label !== 'Time' && label !== 'Venue')).map(([label, value]) => (
              <div key={label} className="min-w-0 border-slate-200">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900 break-words">{value || 'To be announced'}</dd>
              </div>
            ))}
          </dl>

          {item.description && item.description.trim() && (
            <div className="mt-6 rounded-2xl border-2 border-ink bg-lilac-100 p-4 sm:p-5">
              <h3 className="font-display text-xl text-ink">Details and contacts</h3>
              <p className="mt-2 text-sm text-ink/90 leading-relaxed whitespace-pre-line break-words">{item.description}</p>
            </div>
          )}

          {isWorkshop && ws.resourcePerson?.name && (
            <div className="mt-6 flex items-start gap-4">
              {ws.resourcePerson.avatar ? (
                <img src={ws.resourcePerson.avatar} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-ink text-white font-display text-2xl flex items-center justify-center shrink-0">
                  {ws.resourcePerson.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Resource person</p>
                <h3 className="font-display text-2xl text-ink leading-tight">{ws.resourcePerson.name}</h3>
                <p className="text-sm text-slate-700">
                  {[ws.resourcePerson.designation, ws.resourcePerson.company].filter(Boolean).join(', ')}
                </p>
                {ws.resourcePerson.bio && (
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-3">{ws.resourcePerson.bio}</p>
                )}
                {ws.resourcePerson.linkedin && (
                  <a
                    href={ws.resourcePerson.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn profile
                  </a>
                )}
              </div>
            </div>
          )}

          {!isWorkshop && Array.isArray(ev.juniorCoordinators) && ev.juniorCoordinators.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-xl text-ink">Contacts</h3>
              <ul className="mt-2 grid sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-slate-200">
                {ev.juniorCoordinators.map((c, i) => (
                  <li key={i} className="py-2 text-sm">
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-ink">
                        <Phone className="w-3.5 h-3.5" /> {c.phone}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <div role="tablist" className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={activeTab === t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 rounded-full border-2 border-ink text-sm font-bold whitespace-nowrap transition-colors ${
                    activeTab === t.key ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-lilac-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div role="tabpanel" className="pt-2">
              {activeTab === 'syllabus' && (
                <ul className="divide-y divide-slate-200">
                  {isWorkshop ? (
                    Array.isArray(ws.syllabus) && ws.syllabus.length > 0 ? (
                      ws.syllabus.map((slot: any, i: number) => {
                        const isObj = typeof slot === 'object' && slot !== null;
                        const topic = isObj ? slot.topic || slot.module || slot.title || `Module ${i + 1}` : slot;
                        return (
                          <li key={i} className="py-3 grid grid-cols-[6rem_1fr] gap-4 text-sm">
                            <span className="font-semibold text-slate-900 tabular-nums">
                              {isObj && slot.time ? slot.time : `Module ${i + 1}`}
                            </span>
                            <span>
                              <span className="block font-semibold text-slate-900">{topic}</span>
                              {isObj && slot.description && (
                                <span className="block mt-0.5 text-slate-600 leading-relaxed">{slot.description}</span>
                              )}
                            </span>
                          </li>
                        );
                      })
                    ) : (
                      <p className="py-4 text-sm text-slate-600">The detailed syllabus will be published before the workshop.</p>
                    )
                  ) : Array.isArray(ev.rounds) && ev.rounds.length > 0 ? (
                    ev.rounds.map((round: any, i: number) => (
                      <li key={i} className="py-3 grid grid-cols-[6rem_1fr] gap-4 text-sm">
                        <span className="font-semibold text-slate-900">Round {round.roundNumber || i + 1}</span>
                        <span>
                          <span className="block font-semibold text-slate-900">{round.name || `Round ${i + 1}`}</span>
                          {round.description && (
                            <span className="block mt-0.5 text-slate-600 leading-relaxed">{round.description}</span>
                          )}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className="py-4 text-sm text-slate-600">Round details will be shared with registered teams.</p>
                  )}
                </ul>
              )}

              {activeTab === 'rules' && (
                <ul className="divide-y divide-slate-200">
                  {listItems.length > 0 ? (
                    listItems.map((r, i) => <Bullet key={i}>{r}</Bullet>)
                  ) : (
                    <p className="py-4 text-sm text-slate-600">Bring your college ID card. The symposium code of conduct applies.</p>
                  )}
                </ul>
              )}

              {activeTab === 'takeaways' &&
                (isWorkshop ? (
                  <ul className="divide-y divide-slate-200">
                    {Array.isArray(ws.takeaways) && ws.takeaways.length > 0 ? (
                      ws.takeaways.map((t, i) => <Bullet key={i}>{t}</Bullet>)
                    ) : (
                      <p className="py-4 text-sm text-slate-600">Every attendee receives a certificate of participation.</p>
                    )}
                  </ul>
                ) : (
                  <dl className="grid grid-cols-3 gap-4 py-4">
                    {[
                      ['First', ev.prizePool?.first],
                      ['Second', ev.prizePool?.second],
                      ['Third', ev.prizePool?.third],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, v]) => (
                        <div key={label as string}>
                          <dt className="text-xs text-slate-500">{label}</dt>
                          <dd className="font-display text-2xl sm:text-3xl text-ink">{v}</dd>
                        </div>
                      ))}
                  </dl>
                ))}

              {activeTab === 'gallery' && (
                <div className="py-4 text-sm text-slate-600 space-y-3">
                  <p>Photos from this {isWorkshop ? 'workshop' : 'competition'} are added to the gallery after it ends.</p>
                  <a
                    href="/gallery"
                    className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-900"
                  >
                    <ExternalLink className="w-4 h-4" /> Open the gallery
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
