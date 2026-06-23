'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import colleges from '@/data/colleges.json';
import SplitText from '@/components/SplitText';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, ArrowLeft, GitCompareArrows, Check, GraduationCap, Briefcase } from 'lucide-react';
import { formatINR, formatRating, safe } from '@/lib/format';
import { addCompareId, getCompareIds, MAX_COMPARE, removeCompareId } from '@/lib/compareStore';
import { useToast } from '@/hooks/use-toast';

// Reven-inspired editorial palette — locked to this page only.
const INK    = '#0A0A0A';
const YELLOW = '#F5C800';

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
        <h1 className="font-headline text-4xl uppercase tracking-tight mb-2">College not found</h1>
        <p className="text-muted-foreground mb-6">The college you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 bg-[#F5C800] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-black"
          style={{ borderRadius: 4 }}
        >
          Back to browse
        </button>
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

  const p = college.placements || { topRecruiters: [] };
  const recruiters = p.topRecruiters || [];
  const courses = college.courses || [];

  return (
    <div className="bg-white">
      <div className="container py-6 sm:py-10 max-w-6xl">
        {/* Back link — yellow arrow */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-black hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" style={{ color: YELLOW }} strokeWidth={3} />
          Back to browse
        </button>

        {/* HERO — deep black with yellow accent stripe on college name */}
        <section
          className="relative overflow-hidden text-white"
          style={{ background: INK, borderRadius: 4 }}
        >
          {/* Top black bar with rank / type / location tags */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-6 py-4 sm:px-10">
            {typeof college.rank === 'number' && (
              <div
                className="inline-flex items-stretch overflow-hidden text-[11px] font-extrabold uppercase tracking-wider"
                style={{ borderRadius: 2 }}
              >
                <span
                  className="inline-flex items-center px-2 py-1 text-black"
                  style={{ background: YELLOW }}
                >
                  #{college.rank}
                </span>
                <span
                  className="inline-flex items-center px-2 py-1 text-white"
                  style={{ background: '#000', letterSpacing: '0.18em' }}
                >
                  NIRF 2024
                </span>
              </div>
            )}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white"
              style={{ background: '#000', borderRadius: 2 }}
            >
              <span aria-hidden>🏛️</span> {safe(college.type)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/70">
              <MapPin className="h-3 w-3" /> {safe(college.location)}, {safe(college.state)}
            </span>
            <span className="ml-auto hidden sm:inline-flex items-center text-[10px] uppercase tracking-[0.22em] text-white/40">
              NIRF 2024 · Profile
            </span>
          </div>

          {/* Headline + CTA */}
          <div className="px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="pl-5 sm:pl-6" style={{ borderLeft: `6px solid ${YELLOW}` }}>
                  <SplitText
                    text={college.name}
                    tag="h1"
                    className="font-headline text-[clamp(2.5rem,7vw,6rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
                    textAlign="left"
                    delay={28}
                    duration={0.9}
                    ease="power3.out"
                    from={{ opacity: 0, y: 48 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.2}
                    rootMargin="0px"
                  />
                </div>
                <p className="mt-6 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
                  {safe(college.overview, 'No overview available.')}
                </p>
              </div>

              {/* Add to Compare — sharp yellow */}
              <button
                onClick={handleCompare}
                className="group inline-flex shrink-0 items-center gap-2 px-5 py-3 text-sm font-extrabold uppercase tracking-wider transition-colors"
                style={{
                  background: inCompare ? '#fff' : YELLOW,
                  color: '#000',
                  borderRadius: 4,
                }}
              >
                {inCompare ? <Check className="h-4 w-4" strokeWidth={3} /> : <GitCompareArrows className="h-4 w-4" strokeWidth={3} />}
                {inCompare ? 'In Compare' : 'Add to Compare'}
              </button>
            </div>

            {/* Stat cards — black bg, yellow labels, white values */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HeroStat emoji="⭐" label="Rating" value={formatRating(college.rating)} suffix={typeof college.rating === 'number' ? ' / 5' : ''} />
              <HeroStat emoji="💰" label="Total Fees" value={formatINR(college.totalFees)} />
              <HeroStat emoji="💼" label="Avg Package" value={formatINR(p.averagePackage)} />
              <HeroStat emoji="✨" label="Highest Package" value={formatINR(p.highestPackage)} />
            </div>
          </div>
        </section>

        {/* TABS — yellow bottom border on active */}
        <Tabs defaultValue="overview" className="mt-10">
          <TabsList
            className="inline-flex h-auto items-end gap-0 rounded-none border-b border-black/15 bg-transparent p-0"
          >
            {[
              { v: 'overview',  label: 'Overview' },
              { v: 'courses',   label: 'Courses' },
              { v: 'placements', label: 'Placements' },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="rounded-none border-b-[3px] border-transparent bg-transparent px-5 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-neutral-500 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none transition-colors"
                style={{}}
                data-yellow-border
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <p className="text-sm sm:text-base leading-relaxed text-black/80 max-w-3xl">
              {safe(college.overview, 'No overview available.')}
            </p>

            {/* Info grid — thin yellow left-border cells */}
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              <InfoRow label="Type"        value={safe(college.type)} />
              <InfoRow label="State"       value={safe(college.state)} />
              <InfoRow label="Rating"      value={formatRating(college.rating)} />
              <InfoRow label="Total Fees"  value={formatINR(college.totalFees)} />
            </div>

            {/* Courses preview */}
            <div className="mt-12">
              <SectionLabel emoji="🎓">Courses Offered</SectionLabel>
              <CoursesList courses={courses} />
            </div>
          </TabsContent>

          <TabsContent value="courses" className="mt-8">
            <SectionLabel emoji="🎓">Courses Offered</SectionLabel>
            <CoursesList courses={courses} />
          </TabsContent>

          <TabsContent value="placements" className="mt-8 space-y-10">
            {/* Package cards — black with yellow accent */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PackageBlock emoji="💼" label="Average Package" value={formatINR(p.averagePackage)} />
              <PackageBlock emoji="✨" label="Highest Package" value={formatINR(p.highestPackage)} />
            </div>

            {/* Recruiters — solid yellow tags with black text */}
            <div>
              <SectionLabel emoji="💼">
                Top Recruiters <span className="text-black/40 font-normal normal-case tracking-normal ml-1">({recruiters.length})</span>
              </SectionLabel>
              {recruiters.length === 0 ? (
                <p className="mt-3 text-sm text-black/60">Recruiter data unavailable</p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {recruiters.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black"
                      style={{ background: YELLOW, borderRadius: 2 }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Scoped CSS: active tab gets thick yellow bottom border (Radix data-state) */}
      <style jsx global>{`
        [data-yellow-border][data-state="active"] {
          border-bottom-color: ${YELLOW} !important;
        }
      `}</style>
    </div>
  );
}

function HeroStat({ emoji, label, value, suffix = '' }) {
  return (
    <div
      className="p-4"
      style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}
    >
      <div
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{ color: YELLOW }}
      >
        <span aria-hidden>{emoji}</span>
        <span>{label}</span>
      </div>
      <div className="mt-2 font-headline text-2xl sm:text-3xl uppercase tracking-tight tabular-nums text-white">
        {value}{suffix}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="pl-4" style={{ borderLeft: `2px solid ${YELLOW}` }}>
      <div className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: '#A8870A' }}>
        {label}
      </div>
      <div className="mt-1 font-headline text-xl uppercase tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ emoji, children }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em]" style={{ color: '#A8870A' }}>
      {emoji && <span aria-hidden>{emoji}</span>}
      <span>{children}</span>
      <span className="ml-2 inline-block h-[2px] w-10" style={{ background: YELLOW }} />
    </div>
  );
}

function CoursesList({ courses }) {
  if (!courses || courses.length === 0) {
    return <p className="mt-4 text-sm text-black/60">No courses listed.</p>;
  }
  return (
    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {courses.map((c, i) => (
        <li
          key={i}
          className="flex items-start justify-between gap-3 p-4 text-white"
          style={{ background: '#0A0A0A', borderRadius: 4 }}
        >
          <div className="min-w-0 flex items-start gap-3">
            <span
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
              style={{ background: YELLOW, color: '#000', borderRadius: 4 }}
            >
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0">
              <div className="font-headline text-base uppercase leading-tight tracking-tight">
                {safe(c.name)}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                {safe(c.duration)}
              </div>
            </div>
          </div>
          <span
            className="shrink-0 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black"
            style={{ background: YELLOW, borderRadius: 2 }}
          >
            {safe(c.degreeType, 'UG')}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PackageBlock({ emoji, label, value }) {
  return (
    <div
      className="relative overflow-hidden p-6 text-white"
      style={{ background: '#0A0A0A', borderRadius: 4 }}
    >
      <span
        className="absolute left-0 top-0 h-full"
        style={{ width: 6, background: YELLOW }}
        aria-hidden
      />
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: YELLOW }}>
        <span aria-hidden>{emoji}</span><span>{label}</span>
      </div>
      <div className="mt-3 font-headline text-4xl sm:text-5xl uppercase tracking-tight tabular-nums">
        {value}
      </div>
    </div>
  );
}
