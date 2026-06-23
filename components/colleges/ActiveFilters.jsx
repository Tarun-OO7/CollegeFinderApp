'use client';

import { X } from 'lucide-react';
import { formatINR } from '@/lib/format';

const YELLOW = '#F5C800';

export default function ActiveFilters({ query, filters, sort, onClear, feeCeiling }) {
  const chips = [];
  if (query) chips.push({ key: 'q', label: `"${query}"`, onClear: () => onClear('q') });
  if (filters.state !== 'all') chips.push({ key: 'state', label: filters.state, onClear: () => onClear('state') });
  if (filters.type !== 'all') chips.push({ key: 'type', label: filters.type, onClear: () => onClear('type') });
  if (filters.maxFees !== feeCeiling) chips.push({ key: 'maxFees', label: `≤ ${formatINR(filters.maxFees)}`, onClear: () => onClear('maxFees') });
  if (filters.minRating > 0) chips.push({ key: 'minRating', label: `≥ ${filters.minRating.toFixed(1)} ★`, onClear: () => onClear('minRating') });
  if (sort && sort !== 'rating-desc') {
    const map = { 'fees-asc': 'Fees ↑', 'fees-desc': 'Fees ↓', 'name-asc': 'A → Z' };
    chips.push({ key: 'sort', label: `Sort: ${map[sort] || sort}`, onClear: () => onClear('sort') });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: YELLOW }}>Active</span>
      {chips.map((c) => (
        <button
          key={c.key}
          onClick={c.onClear}
          className="group inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white hover:bg-[#F5C800] hover:text-black transition-colors"
          style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2 }}
        >
          {c.label}
          <span
            className="inline-flex h-4 w-4 items-center justify-center text-white/80 group-hover:text-black"
            style={{ borderRadius: 2 }}
          >
            <X className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
        </button>
      ))}
      <button onClick={() => onClear('all')} className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/50 hover:text-[#F5C800] transition-colors">
        Clear all
      </button>
    </div>
  );
}
