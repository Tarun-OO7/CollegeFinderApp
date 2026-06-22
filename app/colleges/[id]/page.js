'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import colleges from '@/data/colleges.json';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Star, IndianRupee, ArrowLeft, GitCompareArrows, Check, Sparkles, TrendingUp, GraduationCap, Briefcase } from 'lucide-react';
import { formatINR, formatRating, safe } from '@/lib/format';
import { addCompareId, getCompareIds, MAX_COMPARE, removeCompareId } from '@/lib/compareStore';
import { useToast } from '@/hooks/use-toast';

const TYPE_GRADIENT = {
  Govt:    'from-indigo-500 via-violet-500 to-fuchsia-500',
  Private: 'from-emerald-500 via-teal-500 to-cyan-500',
  Deemed:  'from-amber-500 via-orange-500 to-rose-500',
};

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [inCompare, setInCompare] = useState(false);

  const college = colleges.find((c) => c.id === id);

  useEffect(() => { setInCompare(getCompareIds().includes(id)); }, [id]);

  if (!college) {
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">College not found</h1>
        <p className="text-muted-foreground mb-6">The college you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/')} className="rounded-xl">Back to listing</Button>
      </div>
    );
  }

  const handleCompare = () => {
    if (inCompare) {
      removeCompareId(id);
      setInCompare(false);
      toast({ title: 'Removed from compare' });
      return;
    }
    const res = addCompareId(id);
    if (!res.ok && res.reason === 'max') {
      toast({ title: `You can compare up to ${MAX_COMPARE} colleges`, variant: 'destructive' });
      return;
    }
    setInCompare(true);
    toast({ title: 'Added to compare', description: 'View your comparison from the top nav.' });
  };

  const gradient = TYPE_GRADIENT[college.type] || TYPE_GRADIENT.Govt;
  const p = college.placements || { topRecruiters: [] };

  return (
    <div className="container py-6 sm:py-10 max-w-6xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5 -ml-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Button>

      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft animate-fade-in-up">
        <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />
        <div className="relative bg-hero-mesh">
          <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground ring-1 ring-border">
                    {safe(college.type)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-[10px] text-muted-foreground ring-1 ring-border">
                    <MapPin className="h-3 w-3" /> {safe(college.location)}, {safe(college.state)}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
                  {college.name}
                </h1>
                <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">{safe(college.overview, 'No overview available.')}</p>
              </div>
              <Button onClick={handleCompare} size="lg" className={`gap-2 rounded-xl ${inCompare ? '' : 'shadow-glow'}`} variant={inCompare ? 'secondary' : 'default'}>
                {inCompare ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
                {inCompare ? 'In Compare' : 'Add to Compare'}
              </Button>
            </div>

            {/* Hero stat row */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HeroStat icon={<Star className="h-4 w-4 fill-amber-500 text-amber-500" />} label="Rating" value={formatRating(college.rating)} suffix={typeof college.rating === 'number' ? ' / 5' : ''} />
              <HeroStat icon={<IndianRupee className="h-4 w-4 text-indigo-500" />} label="Total Fees" value={formatINR(college.totalFees)} />
              <HeroStat icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} label="Avg Package" value={formatINR(p.averagePackage)} />
              <HeroStat icon={<Sparkles className="h-4 w-4 text-rose-500" />} label="Highest Package" value={formatINR(p.highestPackage)} />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex rounded-xl bg-muted/60 p-1">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:shadow-soft">Overview</TabsTrigger>
          <TabsTrigger value="courses"  className="rounded-lg data-[state=active]:shadow-soft">Courses</TabsTrigger>
          <TabsTrigger value="placements" className="rounded-lg data-[state=active]:shadow-soft">Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="rounded-2xl border-border/60">
            <CardContent className="pt-6 space-y-6">
              <p className="text-sm sm:text-base leading-relaxed text-foreground/80">{safe(college.overview, 'No overview available.')}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <DetailStat label="Type" value={safe(college.type)} />
                <DetailStat label="State" value={safe(college.state)} />
                <DetailStat label="Rating" value={formatRating(college.rating)} />
                <DetailStat label="Total Fees" value={formatINR(college.totalFees)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card className="rounded-2xl border-border/60">
            <CardContent className="pt-6">
              {(!college.courses || college.courses.length === 0) ? (
                <p className="text-muted-foreground text-sm">No courses available.</p>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {college.courses.map((c, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <GraduationCap className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="font-medium leading-tight">{safe(c.name)}</div>
                            <div className="text-xs text-muted-foreground">{safe(c.duration)}</div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-full whitespace-nowrap">{formatINR(c.fees)}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placements">
          <Card className="rounded-2xl border-border/60">
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PackageCard label="Average Package" value={formatINR(p.averagePackage)} accent="from-emerald-500 to-teal-500" />
                <PackageCard label="Highest Package" value={formatINR(p.highestPackage)} accent="from-fuchsia-500 to-rose-500" />
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-display text-sm font-semibold tracking-tight">Top Recruiters</span>
                </div>
                {(!p.topRecruiters || p.topRecruiters.length === 0) ? (
                  <p className="text-sm text-muted-foreground">N/A</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {p.topRecruiters.map((r) => (
                      <Badge key={r} variant="secondary" className="rounded-full px-3 py-1 text-xs">{r}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroStat({ icon, label, value, suffix = '' }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-1 font-display text-xl font-bold tabular-nums">{value}{suffix}</div>
    </div>
  );
}

function DetailStat({ label, value }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}

function PackageCard({ label, value, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
