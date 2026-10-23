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
import { canonicalBranchCode } from '../lib/branches';
import Footer from '../components/Footer';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import { 
  Workshop, 
  FestEvent,
  Edition,
  GalleryItem,
  StudentBodyPoster
} from '../types';

import { X, ExternalLink, Maximize2 } from 'lucide-react';
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
    const matchesBranch = selectedBranch === 'ALL' || canonicalBranchCode(ws.branch) === selectedBranch;
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
    const matchesBranch = selectedBranch === 'ALL' || canonicalBranchCode(ev.branch) === selectedBranch;
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
  const yy = String(selectedYear).slice(-2);

  const resetFilters = () => {
    setSelectedBranch('ALL');
    setSearchQuery('');
  };

  const filtered = searchQuery || selectedBranch !== 'ALL';
  const wrap = 'max-w-[1500px] mx-auto px-4 sm:px-8 w-full';
  const gridClass = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12';

  return (
    <main className="min-h-screen flex flex-col bg-paper">
      <Navbar selectedYear={selectedYear} onSelectYear={setSelectedYear} editions={editions} />

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

      {/* Day 1 */}
      {(selectedCategory === 'all' || selectedCategory === 'workshops') && (
        <section id="workshops" className="bg-paper py-20 sm:py-28">
          <div className={wrap}>
            <SectionHeader
              day="1"
              title="Workshops"
              description="A hands-on workshop from each department, with faculty and student coordinators to contact for every one."
              count={filteredWorkshops.length}
              countLabel={filteredWorkshops.length === 1 ? 'workshop' : 'workshops'}
            />

            {loading ? (
              <ListingSkeleton />
            ) : filteredWorkshops.length === 0 ? (
              <EmptyState
                title={filtered ? 'No workshops match your filters' : `No workshops published for '${yy} yet`}
                body={
                  filtered
                    ? 'Clear the search or choose another branch to see more.'
                    : 'Departments publish their workshop from the organizer portal. It will appear here as soon as it is live.'
                }
                primary={filtered ? { label: 'Clear filters', onClick: resetFilters } : { label: 'Publish a workshop', href: '/organizer' }}
              />
            ) : (
              <div className={gridClass}>
                {filteredWorkshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    onSelect={(ws) => setInspectItem(ws)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Day 2 */}
      {(selectedCategory === 'all' || selectedCategory === 'events') && (
        <section id="events" className="bg-marigold-400 border-y-2 border-ink py-20 sm:py-28 relative overflow-hidden grain">
          <div className="absolute inset-0 dots-ink" aria-hidden="true" />
          <div className={`${wrap} relative`}>
            <SectionHeader
              day="2"
              title="Competitions"
              description="Hackathons, speed coding, combat robotics, circuit debugging and project expos, with cash prizes for the winning teams."
              count={filteredEvents.length}
              countLabel={filteredEvents.length === 1 ? 'competition' : 'competitions'}
            />

            {loading ? (
              <ListingSkeleton />
            ) : filteredEvents.length === 0 ? (
              <EmptyState
                title={filtered ? 'No competitions match your filters' : `No competitions published for '${yy} yet`}
                body={
                  filtered
                    ? 'Clear the search or choose another branch to see more.'
                    : 'Departments can add as many competitions as they like from the organizer portal.'
                }
                primary={filtered ? { label: 'Clear filters', onClick: resetFilters } : { label: 'Add a competition', href: '/organizer' }}
              />
            ) : (
              <div className={gridClass}>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={(ev) => setInspectItem(ev)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <SumshodhiniPhilosophy />

      {/* Schedule */}
      <section id="schedule" className="bg-paper py-20 sm:py-28">
        <div className={wrap}>
          <SectionHeader
            title="Schedule"
            description={`Times and venues for both days of the '${yy} edition, pulled from what each department has published.`}
          />
          <ScheduleTimeline editionYear={selectedYear} />
        </div>
      </section>

      {/* Student bodies */}
      <section id="student-body" className="bg-lilac-200 border-y-2 border-ink py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 dots-ink" aria-hidden="true" />
        <div className={`${wrap} relative`}>
          <SectionHeader
            title="Student bodies"
            description={`The department associations organising Sumshodhini '${yy}, with their faculty advisors and student presidents.`}
            action={
              <Link href="/organizer" className="pop inline-flex items-center px-5 py-2.5 rounded-full bg-white text-ink text-sm font-bold">
                Upload a poster
              </Link>
            }
          />

          {studentBodyPosters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter student bodies">
              {['ALL', ...studentBodyPosters.map((p) => p.branchCode)].map((code) => {
                const label = studentBodyPosters.find((p) => p.branchCode === code)?.associationShort || code;
                return (
                <button
                  key={code}
                  onClick={() => setStudentBodyFilter(code)}
                  aria-pressed={studentBodyFilter === code}
                  className={`px-4 py-2 rounded-full border-2 border-ink text-sm font-bold transition-colors ${
                    studentBodyFilter === code ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-marigold-200'
                  }`}
                >
                  {code === 'ALL' ? `All ${studentBodyPosters.length}` : label}
                </button>
                );
              })}
            </div>
          )}

          {filteredStudentBodyPosters.length === 0 ? (
            <EmptyState
              title="Executive committees are being finalised"
              body={`Associations will publish their '${yy} executive poster here. Conveners can upload one from the organizer portal.`}
              primary={{ label: 'Upload a poster', href: '/organizer' }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudentBodyPosters.map((item, idx) => {
                const colors = ['bg-white', 'bg-cobalt-500 text-white', 'bg-marigold-400', 'bg-coral-400', 'bg-mint-300'];
                const tile = colors[idx % colors.length];
                return (
                  <article key={item.branchCode} className={`pop group flex flex-col rounded-[26px] overflow-hidden ${tile}`}>
                    <button
                      type="button"
                      disabled={!item.posterUrl}
                      onClick={() => item.posterUrl && setActivePosterModal(item)}
                      className={`relative block w-full text-left disabled:cursor-default border-b-2 border-ink overflow-hidden ${item.posterUrl ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}
                      aria-label={item.posterUrl ? `View ${item.branchCode} poster full size` : undefined}
                    >
                      {item.posterUrl ? (
                        <>
                          <img
                            src={item.posterUrl}
                            alt={`${item.branchCode} student body poster`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transition-none"
                          />
                          <span className="absolute top-3 right-3 bg-white text-ink border-2 border-ink rounded-full p-2">
                            <Maximize2 className="w-4 h-4" />
                          </span>
                        </>
                      ) : (
                        <span className="absolute inset-0 flex items-end p-4">
                          <span className="font-display text-5xl sm:text-6xl leading-[0.8]">{item.associationShort || item.branchCode}</span>
                        </span>
                      )}
                    </button>

                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl leading-[0.98]">{item.branchName || item.branchCode}</h3>
                        {item.associationShort && (
                          <span className="shrink-0 px-2.5 py-1 rounded-full bg-ink text-white text-xs font-bold">{item.associationShort}</span>
                        )}
                      </div>
                      {item.description && <p className="text-sm leading-snug line-clamp-2 opacity-90">{item.description}</p>}
                      <dl className="mt-auto pt-3 border-t-2 border-current/30 text-sm">
                        <div className="flex justify-between gap-3">
                          <dt className="opacity-70">Faculty advisor</dt>
                          <dd className="font-bold text-right truncate">{item.facultyAdvisor || 'Department faculty'}</dd>
                        </div>
                        <div className="flex justify-between gap-3 mt-1">
                          <dt className="opacity-70">Student president</dt>
                          <dd className="font-bold text-right truncate">{item.studentPresident || 'To be announced'}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="bg-cobalt-500 text-white py-20 sm:py-28 relative overflow-hidden grain">
        <div className="absolute inset-0 dots" aria-hidden="true" />
        <div className={`${wrap} relative`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <h2 className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-marigold-400">Gallery</h2>
              <p className="mt-4 text-base sm:text-lg text-white/90 max-w-xl leading-snug">
                Photographs from workshops, robotics arenas, code sprints and the valedictory, uploaded by department conveners.
              </p>
            </div>
            <Link
              href="/gallery"
              className="pop self-start md:self-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-marigold-400 text-ink text-base font-bold"
            >
              Open full gallery{galleryPhotos.length > 0 ? ` (${galleryPhotos.length})` : ''}
            </Link>
          </div>

          {galleryPhotos.length === 0 ? (
            <div className="rounded-[28px] border-2 border-dashed border-white/60 px-6 py-16 text-center">
              <h3 className="font-display text-3xl sm:text-5xl leading-[0.95]">No photos yet</h3>
              <p className="mt-3 text-base text-white/85 max-w-md mx-auto leading-snug">
                Conveners add photographs once a workshop or competition round wraps up.
              </p>
              <Link href="/organizer" className="pop mt-7 inline-flex items-center px-5 py-3 rounded-full bg-white text-ink text-sm font-bold">
                Upload photos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7">
              {galleryPhotos.slice(0, 8).map((photo, i) => (
                <Link
                  key={photo.id}
                  href="/gallery"
                  style={{ rotate: `${[-2.5, 1.8, -1, 2.4, -1.8, 1.2, -2.2, 1.6][i % 8]}deg` }}
                  className="group bg-white p-2.5 pb-3 border-2 border-ink rounded-xl shadow-pop transition-transform duration-200 hover:!rotate-0 hover:scale-[1.03]"
                >
                  <span className="block aspect-[4/3] overflow-hidden rounded-md bg-cobalt-900">
                    <img src={photo.imageUrl} alt={photo.caption || photo.itemTitle} className="w-full h-full object-cover" />
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-2 text-ink">
                    <span className="text-sm font-bold truncate">{photo.itemTitle}</span>
                    <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-marigold-300 border-2 border-ink">{photo.branchCode}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div id="heritage">
        <LegacyVault />
      </div>

      <NetflixDetailModal
        item={inspectItem}
        onClose={() => setInspectItem(null)}
      />


      {/* Poster lightbox */}
      {activePosterModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-ink/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activePosterModal.title || `${activePosterModal.branchCode} poster`}
          onClick={() => setActivePosterModal(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-white border-2 border-ink rounded-[26px] shadow-pop-lg overflow-hidden flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-7 py-4 border-b-2 border-ink bg-marigold-400 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-2xl sm:text-3xl truncate text-ink">
                  {activePosterModal.title || `${activePosterModal.branchCode} student body`}
                </h3>
                <p className="text-sm font-semibold text-ink/80 truncate">
                  {activePosterModal.branchName} · {activePosterModal.associationShort} · &apos;{yy}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activePosterModal.posterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border-2 border-ink flex items-center justify-center hover:bg-lilac-100"
                  aria-label="Open original image in a new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActivePosterModal(null)}
                  className="w-10 h-10 rounded-full bg-ink text-white border-2 border-ink flex items-center justify-center"
                  aria-label="Close poster"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3 sm:p-5 flex items-center justify-center bg-lilac-100">
              <img
                src={activePosterModal.posterUrl}
                alt={activePosterModal.title || 'Student body poster'}
                className="max-h-[66vh] w-auto max-w-full object-contain rounded-xl border-2 border-ink"
              />
            </div>

            {(activePosterModal.facultyAdvisor || activePosterModal.studentPresident) && (
              <dl className="px-5 sm:px-7 py-3 border-t-2 border-ink flex flex-wrap gap-x-10 gap-y-2 text-sm">
                {activePosterModal.facultyAdvisor && (
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Faculty advisor</dt>
                    <dd className="font-bold">{activePosterModal.facultyAdvisor}</dd>
                  </div>
                )}
                {activePosterModal.studentPresident && (
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Student president</dt>
                    <dd className="font-bold">{activePosterModal.studentPresident}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

function ListingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-[26px] border-2 border-ink bg-white overflow-hidden animate-pulse shadow-pop">
          <div className="aspect-[4/3] bg-lilac-100 border-b-2 border-ink" />
          <div className="p-5 space-y-3">
            <div className="h-7 w-3/4 bg-lilac-100 rounded-full" />
            <div className="h-4 w-full bg-lilac-100 rounded-full" />
            <div className="h-4 w-2/3 bg-lilac-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
