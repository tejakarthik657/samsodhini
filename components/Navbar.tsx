'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  BookOpen, 
  Trophy, 
  Calendar, 
  Archive, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';
import { Edition } from '../types';

interface NavbarProps {
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  editions?: Edition[];
}

export default function Navbar({
  selectedYear,
  onSelectYear,
  editions: propEditions
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editionDropdownOpen, setEditionDropdownOpen] = useState(false);
  const [localEditions, setLocalEditions] = useState<Edition[]>([]);
  const [localYear, setLocalYear] = useState<number>(selectedYear || 2026);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with prop changes if passed
  useEffect(() => {
    if (selectedYear) {
      setLocalYear(selectedYear);
    }
  }, [selectedYear]);

  // Load editions if not passed from parent
  useEffect(() => {
    if (propEditions && propEditions.length > 0) {
      setLocalEditions(propEditions);
    } else {
      async function fetchEditions() {
        try {
          const res = await fetch('/api/editions');
          const json = await res.json();
          if (json.success && json.data) {
            setLocalEditions(json.data);
            if (!selectedYear && json.activeEdition) {
              setLocalYear(json.activeEdition.year);
            }
          }
        } catch (err) {
          console.error('Failed to load editions in navbar:', err);
        }
      }
      fetchEditions();
    }
  }, [propEditions, selectedYear]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditionDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleYearChange = (year: number) => {
    setLocalYear(year);
    setEditionDropdownOpen(false);
    if (onSelectYear) {
      onSelectYear(year);
    }
  };

  const currentYear = selectedYear || localYear;
  const editionsList = propEditions && propEditions.length > 0 ? propEditions : localEditions;

  return (
    <header className="fixed top-2 sm:top-4 inset-x-0 z-50 max-w-6xl mx-auto px-3 sm:px-6 pointer-events-none">
      {/* Floating Island Navigation Capsule */}
      <div 
        className={`pointer-events-auto transition-all duration-300 rounded-full floating-glass-dock ${
          isScrolled 
            ? 'py-2 px-3 sm:px-4 bg-white/90 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.12)]' 
            : 'py-2.5 px-3.5 sm:px-5 bg-white/80 shadow-[0_12px_32px_-10px_rgba(15,23,42,0.08)]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Dynamic Edition Selector */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-1 border border-slate-200/90 shadow-xs flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                <img 
                  src="/Sumshodhini26icon.png" 
                  alt="Sumshodhini Emblem" 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                    SUMSHODHINI
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>KITSW National Symposium</span>
                </div>
              </div>
            </Link>

            {/* Interactive Edition Dropdown Pill */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setEditionDropdownOpen(!editionDropdownOpen)}
                className="flex items-center gap-1 text-[11px] font-mono font-black text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded-full border border-slate-200 transition-all shadow-2xs"
                title="Select Symposium Edition"
              >
                <span>&apos;{String(currentYear).slice(-2)}</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${editionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {editionDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-100 mb-1">
                    Symposium Editions
                  </div>
                  {editionsList.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-500">
                      Edition &apos;{String(currentYear).slice(-2)} (Active)
                    </div>
                  ) : (
                    editionsList.map((ed) => (
                      <button
                        key={ed.year}
                        type="button"
                        onClick={() => handleYearChange(ed.year)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          ed.year === currentYear ? 'text-blue-900 font-bold bg-blue-50/70' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>Sumshodhini &apos;{String(ed.year).slice(-2)}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{ed.year} Academic Cycle</span>
                        </div>
                        {ed.isActive ? (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                            Live
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            Archived
                          </span>
                        )}
                      </button>
                    ))
                  )}
                  <div className="pt-1.5 mt-1 border-t border-slate-100 px-3">
                    <Link
                      href="/organizer"
                      className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Organizer Portal</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 text-xs font-bold text-slate-700">
            <Link 
              href="/#workshops" 
              className="px-3.5 py-1.5 rounded-full hover:bg-white hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-none hover:shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Day 1: Workshops</span>
            </Link>

            <Link 
              href="/#events" 
              className="px-3.5 py-1.5 rounded-full hover:bg-white hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-none hover:shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>Day 2: Competitions</span>
            </Link>

            <Link 
              href="/#schedule" 
              className="px-3 py-1.5 rounded-full hover:bg-white hover:text-slate-950 transition-all"
            >
              Schedule
            </Link>

            <Link 
              href="/#heritage" 
              className="px-3 py-1.5 rounded-full hover:bg-white hover:text-slate-950 transition-all"
            >
              Heritage Vault
            </Link>

            <Link 
              href="/gallery" 
              className="px-3 py-1.5 rounded-full hover:bg-white hover:text-slate-950 transition-all"
            >
              Gallery
            </Link>
          </nav>

          {/* Action Button: Organizer Portal */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/organizer"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Organizer Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 mt-2 border-t border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-1 text-xs text-slate-500 font-semibold bg-slate-50 rounded-xl">
              <span>Selected Academic Edition:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {currentYear}
              </span>
            </div>

            <Link
              href="/#workshops"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Day 1: Flagship Masterclasses</span>
            </Link>

            <Link
              href="/#events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>Day 2: National Arena Competitions</span>
            </Link>

            <Link
              href="/#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Official 2-Day Itinerary
            </Link>

            <Link
              href="/#heritage"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              50-Year Heritage Vault
            </Link>

            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Media Gallery
            </Link>

            <Link
              href="/organizer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white text-center shadow-xs mt-1"
            >
              Organizer Portal
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
