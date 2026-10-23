'use client';

import React, { useEffect, useState } from 'react';

const WORD = 'SUMSHODHINI'.split('');
const STRIPS = 9;
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@';
const SESSION_KEY = 'sam-pre';

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Opening sequence. The emblem is built from slabs, so it assembles from nine strips sliding in
 * from alternating sides, while the name decodes on a split-flap board, one letter locking at a
 * time. When both finish, two curtains lift. Shown once per browser session.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'show' | 'exit' | 'gone'>('show');
  const [chars, setChars] = useState<string[]>(WORD.map(() => '·'));
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('no-preload')) {
      setPhase('gone');
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduced);
    const minTime = reduced ? 600 : 2600;
    const start = performance.now();
    let loaded = document.readyState === 'complete';
    let raf = 0;
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    document.body.style.overflow = 'hidden';

    const finish = () => {
      if (done) return;
      done = true;
      setProgress(100);
      timers.push(setTimeout(() => setPhase('exit'), reduced ? 100 : 650));
      timers.push(
        setTimeout(() => {
          setPhase('gone');
          document.body.style.overflow = '';
          try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
        }, reduced ? 600 : 1700)
      );
    };

    const onLoad = () => { loaded = true; };
    window.addEventListener('load', onLoad);

    const tick = (t: number) => {
      const ratio = clamp((t - start) / minTime);
      const eased = 1 - Math.pow(1 - ratio, 1.8);
      // Hold at 94% until the page has actually finished loading.
      const target = loaded ? eased : Math.min(eased, 0.94);
      setProgress((p) => Math.max(p, Math.round(target * 100)));
      if (loaded && ratio >= 1) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Never trap the visitor if something stalls.
    timers.push(setTimeout(finish, 9000));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
      timers.forEach(clearTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  // Letters that have not locked yet keep cycling through random glyphs.
  useEffect(() => {
    if (phase !== 'show' || reducedMotion) return;
    const id = setInterval(() => {
      setChars(WORD.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]));
    }, 70);
    return () => clearInterval(id);
  }, [phase, reducedMotion]);

  if (phase === 'gone') return null;

  const exiting = phase === 'exit';
  const p = progress / 100;
  // Letters lock from left to right, finishing at about 92% so the last one lands just before 100.
  const lockedCount = reducedMotion ? WORD.length : Math.floor(clamp(p / 0.92) * (WORD.length + 0.001));
  const complete = progress >= 100;

  return (
    <div id="preloader" role="status" aria-live="polite" aria-label="Loading Sumshodhini" className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Back curtain lifts a beat after the front one */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-marigold-400 border-b-2 border-ink transition-transform duration-[950ms] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-opacity"
        style={{ transform: exiting ? 'translateY(-100%)' : 'translateY(0)', transitionDelay: exiting ? '140ms' : '0ms' }}
      />

      <div
        className="absolute inset-0 bg-cobalt-500 text-white overflow-hidden border-b-2 border-ink transition-transform duration-[950ms] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-opacity"
        style={{ transform: exiting ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <div className="absolute inset-0 dots" aria-hidden="true" />

        {/* Corner marks, like a print proof */}
        {['left-4 top-4', 'right-4 top-4', 'left-4 bottom-4', 'right-4 bottom-4'].map((pos) => (
          <span key={pos} aria-hidden="true" className={`absolute ${pos} w-5 h-5 border-white/50 ${pos.includes('top') ? 'border-t-2' : 'border-b-2'} ${pos.includes('left') ? 'border-l-2' : 'border-r-2'}`} />
        ))}

        <div className="relative h-full flex flex-col items-center justify-center px-4">
          {/* Emblem assembling from strips */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-coral-400 border-[3px] border-ink translate-x-[8%] translate-y-[7%]" />
            <span className="absolute inset-0 rounded-full bg-marigold-400 border-[3px] border-ink translate-x-[4%] translate-y-[3.5%]" />
            <span
              className="absolute inset-0 rounded-full bg-white border-4 border-ink overflow-hidden shadow-pop transition-transform duration-300"
              style={{ transform: complete && !exiting ? 'scale(1.06)' : 'scale(1)' }}
            >
              {Array.from({ length: STRIPS }).map((_, i) => {
                const local = reducedMotion ? 1 : easeOut(clamp(p * 1.45 - i * 0.075));
                const dir = i % 2 === 0 ? -1 : 1;
                return (
                  <img
                    key={i}
                    src="/Sumshodhini26icon.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain scale-[1.12]"
                    style={{
                      clipPath: `inset(${(i * 100) / STRIPS}% 0 ${100 - ((i + 1) * 100) / STRIPS}% 0)`,
                      transform: `translateX(${dir * (1 - local) * 115}%) scale(1.12)`,
                      opacity: local > 0 ? 1 : 0,
                    }}
                    onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                  />
                );
              })}
            </span>
          </div>

          {/* Split-flap name */}
          <div className="mt-10 flex justify-center gap-[0.6vw] sm:gap-2" aria-hidden="true">
            {WORD.map((letter, i) => {
              const locked = i < lockedCount;
              return (
                <span
                  key={i}
                  className={`relative flex items-center justify-center w-[7.6vw] h-[10.4vw] sm:w-[58px] sm:h-[80px] lg:w-[72px] lg:h-[96px] rounded-lg sm:rounded-xl border-2 border-ink font-display text-[5.4vw] sm:text-[40px] lg:text-[52px] leading-none transition-colors duration-150 ${
                    locked ? 'bg-marigold-400 text-ink shadow-pop-sm' : 'bg-white/95 text-ink/55'
                  }`}
                >
                  {/* hinge line */}
                  <span className="absolute inset-x-0 top-1/2 h-[2px] bg-ink/25" />
                  <span key={locked ? 'locked' : 'spin'} className={locked ? 'motion-safe:animate-[flip_0.35s_ease-out]' : ''}>
                    {locked ? letter : chars[i]}
                  </span>
                </span>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 pb-6 sm:pb-8 flex items-end justify-between">
            <p className="font-display text-white text-6xl sm:text-8xl leading-none tabular-nums" aria-hidden="true">
              {String(progress).padStart(2, '0')}
              <span className="text-2xl sm:text-4xl align-top ml-1 text-marigold-400">%</span>
            </p>
            <p className="text-sm sm:text-base font-semibold text-white/90 text-right">
              {complete ? 'Ready' : 'Decoding the ’26 edition'}
              <span className="block text-white/70 font-medium">KITSW Warangal</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
