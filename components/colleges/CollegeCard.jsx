'use client';

import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { formatINR, formatRating } from '@/lib/format';

const YELLOW = '#F5C800';

export default function CollegeCard({ college }) {
  if (!college) return null;
  const { id, rank, name, location, state, type, rating, totalFees, placements } = college;
  const avg = placements?.averagePackage;
  const recruiters = placements?.topRecruiters || [];

  return (
    <Link href={`/colleges/${id}`} className="group block focus:outline-none">
      <article
        className="relative h-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}
      >
        {/* Yellow top accent bar with white sweep on hover */}
        <div className="card-sweep h-1.5 w-full" />

        <div className="p-5 flex h-full flex-col gap-4 text-white">
          {/* Header: rank chip + type pill */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {typeof rank === 'number' && (
                <div className="mb-2 inline-flex items-stretch overflow-hidden text-[10px] font-extrabold uppercase tracking-wider" style={{ borderRadius: 2 }}>
                  <span className="inline-flex items-center px-1.5 py-0.5 text-black" style={{ background: YELLOW }}>
                    #{rank}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 text-white/80" style={{ background: '#000', letterSpacing: '0.18em' }}>
                    NIRF 2024
                  </span>
                </div>
              )}
              <h3 className="font-headline text-lg uppercase leading-tight tracking-tight text-white line-clamp-2">
                {name}
              </h3>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/60">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}, {state}</span>
              </div>
            </div>
            <span
              className="shrink-0 inline-flex items-center px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white"
              style={{ background: '#000', borderRadius: 2 }}
            >
              {type}
            </span>
          </div>

          {/* Stat row — yellow labels, white values, yellow left-border accents */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Rating" value={formatRating(rating)} />
            <Stat label="Fees" value={formatINR(totalFees)} />
            <Stat label="Avg Pkg" value={formatINR(avg)} />
          </div>

          {/* Recruiters — dark gray subtle */}
          <div className="flex flex-wrap gap-1.5 min-h-[26px]">
            {recruiters.length === 0 ? (
              <span className="text-[11px] uppercase tracking-wider text-white/40 italic">Recruiter data unavailable</span>
            ) : (
              <>
                {recruiters.slice(0, 3).map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white"
                    style={{ background: '#2A2A2A', borderRadius: 2 }}
                  >
                    {r}
                  </span>
                ))}
                {recruiters.length > 3 && (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                    +{recruiters.length - 3} more
                  </span>
                )}
              </>
            )}
          </div>

          {/* CTA row: gray text + yellow arrow button */}
          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">View profile</span>
            <span
              className="inline-flex h-8 w-8 items-center justify-center text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ background: YELLOW, borderRadius: 4 }}
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function Stat({ label, value }) {
  return (
    <div className="pl-2.5" style={{ borderLeft: `2px solid ${YELLOW}` }}>
      <div className="text-[9px] font-extrabold uppercase tracking-[0.22em]" style={{ color: YELLOW }}>
        {label}
      </div>
      <div className="mt-0.5 text-xs font-bold text-white truncate">{value}</div>
    </div>
  );
}
