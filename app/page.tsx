'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SumshodhiniPhilosophy from '../components/SumshodhiniPhilosophy';
import WorkshopCard from '../components/WorkshopCard';
import EventCard from '../components/EventCard';
import ScheduleTimeline from '../components/ScheduleTimeline';
import LegacyVault from '../components/LegacyVault';
import NetflixDetailModal from '../components/NetflixDetailModal';
import RegistrationModal from '../components/RegistrationModal';
import Footer from '../components/Footer';
import { 
  Workshop, 
  FestEvent,
  Edition,
  GalleryItem,
  StudentBodyPoster
} from '../types';

import { 
  BookOpen, 
  Trophy, 
  ShieldCheck,
  Archive,
  Camera,
  ArrowRight,
  Award,
  Users,
  Maximize2,
  X,
  ExternalLink,
  Download
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'workshops' | 'events'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real data state from Neon DB
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>([]);
  const [studentBodyPosters, setStudentBodyPosters] = useState<StudentBodyPoster[]>([]);
  const [activePosterModal, setActivePosterModal] = useState<StudentBodyPoster | null>(null);
  const [studentBodyFilter, setStudentBodyFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [inspectItem, setInspectItem] = useState<Workshop | FestEvent | null>(null);
  const [registerItem, setRegisterItem] = useState<Workshop | FestEvent | null>(null);

  // Fetch initial editions
  useEffect(() => {
    async function loadEditions() {
      try {
        const res = await fetch('/api/editions');
        const json = await res.json();
        if (json.success && json.data) {
          setEditions(json.data);
          if (json.activeEdition) {
            setSelectedYear(json.activeEdition.year);
          }
        }
      } catch (err) {
        console.error('Error fetching editions:', err);
      }
    }
    loadEditions();
  }, []);

  // Fetch real data whenever selectedYear changes
  useEffect(() => {
    async function loadSymposiumData() {
      setLoading(true);
      try {
        const [wsRes, evRes, galRes, sbRes] = await Promise.all([
          fetch(`/api/workshops?year=${selectedYear}`),
          fetch(`/api/events?year=${selectedYear}`),
          fetch(`/api/gallery?year=${selectedYear}`),
          fetch(`/api/student-body?year=${selectedYear}`),
        ]);
        const wsJson = await wsRes.json();
        const evJson = await evRes.json();
        const galJson = await galRes.json();
        const sbJson = await sbRes.json();

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

        if (galJson.success && Array.isArray(galJson.data)) {
          setGalleryPhotos(galJson.data);
        } else {
          setGalleryPhotos([]);
        }

        if (sbJson.success && Array.isArray(sbJson.data)) {
          setStudentBodyPosters(sbJson.data);
        } else {
          setStudentBodyPosters([]);
        }
      } catch (err) {
        console.error('Error fetching symposium data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSymposiumData();
  }, [selectedYear]);

  // Filter Workshops
  const filteredWorkshops = workshops.filter((ws) => {
    const matchesBranch = selectedBranch === 'ALL' || ws.branch === selectedBranch;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.resourcePerson?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.resourcePerson?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  // Filter Events
  const filteredEvents = events.filter((ev) => {
    const matchesBranch = selectedBranch === 'ALL' || ev.branch === selectedBranch;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  // Filter Student Body Posters
  const filteredStudentBodyPosters = studentBodyPosters.filter((p) => {
    if (studentBodyFilter === 'ALL') return true;
    return p.branchCode?.toUpperCase() === studentBodyFilter.toUpperCase();
  });

  const activeEditionObj = editions.find(e => e.year === selectedYear);
  const isArchived = activeEditionObj ? !activeEditionObj.isActive : false;

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F5]">
      {/* Navigation */}
      <Navbar 
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        editions={editions}
      />

      {/* Hero Header with Dynamic Edition Architecture & Filters */}
      <HeroSection
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalWorkshopsCount={workshops.length}
        totalEventsCount={events.length}
        selectedYear={selectedYear}
        editions={editions}
        onSelectYear={setSelectedYear}
      />

      {/* SECTION 1: DAY 1 — FLAGSHIP ACADEMIC WORKSHOPS */}
      {(selectedCategory === 'all' || selectedCategory === 'workshops') && (
        <section id="workshops" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  DAY 1 EXCLUSIVE • 1 PER BRANCH
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Curated by Senior Student Conveners & Faculty Advisors
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mt-1.5 tracking-tight">
                Day 1: Flagship Masterclass Workshops
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
                Exactly one authoritative technical workshop per department. Led by external industry specialists and senior student conveners with full laboratory access and ISTE accredited credentials.
              </p>
            </div>

            <Link
              href="/organizer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 self-start md:self-auto bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Organizer Portal</span>
            </Link>
          </div>

          {filteredWorkshops.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900">
                {searchQuery 
                  ? `No workshops found matching "${searchQuery}" for department ${selectedBranch}.`
                  : `No Day 1 Workshops currently active for ${selectedBranch} in Edition ${selectedYear}.`}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Department associations (ACE, AIMS, DATA, ITA, ECLAT, ELECTRA, MESA, CEA, and sister clubs) can publish and manage their flagship masterclass directly from the Organizer Portal.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSelectedBranch('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs"
                  >
                    Reset Filters
                  </button>
                )}
                <Link
                  href="/organizer"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Publish Workshop as Organizer
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  onSelect={(ws) => setInspectItem(ws)}
                  onQuickRegister={(ws) => setRegisterItem(ws)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: DAY 2 — NATIONAL TECHNICAL COMPETITIONS & ARENA */}
      {(selectedCategory === 'all' || selectedCategory === 'events') && (
        <section id="events" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                  DAY 2 ARENA • MULTIPLE CONTESTS
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Coordinated by Branch Technical Leads & Event In-Charges
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mt-1.5 tracking-tight">
                Day 2: National Technical Competitions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
                High-intensity competitive arenas: 24-hour hackathons, algorithmic speed sprints, combat robotics, hardware circuit debugging, CAD structural design, paper presentations, and project expos.
              </p>
            </div>

            <Link
              href="/organizer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 self-start md:self-auto bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              <span>Add New Competition</span>
            </Link>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900">
                {searchQuery
                  ? `No technical competitions found matching "${searchQuery}" for department ${selectedBranch}.`
                  : `No Day 2 Competitions currently published for ${selectedBranch} in Edition ${selectedYear}.`}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Department associations can register and manage as many technical competitions, hackathons, and challenge arenas as needed via the Organizer Portal.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSelectedBranch('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs"
                  >
                    Reset Filters
                  </button>
                )}
                <Link
                  href="/organizer"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Create Competition
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={(ev) => setInspectItem(ev)}
                  onQuickRegister={(ev) => setRegisterItem(ev)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 3: THE CONCEPTUAL BLUEPRINT & 5 DIMENSIONS */}
      <SumshodhiniPhilosophy />

      {/* SECTION 4: OFFICIAL 2-DAY FEST ITINERARY (DYNAMICALLY LINKED TO EDITION) */}
      <section id="schedule" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            DYNAMIC SYMPOSIUM ITINERARY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Official 2-Day Schedule & Venue Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Synchronized directly with registered laboratory hubs and academic schedules for Edition {selectedYear}.
          </p>
        </div>
        <ScheduleTimeline editionYear={selectedYear} />
      </section>

      {/* SECTION 5: STUDENT ASSOCIATION EXECUTIVE BODIES */}
      <section id="student-body" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                STUDENT LEADERSHIP & COUNCILS
              </span>
              <span className="text-xs font-bold text-slate-500">
                18 Department Student Associations
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mt-1.5 tracking-tight">
              Student Body Executive Committees
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
              Official executive bodies, faculty advisors, student presidents, and departmental association posters leading Sumshodhini &apos;{String(selectedYear).slice(-2)}.
            </p>
          </div>

          <Link
            href="/organizer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 self-start md:self-auto bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors hover:bg-slate-50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Upload Body Poster</span>
          </Link>
        </div>

        {/* Filter Pills for Department Associations */}
        {studentBodyPosters.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs scrollbar-none">
            <button
              onClick={() => setStudentBodyFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                studentBodyFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Departments ({studentBodyPosters.length})
            </button>
            {studentBodyPosters.map((p) => (
              <button
                key={p.branchCode}
                onClick={() => setStudentBodyFilter(p.branchCode)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  studentBodyFilter === p.branchCode
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.logoUrl && (
                  <img src={p.logoUrl} alt={p.branchCode} className="w-3.5 h-3.5 rounded-full object-contain" />
                )}
                <span>{p.branchCode}</span>
              </button>
            ))}
          </div>
        )}

        {filteredStudentBodyPosters.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              Student Body Executive Directory
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Department associations are finalizing their official executive committee rosters for Edition {selectedYear}. Student conveners can upload association posters directly from the Organizer Portal.
            </p>
            <div className="pt-2">
              <Link
                href="/organizer"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors inline-block"
              >
                Upload Executive Poster
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudentBodyPosters.map((item) => (
              <div
                key={item.branchCode}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Poster Display Area */}
                <div 
                  onClick={() => item.posterUrl && setActivePosterModal(item)}
                  className={`relative aspect-[4/5] bg-slate-950 overflow-hidden flex items-center justify-center ${
                    item.posterUrl ? 'cursor-pointer' : ''
                  }`}
                >
                  {item.posterUrl ? (
                    <>
                      <img
                        src={item.posterUrl}
                        alt={`${item.branchCode} Student Body Poster`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          {item.logoUrl ? (
                            <img src={item.logoUrl} alt={item.branchCode} className="w-8 h-8 rounded-full bg-white p-1 object-contain shadow-xs" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-black">
                              {item.branchCode}
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/90">
                              {item.branchCode} · {item.associationShort || item.branchCode}
                            </span>
                            <h4 className="text-white text-sm font-black line-clamp-1">
                              {item.title || `${item.branchCode} Student Body`}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-slate-900 rounded-full p-2 shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center space-y-3 text-slate-400">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} alt={item.branchCode} className="w-9 h-9 rounded-full object-contain" />
                        ) : (
                          <Award className="w-7 h-7 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold">
                          {item.branchCode} · {item.associationShort || item.branchCode}
                        </span>
                        <p className="text-xs font-bold text-slate-200 mt-2">
                          {item.title || `${item.branchCode} Student Executive Body`}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                          Official executive body poster will be unveiled shortly by {item.associationShort || item.branchCode} conveners.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content Footer */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                        {item.branchName || item.branchCode}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.associationShort}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Leadership details */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty Advisor</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {item.facultyAdvisor || 'Department HoD & Faculty'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student President</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {item.studentPresident || 'Convener Board'}
                      </span>
                    </div>
                  </div>

                  {item.posterUrl && (
                    <button
                      onClick={() => setActivePosterModal(item)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Full Resolution Poster</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 6: VISUAL ARCHIVE & RECENT MOMENTS */}
      <section id="gallery" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                OFFICIAL MOMENTS & DOCUMENTATION
              </span>
              <span className="text-xs font-bold text-slate-500">
                Uploaded by Department Conveners
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mt-1.5 tracking-tight">
              Symposium Visual Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
              High-resolution captures from workshops, robotics challenges, code sprints, and valedictory awards across all 18 departments and collegiate chapters.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 self-start md:self-auto bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors hover:bg-slate-50"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Explore Full Gallery ({galleryPhotos.length} photos)</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {galleryPhotos.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
            <Camera className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">Visual Gallery Live Hub</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Event conveners upload high-resolution photos after workshop and competition rounds conclude.
            </p>
            <div className="pt-2">
              <Link
                href="/organizer"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors inline-block"
              >
                Upload Activity Photos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryPhotos.slice(0, 8).map((photo) => (
              <Link
                key={photo.id}
                href="/gallery"
                className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || photo.itemTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-900/90 text-white shadow-2xs">
                      {photo.branchCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-white/90 text-slate-800 shadow-2xs">
                      {photo.itemType === 'workshop' ? 'Workshop' : 'Event'}
                    </span>
                  </div>
                </div>
                <div className="p-2.5 space-y-0.5">
                  <h5 className="text-[11px] font-bold text-slate-900 truncate">
                    {photo.itemTitle}
                  </h5>
                  {photo.caption && (
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 6: 50-YEAR INSTITUTIONAL HERITAGE VAULT */}
      <div id="heritage">
        <LegacyVault />
      </div>

      {/* NETFLIX-STYLE POSTER INSPECTION MODAL */}
      <NetflixDetailModal
        item={inspectItem}
        onClose={() => setInspectItem(null)}
        onRegisterClick={(item) => {
          setInspectItem(null);
          setRegisterItem(item);
        }}
      />

      {/* REGISTRATION & DIGITAL PASS MODAL */}
      <RegistrationModal
        item={registerItem}
        onClose={() => setRegisterItem(null)}
      />

      {/* FULL RESOLUTION STUDENT BODY POSTER LIGHTBOX MODAL */}
      {activePosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Top Bar */}
            <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                {activePosterModal.logoUrl && (
                  <img src={activePosterModal.logoUrl} alt={activePosterModal.branchCode} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white p-1 object-contain shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-black text-white truncate">
                    {activePosterModal.title || `${activePosterModal.branchCode} Student Body Poster`}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                    {activePosterModal.branchName} · {activePosterModal.associationShort} · Edition {selectedYear}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <a
                  href={activePosterModal.posterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Open original image"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <button
                  onClick={() => setActivePosterModal(null)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Poster Image Viewport */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-slate-950">
              <img
                src={activePosterModal.posterUrl}
                alt={activePosterModal.title || 'Student Body Poster'}
                className="max-h-[65vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px]">
                {activePosterModal.facultyAdvisor && (
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold block">Faculty Advisor:</span>
                    <span className="font-semibold text-slate-200">{activePosterModal.facultyAdvisor}</span>
                  </div>
                )}
                {activePosterModal.studentPresident && (
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold block">Student President:</span>
                    <span className="font-semibold text-slate-200">{activePosterModal.studentPresident}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActivePosterModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs self-end sm:self-auto transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
