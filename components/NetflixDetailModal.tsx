'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  ExternalLink, 
  Linkedin, 
  CheckCircle2, 
  Download, 
  Share2, 
  Phone, 
  FileText,
  Check,
  BookOpen
} from 'lucide-react';
import { Workshop, FestEvent } from '../types';

interface NetflixDetailModalProps {
  item: Workshop | FestEvent | null;
  onClose: () => void;
  onRegisterClick: (item: Workshop | FestEvent) => void;
}

export default function NetflixDetailModal({ item, onClose, onRegisterClick }: NetflixDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'rules' | 'takeaways' | 'gallery'>('syllabus');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const isWorkshop = 'isFlagship' in item;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maxCap = isWorkshop ? (item as Workshop).maxCapacity : (item as FestEvent).maxSlots;
  const currentReg = item.currentRegistered;
  const fillPercentage = Math.min(100, Math.round((currentReg / maxCap) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-5 lg:p-8 animate-fade-in">
      {/* 
        NETFLIX AMBIENT BACKDROP:
        Blown-up poster image with heavy gaussian blur and soft neutral scrim 
      */}
      <div 
        className="fixed inset-0 bg-cover bg-center filter blur-3xl scale-125 opacity-25 transform-gpu transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${item.posterUrl})` }}
      />
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Glass Modal Card */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-4 sm:p-7 max-h-[92vh] sm:max-h-[88vh] overflow-y-auto space-y-5 sm:space-y-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2 pr-8 sm:pr-0">
            <div className="flex items-center gap-1.5">
              {item.branchLogo && (
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white p-0.5 border border-slate-200 shadow-2xs shrink-0">
                  <img src={item.branchLogo} alt={item.branch} className="w-full h-full object-contain" />
                </div>
              )}
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-900 border border-slate-200">
                Department of {item.branch}
              </span>
            </div>

            {isWorkshop ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                Flagship Technical Masterclass
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200">
                National Competition • {(item as FestEvent).category}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 w-full sm:w-auto sm:ml-auto justify-between sm:justify-start">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Live Attendance:</span>
              </span>
              <span><strong>{currentReg}</strong> / {maxCap} Seats</span>
            </span>
          </div>

          {/* Grid Layout: Poster on left, details on right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Poster & Quick Action */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-[4/5] bg-slate-50 flex items-center justify-center">
                {item.posterUrl ? (
                  <img 
                    src={item.posterUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <BookOpen className="w-12 h-12 text-slate-300 mb-2" />
                    <span className="text-xs font-semibold text-slate-600">{item.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1">Official poster can be uploaded via Organizer Console</span>
                  </div>
                )}
              </div>

              {/* Capacity bar */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between items-center mb-1 font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Seats Filled
                  </span>
                  <span>{fillPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 rounded-full"
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>{currentReg} Enrolled</span>
                  <span>{maxCap - currentReg} slots open</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => onRegisterClick(item)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Register for Pass</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShare}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <a
                  href={item.posterUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Poster</span>
                </a>
              </div>
            </div>

            {/* Right Column: Information & Deep Inspection */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal leading-relaxed">
                  {item.tagline}
                </p>
              </div>

              {/* Key Logistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block text-[10px]">Dates</span>
                  <span className="font-semibold text-slate-800">
                    {isWorkshop ? (item as Workshop).dates : (item as FestEvent).day}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[10px]">Time</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {item.time}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[10px]">Venue</span>
                  <span className="font-semibold text-slate-800 truncate block" title={item.venue}>
                    {item.venue}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[10px]">
                    {isWorkshop ? 'Registration' : 'Prize Pool'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {isWorkshop ? (item as Workshop).fees : (item as FestEvent).prizePool.total}
                  </span>
                </div>
              </div>

              {/* SPEAKER SPOTLIGHT (Workshops) */}
              {isWorkshop && (item as Workshop).resourcePerson && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Keynote Speaker and Resource Person
                    </span>
                    {(item as Workshop).resourcePerson?.linkedin && (
                      <a
                        href={(item as Workshop).resourcePerson.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-blue-900"
                      >
                        <Linkedin className="w-3 h-3" />
                        <span>Profile</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    {(item as Workshop).resourcePerson?.avatar ? (
                      <img 
                        src={(item as Workshop).resourcePerson.avatar} 
                        alt={(item as Workshop).resourcePerson.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-300 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                        {((item as Workshop).resourcePerson?.name || 'S')[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900">
                        {(item as Workshop).resourcePerson?.name || 'Domain Specialist'}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {(item as Workshop).resourcePerson?.designation || 'Speaker'} • {(item as Workshop).resourcePerson?.company || 'Industry Leader'}
                      </p>
                      {(item as Workshop).resourcePerson?.bio && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {(item as Workshop).resourcePerson.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* EVENT COORDINATORS */}
              {!isWorkshop && Array.isArray((item as FestEvent).juniorCoordinators) && (item as FestEvent).juniorCoordinators.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Event Coordinators and Contacts
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(item as FestEvent).juniorCoordinators.map((coord, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                        {coord.avatar ? (
                          <img 
                            src={coord.avatar} 
                            alt={coord.name} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                            {(coord.name || 'C')[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{coord.name}</p>
                          {coord.phone && (
                            <a href={`tel:${coord.phone}`} className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" /> {coord.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TABS */}
              <div>
                <div className="flex border-b border-slate-200 gap-3 sm:gap-4 text-xs font-semibold mb-2.5 overflow-x-auto scrollbar-none whitespace-nowrap pb-1">
                  <button
                    onClick={() => setActiveTab('syllabus')}
                    className={`pb-1.5 transition-colors relative ${
                      activeTab === 'syllabus' 
                        ? 'text-slate-900 border-b-2 border-slate-900 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {isWorkshop ? 'Syllabus and Modules' : 'Competition Rounds'}
                  </button>

                  <button
                    onClick={() => setActiveTab('rules')}
                    className={`pb-1.5 transition-colors relative ${
                      activeTab === 'rules' 
                        ? 'text-slate-900 border-b-2 border-slate-900 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {isWorkshop ? 'Prerequisites' : 'Rules'}
                  </button>

                  <button
                    onClick={() => setActiveTab('takeaways')}
                    className={`pb-1.5 transition-colors relative ${
                      activeTab === 'takeaways' 
                        ? 'text-slate-900 border-b-2 border-slate-900 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {isWorkshop ? 'Deliverables' : 'Prize Breakdown'}
                  </button>

                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`pb-1.5 transition-colors relative ${
                      activeTab === 'gallery' 
                        ? 'text-slate-900 border-b-2 border-slate-900 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Archive and Drive
                  </button>
                </div>

                {/* Tab: Syllabus */}
                {activeTab === 'syllabus' && (
                  <div className="space-y-2">
                    {isWorkshop ? (
                      Array.isArray((item as Workshop).syllabus) && (item as Workshop).syllabus.length > 0 ? (
                        (item as Workshop).syllabus.map((slot: any, index: number) => {
                          const isObj = typeof slot === 'object' && slot !== null;
                          const topicTitle = isObj ? (slot.topic || slot.module || slot.title || `Module ${index + 1}`) : slot;
                          const timeText = isObj ? slot.time : `Module ${index + 1}`;
                          const descText = isObj ? slot.description : '';
                          return (
                            <div key={index} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                              {timeText && (
                                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                                  {timeText}
                                </span>
                              )}
                              <h5 className="font-bold text-slate-900 mt-0.5">{topicTitle}</h5>
                              {descText && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{descText}</p>}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 italic p-3">Detailed curriculum modules published prior to event commencement.</p>
                      )
                    ) : (
                      Array.isArray((item as FestEvent).rounds) && (item as FestEvent).rounds.length > 0 ? (
                        (item as FestEvent).rounds.map((round: any, idx: number) => {
                          const roundNum = round.roundNumber || idx + 1;
                          const roundName = round.name || `Round ${roundNum}`;
                          const roundDesc = round.description || '';
                          return (
                            <div key={roundNum} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                                Round {roundNum}
                              </span>
                              <h5 className="font-bold text-slate-900 mt-0.5">{roundName}</h5>
                              {roundDesc && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{roundDesc}</p>}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 italic p-3">Multiple screening and elimination rounds scheduled on the day.</p>
                      )
                    )}
                  </div>
                )}

                {/* Tab: Rules */}
                {activeTab === 'rules' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    {(isWorkshop
                      ? (Array.isArray((item as Workshop).prerequisites) ? (item as Workshop).prerequisites : [])
                      : (Array.isArray((item as FestEvent).rules) ? (item as FestEvent).rules : [])
                    ).length > 0 ? (
                      (isWorkshop
                        ? (item as Workshop).prerequisites
                        : (item as FestEvent).rules
                      ).map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-relaxed">{rule}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">College identity card mandatory. General symposium code of conduct applies.</p>
                    )}
                  </div>
                )}

                {/* Tab: Takeaways */}
                {activeTab === 'takeaways' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    {isWorkshop ? (
                      Array.isArray((item as Workshop).takeaways) && (item as Workshop).takeaways.length > 0 ? (
                        (item as Workshop).takeaways.map((takeaway, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Award className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                            <span className="text-slate-700 font-medium">{takeaway}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">Certificate of participation and digital learning credentials issued to all attendees.</p>
                      )
                    ) : (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">1st Prize</span>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">{(item as FestEvent).prizePool?.first || 'INR 10,000'}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">2nd Prize</span>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">{(item as FestEvent).prizePool?.second || 'INR 5,000'}</p>
                        </div>
                        {(item as FestEvent).prizePool?.third && (
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] font-bold text-slate-500 uppercase block">3rd Prize</span>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{(item as FestEvent).prizePool.third}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Gallery */}
                {activeTab === 'gallery' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                    <p className="text-slate-600 text-xs">
                      Post-event high-resolution photos and documentation are preserved in the permanent institutional repository.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="https://drive.google.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                        <span>Google Drive Media Folder</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
