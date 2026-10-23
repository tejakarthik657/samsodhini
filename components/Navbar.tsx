'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Edition } from '../types';

interface NavbarProps {
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  editions?: Edition[];
}

const LINKS = [
  { href: '/#workshops', label: 'Workshops' },
  { href: '/#events', label: 'Competitions' },
  { href: '/#schedule', label: 'Schedule' },
  { href: '/#student-body', label: 'Student bodies' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/#heritage', label: 'Heritage' },
];

export default function Navbar({ selectedYear, onSelectYear, editions: propEditions }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editionDropdownOpen, setEditionDropdownOpen] = useState(false);
  const [localEditions, setLocalEditions] = useState<Edition[]>([]);
  const [localYear, setLocalYear] = useState<number>(selectedYear || 2026);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section being read on the home page.
  useEffect(() => {
    if (pathname !== '/') { setActiveId(''); return; }
    const ids = ['workshops', 'events', 'schedule', 'student-body', 'heritage'];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (selectedYear) setLocalYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (propEditions && propEditions.length > 0) {
      setLocalEditions(propEditions);
      return;
    }
    const fetchEditions = async () => {
      try {
        const res = await fetch('/api/editions');
        const json = await res.json();
        if (json.success && json.data) {
          setLocalEditions(json.data);
          if (!selectedYear && json.activeEdition) setLocalYear(json.activeEdition.year);
        }
      } catch (err) {
        console.error('Failed to load editions in navbar:', err);
      }
    };
    fetchEditions();
  }, [propEditions, selectedYear]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditionDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleYearChange = (year: number) => {
    setLocalYear(year);
    setEditionDropdownOpen(false);
    onSelectYear?.(year);
  };

  const currentYear = selectedYear || localYear;
  const editionsList = propEditions && propEditions.length > 0 ? propEditions : localEditions;
  const yy = String(currentYear).slice(-2);

  return (
    <>
      <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-7xl mx-auto">
        <div className={`w-full flex items-center justify-between gap-2 sm:gap-3 bg-white border-2 border-ink rounded-full pl-2 pr-2 transition-all duration-300 ${scrolled ? 'py-1.5 shadow-pop' : 'py-2 shadow-pop-sm'}`}>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0" aria-label="Sumshodhini home">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-ink overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src="/Sumshodhini26icon.png"
                  alt=""
                  className="w-full h-full object-contain scale-110"
                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
              </span>
              <span className="font-display text-lg sm:text-2xl leading-none text-ink truncate">Sumshodhini</span>
            </Link>

            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setEditionDropdownOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={editionDropdownOpen}
                aria-label={`Edition ${currentYear}. Change edition`}
                className="flex items-center gap-1 text-xs sm:text-sm font-bold bg-marigold-400 hover:bg-marigold-300 border-2 border-ink px-2 sm:px-2.5 py-1 rounded-full transition-colors tabular-nums"
              >
                <span>&apos;{yy}</span>
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${editionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {editionDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute top-full left-0 mt-3 w-56 sm:w-64 bg-white border-2 border-ink rounded-2xl shadow-pop p-1.5 z-50"
                >
                  <p className="px-3 py-1.5 text-xs font-semibold text-slate-500">Choose an edition</p>
                  {editionsList.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-slate-700">Sumshodhini &apos;{yy} (live)</p>
                  ) : (
                    editionsList.map((ed) => (
                      <button
                        key={ed.year}
                        type="button"
                        role="option"
                        aria-selected={ed.year === currentYear}
                        onClick={() => handleYearChange(ed.year)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-colors ${
                          ed.year === currentYear ? 'bg-cobalt-500 text-white font-bold' : 'hover:bg-lilac-100 text-ink font-semibold'
                        }`}
                      >
                        <span>Sumshodhini &apos;{String(ed.year).slice(-2)}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-md border ${
                            ed.isActive ? 'bg-marigold-400 text-ink border-ink' : 'bg-white/20 border-current opacity-80'
                          }`}
                        >
                          {ed.isActive ? 'Live' : 'Archive'}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 text-sm font-semibold" aria-label="Primary">
            {LINKS.map((l) => {
              const hash = l.href.startsWith('/#') ? l.href.slice(2) : '';
              const active = hash ? activeId === hash : pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'true' : undefined}
                  className={`px-4 py-2 rounded-full border-2 transition-colors ${
                    active ? 'bg-cobalt-500 text-white border-ink' : 'text-ink border-transparent hover:bg-lilac-200'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#poster"
              className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-marigold-400 hover:bg-marigold-300 border-2 border-ink text-ink text-sm font-bold transition-colors"
            >
              Get the poster
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cobalt-500 text-white border-2 border-ink flex items-center justify-center shrink-0"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav
          className="xl:hidden fixed inset-0 z-40 bg-cobalt-500 pt-28 px-6 pb-8 overflow-y-auto animate-fade-in"
          aria-label="Mobile"
        >
          <ul>
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-b-2 border-white/30">
                <Link
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-baseline justify-between py-4 font-display text-3xl sm:text-4xl text-white"
                >
                  <span>{l.label}</span>
                  <span className="text-base font-semibold text-marigold-300 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
