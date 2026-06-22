'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import colleges from '@/data/colleges.json';
import CollegeCard from '@/components/colleges/CollegeCard';

import FilterPanel from '@/components/colleges/FilterPanel';
import HeroSection from '@/components/colleges/HeroSection';
import ActiveFilters from '@/components/colleges/ActiveFilters';
import Pagination from '@/components/ui/pagination-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, SearchX, ArrowUpDown } from 'lucide-react';

const FEE_CEILING = 2000000;
const INITIAL_FILTERS = { state: 'all', type: 'all', maxFees: FEE_CEILING, minRating: 0 };
const DEFAULT_SORT = 'rating-desc';
const PAGE_SIZE = 12;

function readFromUrl(sp) {
  return {
    q: sp.get('q') || '',
    filters: {
      state: sp.get('state') || 'all',
      type: sp.get('type') || 'all',
      maxFees: Number(sp.get('maxFees')) || FEE_CEILING,
      minRating: Number(sp.get('minRating')) || 0,
    },
    sort: sp.get('sort') || DEFAULT_SORT,
    page: Math.max(1, Number(sp.get('page')) || 1),
  };
}

function HomeInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => readFromUrl(searchParams), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [query, setQuery] = useState(initial.q);
  const [filters, setFilters] = useState(initial.filters);
  const [sort, setSort] = useState(initial.sort);
  const [page, setPage] = useState(initial.page);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, []);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    setPage(1);
  }, [query, filters, sort]);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (query) sp.set('q', query);
    if (filters.state !== 'all') sp.set('state', filters.state);
    if (filters.type !== 'all') sp.set('type', filters.type);
    if (filters.maxFees !== FEE_CEILING) sp.set('maxFees', String(filters.maxFees));
    if (filters.minRating !== 0) sp.set('minRating', String(filters.minRating));
    if (sort !== DEFAULT_SORT) sp.set('sort', sort);
    if (page > 1) sp.set('page', String(page));
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [query, filters, sort, page, pathname, router]);

  const states = useMemo(() => {
    const s = new Set();
    (colleges || []).forEach((c) => c?.state && s.add(c.state));
    return Array.from(s).sort();
  }, []);

  // Pre-computed metrics for the hero (kept here so HeroSection stays pure).
  const heroStats = useMemo(() => {
    const totalColleges = colleges.length;
    const states = new Set();
    const recruiters = new Set();
    let top = 0;
    colleges.forEach((c) => {
      if (c?.state) states.add(c.state);
      if (typeof c?.rating === 'number') top = Math.max(top, c.rating);
      (c?.placements?.topRecruiters || []).forEach((r) => recruiters.add(r));
    });
    return { totalColleges, totalStates: states.size, topRating: top, totalRecruiters: recruiters.size };
  }, []);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (colleges || []).filter((c) => {
      if (!c) return false;
      if (q) {
        const hay = `${c.name || ''} ${c.location || ''} ${c.state || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.state !== 'all' && c.state !== filters.state) return false;
      if (filters.type !== 'all' && c.type !== filters.type) return false;
      if (typeof c.totalFees === 'number' && c.totalFees > filters.maxFees) return false;
      if (filters.minRating > 0) {
        if (typeof c.rating !== 'number' || c.rating < filters.minRating) return false;
      }
      return true;
    });

    const cmpNum = (a, b, dir) => {
      const an = typeof a === 'number';
      const bn = typeof b === 'number';
      if (!an && !bn) return 0;
      if (!an) return 1;
      if (!bn) return -1;
      return dir === 'asc' ? a - b : b - a;
    };

    const sorted = [...list];
    switch (sort) {
      case 'rating-desc': sorted.sort((a, b) => cmpNum(a.rating, b.rating, 'desc')); break;
      case 'fees-asc':    sorted.sort((a, b) => cmpNum(a.totalFees, b.totalFees, 'asc')); break;
      case 'fees-desc':   sorted.sort((a, b) => cmpNum(a.totalFees, b.totalFees, 'desc')); break;
      case 'name-asc':    sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      default: break;
    }
    return sorted;
  }, [query, filters, sort]);

  const total = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const paged = filteredSorted.slice(startIdx, endIdx);

  const resetAll = () => { setQuery(''); setFilters(INITIAL_FILTERS); setSort(DEFAULT_SORT); setPage(1); };
  const handlePageChange = (p) => {
    setPage(p);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const clearChip = (key) => {
    if (key === 'q') setQuery('');
    else if (key === 'sort') setSort(DEFAULT_SORT);
    else if (key === 'all') resetAll();
    else setFilters({ ...filters, [key]: INITIAL_FILTERS[key] });
  };

  return (
    <div className="container py-6 sm:py-10 space-y-8">
      <HeroSection {...heroStats} searchValue={query} onSearchChange={setQuery} />

      {/* Sort + Mobile Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-12 sm:w-56 gap-2 rounded-xl border-border/70 bg-background shadow-soft">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating-desc">Rating (High → Low)</SelectItem>
            <SelectItem value="fees-asc">Fees (Low → High)</SelectItem>
            <SelectItem value="fees-desc">Fees (High → Low)</SelectItem>
            <SelectItem value="name-asc">Name (A → Z)</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden gap-2 h-12 rounded-xl">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
            <div className="mt-4">
              <FilterPanel filters={filters} onChange={setFilters} states={states} onReset={() => setFilters(INITIAL_FILTERS)} maxFeeCeiling={FEE_CEILING} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} onChange={setFilters} states={states} onReset={() => setFilters(INITIAL_FILTERS)} maxFeeCeiling={FEE_CEILING} />
        </aside>

        <section>
          <ActiveFilters query={query} filters={filters} sort={sort} onClear={clearChip} feeCeiling={FEE_CEILING} />

          <div className="mb-5 flex items-center justify-between">
            <h2
              className="font-display font-semibold tracking-tight"
              style={{
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#8A8377',
              }}
            >
              {loading ? 'Loading colleges…' : total === 0 ? 'No matches' : 'Top picks for you'}
            </h2>
            <span className="text-sm text-muted-foreground tabular-nums">
              {!loading && total > 0 && `Showing ${startIdx + 1}–${endIdx} of ${total}`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-gradient-to-br from-muted/40 via-muted/60 to-muted/40 bg-[length:400px_100%] animate-shimmer" />
              ))}
            </div>
          ) : total === 0 ? (
            <Card className="rounded-2xl border-dashed border-border bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <SearchX className="h-7 w-7" />
                </div>
                <div className="font-display text-lg font-semibold">Nothing matches yet</div>
                <p className="max-w-xs text-sm text-muted-foreground">Try removing a filter or broadening your search to see more colleges.</p>
                <Button variant="outline" onClick={resetAll} className="rounded-xl">Reset filters</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in">
                {paged.map((c, i) => (
                  <div key={c.id} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }} className="animate-fade-in-up">
                    <CollegeCard college={c} />
                  </div>
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="container py-10 text-muted-foreground">Loading…</div>}>
      <HomeInner />
    </Suspense>
  );
}
