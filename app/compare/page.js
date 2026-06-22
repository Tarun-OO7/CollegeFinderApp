'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import colleges from '@/data/colleges.json';
import CompareTable from '@/components/colleges/CompareTable';
import CompareChart from '@/components/colleges/CompareChart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitCompareArrows, Sparkles } from 'lucide-react';
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
            <Button variant="outline" className="rounded-xl" onClick={() => { selected.forEach((c) => removeCompareId(c.id)); setIds([]); }}>
              Clear all
            </Button>
          )}
        </div>
      </section>

      {!ready ? (
        <Card className="rounded-2xl"><CardContent className="py-16 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : selected.length === 0 ? (
        <Card className="rounded-2xl border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GitCompareArrows className="h-7 w-7" />
            </div>
            <div className="font-display text-lg font-semibold">No colleges added yet</div>
            <p className="max-w-xs text-sm text-muted-foreground">Open any college and tap &quot;Add to Compare&quot; to start building your shortlist.</p>
            <Link href="/"><Button className="rounded-xl">Browse colleges</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          <CompareTable colleges={selected} onRemove={handleRemove} />
          <CompareChart colleges={selected} />
        </div>
      )}
    </div>
  );
}
