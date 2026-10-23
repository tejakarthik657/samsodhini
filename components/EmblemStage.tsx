'use client';

import React, { useEffect, useRef, useState } from 'react';

const RING = 'NATIONAL LEVEL TECHNICAL SYMPOSIUM ✺ KITSW WARANGAL ✺ ';

/**
 * The emblem as a stage: offset print-style discs, the emblem tilting toward the
 * cursor, a ring of text, and stickers orbiting it. Click the emblem and it spins.
 */
export default function EmblemStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [spins, setSpins] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: PointerEvent) => {
      const el = stageRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      tx = Math.max(-1, Math.min(1, dx * 2.4));
      ty = Math.max(-1, Math.min(1, dy * 2.4));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      if (tiltRef.current) {
        tiltRef.current.style.transform = `perspective(900px) rotateY(${cx * 9}deg) rotateX(${-cy * 9}deg) translate3d(${cx * 6}px, ${cy * 6}px, 0)`;
      }
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={stageRef} className="relative mx-auto lg:ml-auto w-[min(86vw,420px)] lg:w-[min(34.5vw,520px)] aspect-square select-none">
      {/* Halftone dots fading outward, with a dashed orbit line */}
      <div
        aria-hidden="true"
        className="absolute inset-[-20%] rounded-full"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 2.2px, transparent 2.8px)',
          backgroundSize: '17px 17px',
          WebkitMask: 'radial-gradient(circle, #000 38%, transparent 68%)',
          mask: 'radial-gradient(circle, #000 38%, transparent 68%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-[-4%] rounded-full border-2 border-dashed border-white/45 motion-safe:animate-[spin_180s_linear_infinite_reverse]"
      />

      {/* Floating shapes */}
      <span aria-hidden="true" className="absolute -left-[6%] top-[8%] font-display text-5xl text-marigold-400 motion-safe:animate-[float_10s_ease-in-out_infinite]">✺</span>
      <span aria-hidden="true" className="absolute right-[2%] top-[-2%] font-display text-6xl leading-none text-white/90 motion-safe:animate-[float_12s_ease-in-out_infinite]">+</span>
      <span aria-hidden="true" className="absolute left-[6%] bottom-[2%] w-6 h-6 rotate-45 bg-mint-300 border-2 border-ink motion-safe:animate-[float_13s_ease-in-out_infinite]" />
      <span aria-hidden="true" className="absolute right-[-3%] bottom-[22%] w-5 h-5 rounded-full bg-coral-400 border-2 border-ink motion-safe:animate-[float_11s_ease-in-out_infinite]" />

      {/* Offset discs, like misregistered print layers */}
      <div aria-hidden="true" className="absolute inset-[4%] rounded-full bg-coral-400 border-[3px] border-ink translate-x-[6%] translate-y-[5%]" />
      <div aria-hidden="true" className="absolute inset-[4%] rounded-full bg-marigold-400 border-[3px] border-ink translate-x-[3%] translate-y-[2.5%]" />

      {/* Tilting emblem */}
      <div ref={tiltRef} className="absolute inset-[4%] will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        <button
          type="button"
          onClick={() => setSpins((n) => n + 1)}
          aria-label="Spin the Sumshodhini emblem" title="Give it a spin"
          className="group absolute inset-0 rounded-full bg-white border-4 border-ink shadow-pop-lg overflow-hidden cursor-pointer"
        >
          <img
            key={spins}
            src="/Sumshodhini26icon.png"
            alt="Sumshodhini '26 emblem"
            className={`w-full h-full object-contain scale-[1.12] ${spins > 0 ? 'animate-[spin_1.8s_cubic-bezier(0.65,0,0.35,1)_1]' : ''} transition-transform duration-300 group-hover:scale-[1.18]`}
            onError={(e) => { e.currentTarget.src = '/logo.png'; }}
          />
        </button>
      </div>

      {/* Ring of text */}
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-[-11%] w-[122%] h-[122%] motion-safe:animate-[spin_70s_linear_infinite] pointer-events-none">
        <defs>
          <path id="stage-ring" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0" />
        </defs>
        <text fontSize="9.6" fontWeight="800" letterSpacing="1.9" fill="#FFFFFF" className="font-display">
          <textPath href="#stage-ring">{RING}</textPath>
        </text>
      </svg>

      {/* Orbiting stickers */}
      <div aria-hidden="true" className="absolute inset-[-6%] motion-safe:animate-[spin_80s_linear_infinite] pointer-events-none">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <span className="block motion-safe:animate-[spin_80s_linear_infinite_reverse] px-4 py-2 rounded-full bg-mint-300 border-2 border-ink shadow-pop-sm text-sm font-bold text-ink">
            2 days
          </span>
        </span>
        <span className="absolute right-0 top-1/2 translate-x-1/3 -translate-y-1/2">
          <span className="block motion-safe:animate-[spin_80s_linear_infinite_reverse] w-24 h-24 rounded-full bg-white border-2 border-ink shadow-pop-sm text-xs font-bold text-ink flex items-center justify-center text-center leading-tight p-2 -rotate-6">
            Student
            <br />
            led
          </span>
        </span>
        <span className="absolute left-0 top-[62%] -translate-x-1/4">
          <span className="block motion-safe:animate-[spin_80s_linear_infinite_reverse] px-4 py-2 rounded-full bg-ink border-2 border-white text-sm font-bold text-white">
            Warangal
          </span>
        </span>
      </div>


    </div>
  );
}
