'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import colleges from '@/data/colleges.json';
import SplitText from '@/components/SplitText';
import CompareTable from '@/components/colleges/CompareTable';
import CompareChart from '@/components/colleges/CompareChart';
import { Card, CardContent } from '@/components/ui/card';
import { GitCompareArrows } from 'lucide-react';
import { getCompareIds, removeCompareId, MAX_COMPARE } from '@/lib/compareStore';

const YELLOW = '#F5C800';

export default function ComparePage() {
  const [ids, setIds] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(getCompareIds());
    setReady(true);
    const sync = () => setIds(getCompareIds());
    window.addEventListener('compare:update', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('compare:update', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const selected = ids.map((id) => colleges.find((c) => c.id === id)).filter(Boolean);

  const handleRemove = (id) => { setIds(removeCompareId(id)); };

  return (
    <div className="container py-6 sm:py-10 space-y-6">
      {/* Editorial Reven-style header: deep black with yellow accent stripe */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: '#0A0A0A', borderRadius: 4 }}
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-6 py-4 sm:px-10">
          <span
            className="inline-flex items-center px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black"
            style={{ background: YELLOW, borderRadius: 2 }}
          >
            Compare
          </span>
          <span className="text-[11px] uppercase tracking-wider text-white/60">
            {selected.length}/{MAX_COMPARE} colleges selected
          </span>
          <span className="ml-auto hidden sm:inline-flex items-center text-[10px] uppercase tracking-[0.22em] text-white/40">
            Side-by-side analysis
          </span>
        </div>

        <div className="px-6 py-10 sm:px-10 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="pl-5 sm:pl-6" style={{ borderLeft: `6px solid ${YELLOW}` }}>
                <SplitText
                  text="Your Shortlist"
                  tag="h1"
                  className="font-headline text-[clamp(2.25rem,6vw,5rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
                  textAlign="left"
                  delay={32}
                  duration={0.9}
                  ease="power3.out"
                  from={{ opacity: 0, y: 48 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                  rootMargin="0px"
                />
              </div>
              <p className="mt-5 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
                Compare up to <span style={{ color: YELLOW }} className="font-bold">{MAX_COMPARE}</span> colleges side-by-side — fees, placements, ratings, recruiters — in one editorial view.
              </p>
            </div>
            {selected.length > 0 && (
              <button
                onClick={() => { selected.forEach((c) => removeCompareId(c.id)); setIds([]); }}
                className="inline-flex shrink-0 items-center gap-2 px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-black"
                style={{ background: YELLOW, borderRadius: 4 }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {!ready ? (
        <div className="py-16 text-center text-muted-foreground">Loading…</div>
      ) : selected.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-20 text-center"
          style={{ background: '#0A0A0A', borderRadius: 4 }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center"
            style={{ background: YELLOW, color: '#000', borderRadius: 4 }}
          >
            <GitCompareArrows className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <div className="font-headline text-2xl uppercase tracking-tight text-white">No colleges added yet</div>
          <p className="max-w-xs text-sm text-white/60">Open any college and tap &quot;Add to Compare&quot; to start building your shortlist.</p>
          <Link href="/">
            <button
              className="mt-2 inline-flex items-center px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-black"
              style={{ background: YELLOW, borderRadius: 4 }}
            >
              Browse colleges
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          <CompareTable colleges={selected} onRemove={handleRemove} />
          <CompareChart colleges={selected} />
        </div>
      )}
    </div>
  );
}
