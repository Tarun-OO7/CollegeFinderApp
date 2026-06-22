'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Trophy, Sparkles } from 'lucide-react';

// Animated counter that eases from 0 to the target value once on mount.
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
  const r = useCountUp(Math.round(topRating * 10)); // store one decimal
  const rec = useCountUp(totalRecruiters);

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-hero-mesh">
      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.5] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>NIRF · 2025 data · Updated June 2026</span>
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Find the right college,{' '}
              <span className="gradient-text">faster</span>.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Browse, filter and compare India's top engineering institutes — IITs, NITs, IIITs and leading private universities — all in one elegant workspace.
            </p>
          </div>

          {/* Stat grid */}
          <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:max-w-md animate-fade-in-up" style={{ animationDelay: '120ms' }}>
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
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur transition-shadow hover:shadow-soft">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-bold tabular-nums">
        {value}{suffix}
      </div>
    </div>
  );
}
