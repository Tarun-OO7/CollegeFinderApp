'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Trophy, Sparkles, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

const QUICK_LINKS = [
  { label: 'IIT Delhi', search: 'Indian Institute of Technology, Delhi' },
  { label: 'NIT Trichy', search: 'National Institute of Technology, Tiruchirappalli' },
  { label: 'VIT Vellore', search: 'Vellore Institute of Technology' },
];

export default function HeroSection({
  totalColleges = 0,
  totalStates = 0,
  topRating = 0,
  totalRecruiters = 0,
  searchValue = '',
  onSearchChange,
}) {
  const c = useCountUp(totalColleges);
  const s = useCountUp(totalStates);
  const r = useCountUp(Math.round(topRating * 10)); // store one decimal
  const rec = useCountUp(totalRecruiters);

  const hasValue = Boolean(searchValue);

  return (
    <section
      className="relative isolate overflow-hidden rounded-3xl"
      style={{ background: '#0E1117', border: '0.5px solid #2E3347' }}
    >
      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Left content */}
          <div className="max-w-2xl animate-fade-in-up flex-1">
            {/* NIRF badge — plain text, no pill */}
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-medium"
              style={{ color: '#C6A84B', letterSpacing: '0.05em' }}
            >
              <Sparkles className="h-3 w-3" style={{ color: '#C6A84B' }} />
              <span>NIRF · 2025 data · Updated June 2026</span>
            </span>

            {/* Headline — 48px / 500 */}
            <h1
              className="mt-5 font-display leading-[1.08] tracking-tight text-balance"
              style={{ fontSize: '48px', fontWeight: 500, color: '#F0EDE6' }}
            >
              Find your college.
            </h1>

            {/* Subtitle – 16px, muted */}
            <p
              className="mt-3"
              style={{ fontSize: '16px', color: '#5A5D6B' }}
            >
              Compare 500+ Indian colleges by fees, placements &amp; location
            </p>

            {/* Search bar */}
            <div className="relative mt-6 w-full group">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#5A5D6B' }} />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search by name, city or state..."
                aria-label="Search colleges"
                className="w-full pl-12 pr-28 text-base transition-shadow focus-visible:ring-2 focus-visible:ring-offset-0"
                style={{
                  minHeight: '52px',
                  background: '#1A1F2E',
                  border: '0.5px solid #2E3347',
                  borderRadius: '10px',
                  color: '#F0EDE6',
                }}
              />
              {hasValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-[108px] top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ color: '#5A5D6B' }}
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
              <button
                type="button"
                onClick={() => {/* search is live */}}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-10 items-center gap-2 px-5 text-sm font-semibold shadow-sm transition-all hover:opacity-90 active:scale-[0.97]"
                style={{
                  background: '#C6A84B',
                  color: '#0E1117',
                  borderRadius: '6px',
                }}
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {/* Quick-link chips — square corners, transparent bg */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs mr-1" style={{ color: '#5A5D6B' }}>Popular:</span>
              {QUICK_LINKS.map(({ label, search }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onSearchChange?.(search)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80 active:scale-95"
                  style={{
                    border: '0.5px solid #2E3347',
                    color: '#5A5D6B',
                    background: 'transparent',
                    borderRadius: '4px',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stat grid */}
          <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:max-w-md animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <StatCard icon={<Building2 className="h-4 w-4" />}  label="Colleges"   value={c} />
            <StatCard icon={<MapPin className="h-4 w-4" />}    label="States"     value={s} />
            <StatCard icon={<Trophy className="h-4 w-4" />}    label="Top Rating" value={(r / 10).toFixed(1)} suffix=" / 5" isRating />
            <StatCard icon={<Sparkles className="h-4 w-4" />}  label="Recruiters" value={rec} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, suffix = '', isRating = false }) {
  return (
    <div className="flex flex-col justify-center">
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5A5D6B' }}>
        {label}
      </div>
      <div
        className="font-display tabular-nums"
        style={{ fontSize: '26px', fontWeight: 500, color: isRating ? '#C6A84B' : '#F0EDE6', lineHeight: 1.1 }}
      >
        {value}{suffix}
      </div>
    </div>
  );
}
