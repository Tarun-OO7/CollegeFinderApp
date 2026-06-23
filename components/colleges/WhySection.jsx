'use client';

import { Trophy, BarChart3, GitCompareArrows, MapPinned, Sparkles } from 'lucide-react';

// Editorial bento — pure black/white/yellow palette, edge-to-edge.
const YELLOW = '#F5C800';
const INK = '#0A0A0A';
const CARDS = [
  {
    id: 'nirf',
    title: '100 NIRF-ranked colleges',
    desc: 'Curated from the official NIRF 2024 list.',
    icon: Trophy,
    spanClass: 'lg:col-span-3 lg:row-span-2',
    bg: YELLOW,
    fg: '#000',
    accent: 'tri-black',
    big: true,
  },
  {
    id: 'data',
    title: 'Real placement data',
    desc: 'Avg & highest packages, top recruiters.',
    icon: BarChart3,
    spanClass: 'lg:col-span-3 lg:row-span-1',
    bg: INK,
    fg: '#fff',
  },
  {
    id: 'compare',
    title: 'Compare 3 side-by-side',
    desc: 'Fees, packages, ratings — visualized.',
    icon: GitCompareArrows,
    spanClass: 'lg:col-span-2 lg:row-span-1',
    bg: '#fff',
    fg: '#000',
  },
  {
    id: 'states',
    title: 'Across 25 states',
    desc: 'From Kashmir to Kanyakumari.',
    icon: MapPinned,
    spanClass: 'lg:col-span-2 lg:row-span-1',
    bg: INK,
    fg: '#fff',
    accent: 'tri-yellow',
  },
  {
    id: 'instant',
    title: 'Instant filtering',
    desc: 'Search, sort & paginate — zero loading.',
    icon: Sparkles,
    spanClass: 'lg:col-span-2 lg:row-span-1',
    bg: YELLOW,
    fg: '#000',
  },
];

export default function WhySection() {
  return (
    <section className="relative">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span
            className="inline-flex items-center px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black"
            style={{ background: YELLOW, borderRadius: 2 }}
          >
            Why
          </span>
          <h2 className="mt-3 font-headline text-3xl sm:text-5xl uppercase leading-[0.95] tracking-tight text-white">
            Why <span className="gradient-text">CollegeFinder</span>
          </h2>
        </div>
        <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.22em] text-white/40">Built for decisions, not browsing.</span>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-6 lg:auto-rows-[180px] overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}
      >
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <article
              key={c.id}
              className={`relative isolate overflow-hidden p-5 sm:p-7 ${c.spanClass}`}
              style={{ background: c.bg, color: c.fg }}
            >
              {c.accent === 'tri-black' && (
                <div className="pointer-events-none absolute -top-1 -right-1 h-28 w-28" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)', background: '#000' }} />
              )}
              {c.accent === 'tri-yellow' && (
                <div className="pointer-events-none absolute -bottom-1 -left-1 h-24 w-24" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)', background: YELLOW }} />
              )}

              <div className="relative flex h-full flex-col justify-between gap-6">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
                <div>
                  <h3
                    className="font-headline uppercase leading-[0.95] tracking-tight"
                    style={{ fontSize: c.big ? 'clamp(1.5rem, 3vw, 2.75rem)' : 'clamp(1.25rem, 2vw, 2rem)', fontWeight: 900 }}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm opacity-80 max-w-[30ch]">{c.desc}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
