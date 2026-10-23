'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { KITSW_BRANCHES } from '../../lib/branches';
import { GalleryItem, Edition } from '../../types';
import { 
  Camera, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  BookOpen, 
  Trophy, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function GalleryPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'workshop' | 'event'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Fetch editions
  useEffect(() => {
    async function loadEditions() {
      try {
        const res = await fetch('/api/editions');
        const data = await res.json();
        if (data.success && data.data) {
          setEditions(data.data);
          if (data.activeEdition) {
            setSelectedYear(data.activeEdition.year);
          }
        }
      } catch (err) {
        console.error('Failed to load editions:', err);
      }
    }
    loadEditions();
  }, []);

  // Fetch photos for selected year
  useEffect(() => {
    async function loadGalleryPhotos() {
      setLoading(true);
      try {
        const res = await fetch(`/api/gallery?year=${selectedYear}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPhotos(data.data);
        } else {
          setPhotos([]);
        }
      } catch (err) {
        console.error('Failed to load gallery photos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGalleryPhotos();
  }, [selectedYear]);

  // Client-side filtering for instantaneous responsiveness
  const filteredPhotos = photos.filter((photo) => {
    const matchesBranch = selectedBranch === 'ALL' || photo.branchCode.toUpperCase() === selectedBranch.toUpperCase();
    const matchesType = selectedType === 'ALL' || photo.itemType.toLowerCase() === selectedType.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      photo.itemTitle.toLowerCase().includes(query) ||
      photo.branchCode.toLowerCase().includes(query) ||
      (photo.caption && photo.caption.toLowerCase().includes(query));

    return matchesBranch && matchesType && matchesSearch;
  });

  const activePhoto = activeLightboxIndex !== null ? filteredPhotos[activeLightboxIndex] : null;

  const handleNextPhoto = () => {
    if (activeLightboxIndex !== null && activeLightboxIndex < filteredPhotos.length - 1) {
      setActiveLightboxIndex(activeLightboxIndex + 1);
    } else {
      setActiveLightboxIndex(0);
    }
  };

  const handlePrevPhoto = () => {
    if (activeLightboxIndex !== null && activeLightboxIndex > 0) {
      setActiveLightboxIndex(activeLightboxIndex - 1);
    } else {
      setActiveLightboxIndex(filteredPhotos.length - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        editions={editions}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>SYMPOSIUM VISUAL ARCHIVE • POST-EVENT DOCUMENTATION</span>
            </div>
            <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-700 shadow-2xs">
              Edition &apos;{String(selectedYear).slice(-2)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            National Symposium Visual Gallery
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Official high-resolution photography archives uploaded by branch conveners across Day 1 Flagship Masterclasses and Day 2 Arena Competitions.
          </p>
        </div>

        {/* Multi-Dimensional Filter Control Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity, department or caption..."
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-900 focus:bg-white focus:border-slate-400 transition-colors"
              />
            </div>

            {/* Classification Type Selector */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setSelectedType('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedType === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Activities ({photos.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('workshop')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedType === 'workshop'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Day 1 Workshops</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('event')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedType === 'event'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Day 2 Competitions</span>
              </button>
            </div>
          </div>

          {/* Department & Club Selector Chips */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Department:
            </span>
            <button
              type="button"
              onClick={() => setSelectedBranch('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedBranch === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Departments & Clubs
            </button>
            {KITSW_BRANCHES.map((b) => (
              <button
                key={b.code}
                type="button"
                onClick={() => setSelectedBranch(b.code)}
                title={b.name}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                  selectedBranch === b.code
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b.code}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Showing <strong>{filteredPhotos.length}</strong> photo{filteredPhotos.length === 1 ? '' : 's'}
            {selectedBranch !== 'ALL' && ` for ${selectedBranch}`}
            {selectedType !== 'ALL' && ` in ${selectedType === 'workshop' ? 'Day 1 Workshops' : 'Day 2 Competitions'}`}
          </span>
          <Link
            href="/organizer"
            className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
          >
            <span>Upload Photos as Organizer</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Gallery Grid or Empty State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto p-8 space-y-3 shadow-xs">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">
              {searchQuery
                ? `No photos found matching "${searchQuery}".`
                : `No activity photographs uploaded yet for ${selectedBranch} in Edition ${selectedYear}.`}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Student associations can upload up to 12 high-resolution photos per workshop and competition round through the Organizer Command Portal.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBranch('ALL');
                    setSelectedType('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <Link
                href="/organizer"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Open Organizer Portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredPhotos.map((photo, index) => {
              const branchMeta = KITSW_BRANCHES.find((b) => b.code === photo.branchCode);
              return (
                <div
                  key={photo.id}
                  onClick={() => setActiveLightboxIndex(index)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/90 hover:border-slate-400 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || photo.itemTitle}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-black shadow-xs text-white"
                        style={{ backgroundColor: branchMeta?.accentColor || '#0F172A' }}
                      >
                        {photo.branchCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-2xs">
                        {photo.itemType === 'workshop' ? 'Day 1 Workshop' : 'Day 2 Contest'}
                      </span>
                    </div>

                    {/* Bottom Caption on Hover */}
                    <div className="absolute bottom-2.5 inset-x-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-bold line-clamp-1">
                        {photo.itemTitle}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {photo.itemTitle}
                    </h4>
                    {photo.caption && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {photo.caption}
                      </p>
                    )}
                    <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                      Edition &apos;{String(photo.editionYear).slice(-2)} • {new Date(photo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* LIGHTBOX INSPECTION MODAL */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Topbar */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/70 text-white">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-black bg-blue-600 text-white shrink-0">
                  {activePhoto.branchCode}
                </span>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-xs sm:max-w-xl">
                    {activePhoto.itemTitle}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 truncate">
                    {activePhoto.itemType === 'workshop' ? 'Day 1 Workshop' : 'Day 2 Contest'} • Edition {activePhoto.editionYear}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-400">
                  {activeLightboxIndex! + 1} / {filteredPhotos.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveLightboxIndex(null)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo Viewport */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[220px] sm:min-h-[300px] max-h-[70vh] overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.caption || activePhoto.itemTitle}
                className="max-h-full max-w-full object-contain"
              />

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all"
                title="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all"
                title="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Caption Footer */}
            {activePhoto.caption && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-slate-200 text-xs">
                <p className="font-medium leading-relaxed">{activePhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
