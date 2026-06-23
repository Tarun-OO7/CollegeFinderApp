'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Trophy, Sparkles } from 'lucide-react';
import SplitText from '@/components/SplitText';

const YELLOW = '#F5C800';

function useCountUp(target, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export default function HeroSection({ totalColleges = 0, totalStates = 0, topRating = 0, totalRecruiters = 0 }) {
  const c = useCountUp(totalColleges);
  const s = useCountUp(totalStates);
  const r = useCountUp(Math.round(topRating * 10));
  const rec = useCountUp(totalRecruiters);

  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: '#0A0A0A', borderRadius: 4 }}
    >
      {/* Subtle decorative grid — white at 4% opacity, masked */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Top strip with NIRF source badge */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-6 py-4 sm:px-10">
        <span
          className="inline-flex items-center px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black"
          style={{ background: YELLOW, borderRadius: 2 }}
        >
          NIRF 2024 Rankings
        </span>
        <span className="text-[11px] uppercase tracking-wider text-white/60">Demo data for illustration</span>
        <span className="ml-auto hidden sm:inline-flex items-center text-[10px] uppercase tracking-[0.22em] text-white/40">
          Editorial · India 2026
        </span>
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="pl-5 sm:pl-6" style={{ borderLeft: `6px solid ${YELLOW}` }}>
              <SplitText
                text="Find your college."
                tag="h1"
                className="font-headline text-[clamp(2.75rem,9vw,7rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
                textAlign="left"
                delay={32}
                duration={1.0}
                ease="power3.out"
                from={{ opacity: 0, y: 56 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
                rootMargin="0px"
              />
            </div>
            <p className="mt-6 max-w-xl text-base text-[#AAAAAA] sm:text-lg leading-relaxed">
              Browse, filter and compare India's top NIRF-ranked engineering institutes — IITs, NITs, IIITs and leading private universities — in one editorial workspace.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 lg:max-w-md">
            <div className="col-span-2 -mb-1 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em]" style={{ color: YELLOW }}>
              <span aria-hidden>📊</span>
              <span>Live stats</span>
              <span className="inline-block h-[2px] w-10" style={{ background: YELLOW }} />
            </div>
            <StatCard icon={<Building2 className="h-4 w-4" />}  label="Colleges"   value={c} />
            <StatCard icon={<MapPin className="h-4 w-4" />}    label="States"     value={s} />
            <StatCard icon={<Trophy className="h-4 w-4" />}    label="Top Rating" value={(r / 10).toFixed(1)} suffix=" / 5" />
            <StatCard icon={<Sparkles className="h-4 w-4" />}  label="Recruiters" value={rec} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, suffix = '' }) {
  return (
    <div
      className="relative p-4 transition-colors"
      style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${YELLOW}`, borderRadius: 4 }}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: YELLOW }}>
        <span aria-hidden>{icon}</span>
        {label}
      </div>
      <div className="mt-2 font-headline text-2xl uppercase tracking-tight tabular-nums text-white">
        {value}{suffix}
      </div>
    </div>
  );
}
