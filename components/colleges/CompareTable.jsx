'use client';

import { X } from 'lucide-react';
import { formatINR, formatRating } from '@/lib/format';

const YELLOW = '#F5C800';
const INK = '#0A0A0A';

const ROWS = [
  { label: 'Location',         get: (c) => `${c.location || 'N/A'}, ${c.state || ''}` },
  { label: 'Type',             get: (c) => c.type || 'N/A', pill: true },
  { label: 'Rating',           get: (c) => formatRating(c.rating) },
  { label: 'Total Fees',       get: (c) => formatINR(c.totalFees) },
  { label: 'Avg. Package',     get: (c) => formatINR(c?.placements?.averagePackage) },
  { label: 'Highest Package',  get: (c) => formatINR(c?.placements?.highestPackage) },
  {
    label: 'Top Recruiters',
    recruiters: true,
    get: (c) => (c?.placements?.topRecruiters || []),
  },
];

export default function CompareTable({ colleges = [], onRemove }) {
  if (colleges.length === 0) return null;

  return (
    <div className="overflow-x-auto border border-black/15" style={{ borderRadius: 4 }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: INK }}>
            <th
              className="sticky left-0 p-4 text-left text-[10px] font-extrabold uppercase tracking-[0.22em] w-44"
              style={{ background: INK, color: YELLOW }}
            >
              Attribute
            </th>
            {colleges.map((c) => (
              <th key={c.id} className="p-4 text-left min-w-[220px]" style={{ background: INK }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {typeof c.rank === 'number' && (
                      <span
                        className="mb-2 inline-flex items-center px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black"
                        style={{ background: YELLOW, borderRadius: 2 }}
                      >
                        NIRF #{c.rank}
                      </span>
                    )}
                    <div className="font-headline text-base uppercase leading-tight tracking-tight text-white line-clamp-2">
                      {c.name}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove?.(c.id)}
                    aria-label="Remove"
                    className="shrink-0 inline-flex h-7 w-7 items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    style={{ borderRadius: 4 }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {ROWS.map((row, idx) => (
            <tr key={row.label} className="border-b border-black/10 last:border-0 hover:bg-black/[0.02] transition-colors">
              <td
                className="sticky left-0 p-4 align-top text-[10px] font-extrabold uppercase tracking-[0.22em] bg-white"
                style={{ color: '#A8870A', borderLeft: `2px solid ${YELLOW}` }}
              >
                {row.label}
              </td>
              {colleges.map((c) => {
                const val = row.get(c);
                return (
                  <td key={c.id + row.label} className="p-4 align-top text-sm font-medium text-black">
                    {row.recruiters ? (
                      Array.isArray(val) && val.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {val.slice(0, 6).map((r) => (
                            <span
                              key={r}
                              className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black"
                              style={{ background: YELLOW, borderRadius: 2 }}
                            >
                              {r}
                            </span>
                          ))}
                          {val.length > 6 && (
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-black/60">
                              +{val.length - 6}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-black/40">N/A</span>
                      )
                    ) : row.pill ? (
                      <span
                        className="inline-flex items-center px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white"
                        style={{ background: INK, borderRadius: 2 }}
                      >
                        {val}
                      </span>
                    ) : (
                      <span className="font-headline text-lg uppercase tracking-tight">{val}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
