'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatINR } from '@/lib/format';

export default function CollegeCard({ college }) {
  if (!college) return null;
  const { id, name, location, state, type, rating, totalFees, placements } = college;
  const avg = placements?.averagePackage;
  const recruiters = placements?.topRecruiters || [];

  return (
    <Link href={`/colleges/${id}`} className="group block focus:outline-none h-full">
      <Card
        className="relative h-full flex flex-col overflow-hidden bg-white transition-all duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-ring/40"
        style={{
          borderRadius: '0 10px 10px 0',
          borderTop: '0.5px solid #E2DDD4',
          borderRight: '0.5px solid #E2DDD4',
          borderBottom: '0.5px solid #E2DDD4',
          borderLeft: '2px solid #C6A84B',
          boxShadow: 'none',
        }}
      >
        <div className="p-5 flex flex-col flex-1 gap-4">
          {/* Header: Name and Rating Badge */}
          <div className="flex items-start justify-between gap-3">
            <h3
              className="font-display leading-snug tracking-tight line-clamp-2"
              style={{ fontSize: '18px', fontWeight: 600, color: '#1A1714' }}
            >
              {name}
            </h3>

            {/* Rating badge — top right plain text */}
            <div
              className="shrink-0 inline-flex items-center"
              style={{ color: '#C6A84B', fontSize: '13px', fontWeight: 500 }}
            >
              ★ {rating ? rating.toFixed(1) : 'N/A'}
            </div>
          </div>

          {/* Location and Fees */}
          <div className="flex flex-col gap-1.5" style={{ fontSize: '13px', color: '#8A8377' }}>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{location}, {state}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate" style={{ fontWeight: 500, color: '#1A1714' }}>
                Fees: {totalFees ? formatINR(totalFees) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Additional Info: Type and Avg Package */}
          <div
            className="flex flex-row"
            style={{ gap: '24px', padding: 0, margin: '12px 0' }}
          >
            <div className="flex flex-col">
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A8377' }}>Type</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#1A1714', marginTop: '2px' }}>{type}</span>
            </div>
            <div className="flex flex-col" style={{ borderLeft: '0.5px solid #E2DDD4', paddingLeft: '24px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A8377' }}>Avg Pkg</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#C6A84B', marginTop: '2px' }}>{avg ? formatINR(avg) : 'N/A'}</span>
            </div>
          </div>

          {/* Recruiters preview */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {recruiters.length === 0 ? (
              <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#B0AA9F' }}>Recruiter data unavailable</span>
            ) : (
              <>
                {recruiters.slice(0, 3).map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center font-normal"
                    style={{ background: '#EDEAE3', color: '#6B6660', borderRadius: '3px', fontSize: '11px', padding: '3px 8px' }}
                  >
                    {r}
                  </span>
                ))}
                {recruiters.length > 3 && (
                  <span
                    className="inline-flex items-center font-normal"
                    style={{ background: '#EDEAE3', color: '#6B6660', borderRadius: '3px', fontSize: '11px', padding: '3px 8px' }}
                  >
                    +{recruiters.length - 3}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* CTA — plain text link with arrow */}
        <div className="px-5 pb-4 mt-auto flex items-center justify-between">
          <span
            className="text-sm font-medium transition-colors group-hover:opacity-80"
            style={{ color: '#C6A84B' }}
          >
            View Profile
          </span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: '#C6A84B' }}
          />
        </div>
      </Card>
    </Link>
  );
}
