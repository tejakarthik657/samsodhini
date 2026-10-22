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
  GalleryItem
} from '../types';

import { 
  BookOpen, 
  Trophy, 
  ShieldCheck,
  Archive,
  Camera,
  ArrowRight
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
        const [wsRes, evRes, galRes] = await Promise.all([
          fetch(`/api/workshops?year=${selectedYear}`),
          fetch(`/api/events?year=${selectedYear}`),
          fetch(`/api/gallery?year=${selectedYear}`),
        ]);
        const wsJson = await wsRes.json();
        const evJson = await evRes.json();
        const galJson = await galRes.json();

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
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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

      {/* SECTION 5: VISUAL ARCHIVE & RECENT MOMENTS */}
      <section id="gallery" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
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

      {/* Footer */}
      <Footer />
    </main>
  );
}
