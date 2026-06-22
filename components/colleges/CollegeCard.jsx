'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatINR, formatRating } from '@/lib/format';

// Type-driven accent: each college type gets its own gradient stripe + soft tint.
const TYPE_THEME = {
  Govt:    { stripe: 'from-indigo-500 via-violet-500 to-purple-500', tint: 'bg-indigo-50',   text: 'text-indigo-700',   ring: 'ring-indigo-100'  },
  Private: { stripe: 'from-emerald-500 via-teal-500 to-cyan-500',    tint: 'bg-emerald-50',  text: 'text-emerald-700',  ring: 'ring-emerald-100' },
  Deemed:  { stripe: 'from-amber-500 via-orange-500 to-rose-500',    tint: 'bg-amber-50',    text: 'text-amber-700',    ring: 'ring-amber-100'   },
};

export default function CollegeCard({ college }) {
  if (!college) return null;
  const { id, name, location, state, type, rating, totalFees, placements } = college;
  const theme = TYPE_THEME[type] || TYPE_THEME.Govt;
  const avg = placements?.averagePackage;
  const recruiters = placements?.topRecruiters || [];

  return (
    <Link href={`/colleges/${id}`} className="group block focus:outline-none">
      <Card className="relative h-full overflow-hidden rounded-2xl border-border/60 bg-card shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
        {/* Accent stripe */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${theme.stripe}`} />

        <div className="p-5 flex h-full flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold leading-snug tracking-tight line-clamp-2">
                {name}
              </h3>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}, {state}</span>
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 ${theme.tint} ${theme.text} ${theme.ring}`}>
              {type}
            </span>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/70 bg-muted/30 p-2.5">
            <Stat icon={<Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />} label="Rating" value={formatRating(rating)} />
            <Stat icon={<IndianRupee className="h-3.5 w-3.5 text-indigo-500" />} label="Fees" value={formatINR(totalFees)} />
            <Stat icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-500" />} label="Avg pkg" value={formatINR(avg)} />
          </div>

          {/* Recruiters preview */}
          <div className="flex flex-wrap gap-1.5 min-h-[26px]">
            {recruiters.length === 0 ? (
              <span className="text-[11px] text-muted-foreground italic">Recruiter data unavailable</span>
            ) : (
              <>
                {recruiters.slice(0, 3).map((r) => (
                  <Badge key={r} variant="secondary" className="rounded-full text-[10px] font-normal">{r}</Badge>
                ))}
                {recruiters.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    +{recruiters.length - 3}
                  </span>
                )}
              </>
            )}
          </div>

          {/* CTA */}
          <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-xs text-muted-foreground">View profile</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xs font-semibold text-foreground truncate w-full">{value}</div>
    </div>
  );
}
