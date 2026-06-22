'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import colleges from '@/data/colleges.json';
import CompareTable from '@/components/colleges/CompareTable';
import CompareChart from '@/components/colleges/CompareChart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { GitCompareArrows, Sparkles, Plus, X } from 'lucide-react';
import { getCompareIds, removeCompareId, MAX_COMPARE } from '@/lib/compareStore';

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
      <div className="text-sm font-medium text-muted-foreground">
        1. Browse colleges &rarr; 2. Add to shortlist &rarr; 3. Compare side by side
      </div>

      <section className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-hero-mesh p-6 sm:p-8 animate-fade-in-up">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> Side-by-side comparison
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Your <span className="gradient-text">shortlist</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare up to {MAX_COMPARE} colleges side-by-side — <span className="font-medium text-foreground tabular-nums">{selected.length}/{MAX_COMPARE}</span> added.
            </p>
          </div>
          {selected.length > 0 && (
            <Button variant="outline" className="rounded-xl bg-background" onClick={() => { selected.forEach((c) => removeCompareId(c.id)); setIds([]); }}>
              Clear all
            </Button>
          )}
        </div>
      </section>

      {!ready ? (
        <Card className="rounded-2xl"><CardContent className="py-16 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          {/* 3 Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => {
              const c = selected[i];
              if (c) {
                return (
                  <Card key={c.id} className="relative p-4 flex flex-col justify-center rounded-2xl border-border/60 shadow-soft">
                    <div className="font-semibold text-base line-clamp-1 pr-6">{c.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">{c.location}, {c.state}</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full" 
                      onClick={() => handleRemove(c.id)}
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Card>
                );
              } else {
                return (
                  <Link href="/" key={`empty-${i}`} className="block h-full focus:outline-none">
                    <Card className="h-full min-h-[100px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/20 hover:bg-muted/40 transition-colors focus-visible:ring-2 focus-visible:ring-primary/40">
                      <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-sm font-medium text-muted-foreground">Add a college</span>
                    </Card>
                  </Link>
                );
              }
            })}
          </div>

          {selected.length > 0 && (
            <>
              <CompareTable colleges={selected} onRemove={handleRemove} />
              <CompareChart colleges={selected} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
