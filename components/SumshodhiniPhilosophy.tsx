'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Cpu, 
  Users2, 
  Award, 
  Crown, 
  Lightbulb, 
  GraduationCap, 
  Network, 
  TrendingUp,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  CheckCircle2
} from 'lucide-react';

export default function SumshodhiniPhilosophy() {
  const [activeDimension, setActiveDimension] = useState<number>(0);

  const dimensions = [
    {
      title: 'Exploration',
      icon: Compass,
      accent: 'text-blue-600 bg-blue-50 border-blue-200',
      pill: 'Dimension 01',
      tagline: 'Discover beyond the regular curriculum',
      desc: 'Students discover emerging technologies, novel system architectures, and engineering frontiers beyond textbook syllabi, fostering curiosity and opening doors to frontier domains.',
      bullets: ['Curated industry-relevant masterclasses', 'Exposure to multi-disciplinary tech stacks', 'Research-grade tools & frameworks']
    },
    {
      title: 'Application',
      icon: Cpu,
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      pill: 'Dimension 02',
      tagline: 'Bridging classroom theory with hands-on practice',
      desc: 'Knowing a concept and applying it to unfamiliar constraints are vastly different. Sumshodhini transforms classroom theory into working prototypes, running circuits, and compiled code.',
      bullets: ['Hands-on laboratory problem sets', 'Real-time debugging & rapid prototyping', 'Tangible outputs and working systems']
    },
    {
      title: 'Collaboration',
      icon: Users2,
      accent: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      pill: 'Dimension 03',
      tagline: 'Cross-pollinating talent across institutes',
      desc: 'Sumshodhini converges students, faculty, and domain specialists from engineering institutions across Telangana and India, exchanging technical methodologies and problem perspectives.',
      bullets: ['Multi-institutional delegate interaction', 'Inter-branch collaborative projects', 'Faculty and industry mentorship network']
    },
    {
      title: 'Achievement',
      icon: Award,
      accent: 'text-amber-600 bg-amber-50 border-amber-200',
      pill: 'Dimension 04',
      tagline: 'Tangible proof of competence and innovation',
      desc: 'Provides a high-visibility stage where technical brilliance receives institutional validation, merit citations, cash prize pools, and accredited professional credentials.',
      bullets: ['National competitive recognition', 'ISTE KITSW verified credentials', 'Substantial cash awards & trophies']
    },
    {
      title: 'Leadership',
      icon: Crown,
      accent: 'text-rose-600 bg-rose-50 border-rose-200',
      pill: 'Dimension 05',
      tagline: 'Student-led operational mastery',
      desc: 'Organized from the ground up by student conveners across departmental associations, imparting organizational strategy, crisis management, budget stewardship, and leadership excellence.',
      bullets: ['Student association autonomy', 'Large-scale operational coordination', 'Long-term institutional stewardship']
    }
  ];

  const pillars = [
    { title: 'Education', desc: 'Learning that extends far beyond lecture halls through active industry immersion.', icon: GraduationCap },
    { title: 'Innovation', desc: 'Turning curiosity into deployable prototypes, patents, and engineering solutions.', icon: Lightbulb },
    { title: 'Community', desc: 'Bringing students, research faculty, and technical societies into a shared ecosystem.', icon: Network },
    { title: 'Development', desc: 'Cultivating enduring technical competence, operational resilience, and confidence.', icon: TrendingUp },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80 bg-grid-pattern relative">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>The Conceptual Blueprint</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          What Sets <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 bg-clip-text text-transparent">SUMSHODHINI</span> Apart
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          More than an annual symposium — SUMSHODHINI is Kakatiya Institute of Technology & Science&apos;s 
          apex student-driven engine for technological exploration, hands-on experimentation, and collaborative excellence.
        </p>
      </div>

      {/* 2-Day Architecture Bento Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {/* Day 1 Card */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                DAY 1 OF 2
              </span>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Flagship Academic Masterclasses
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              <strong>Exactly one flagship workshop per engineering department</strong> headed by senior student conveners, faculty mentors, and external research scientists. Intensive, day-long hands-on labs with dedicated syllabus modules and accredited certificates.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-slate-800">
            <span>8 Specialized Department Labs</span>
            <span className="text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore Day 1 Workshops <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Day 2 Card */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-purple-300 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                DAY 2 OF 2
              </span>
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              National Technical Competitions & Arena
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              <strong>Multiple high-stakes challenges per department</strong>: 24-Hour Hackathons, algorithmic speed sprints, combat robotics, hardware circuit debugging, CAD structural modeling, paper presentations, and grand project innovation expos with substantial cash prize pools.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-slate-800">
            <span>36+ Competitive Arenas</span>
            <span className="text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Day 2 Challenges <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* The 5 Interconnected Dimensions Interactive Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-12">
        <div className="max-w-2xl mb-8">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            FOUNDATIONAL ARCHITECTURE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            The Five Dimensions of Sumshodhini
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            An interconnected conceptual framework defining how delegates move from passive curiosity to leadership mastery.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100">
          {dimensions.map((dim, idx) => {
            const Icon = dim.icon;
            const isSelected = activeDimension === idx;
            return (
              <button
                key={dim.title}
                onClick={() => setActiveDimension(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{dim.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Dimension Details */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {dimensions[activeDimension].pill}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-slate-900">
                {dimensions[activeDimension].tagline}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {dimensions[activeDimension].desc}
            </p>

            <div className="space-y-2 pt-2">
              {dimensions[activeDimension].bullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              EXPERIENCE CYCLE IMPACT
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-800">
                <span>Core Stakeholder</span>
                <span className="text-blue-700">Engineering Delegates & Conveners</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-800">
                <span>Execution Period</span>
                <span className="text-slate-900 font-mono">Day 1 & Day 2 Synchronized</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-800">
                <span>Long-Term Output</span>
                <span className="text-emerald-700">Practical Fluency & Leadership</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Deeper Identity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-900">{pillar.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
