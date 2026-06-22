'use client';

import { X } from 'lucide-react';
import { formatINR } from '@/lib/format';
import { Button } from '@/components/ui/Button';

// Renders the current filter set as dismissable chips. Receives normalized props from page.
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
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Active</span>
      {chips.map((c) => (
        <Button
          key={c.key}
          onClick={c.onClear}
          variant="secondary"
          size="sm"
          className="group inline-flex items-center gap-1 rounded-full pl-2.5 pr-1.5 py-1 text-xs font-medium"
        >
          {c.label}
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <X className="h-2.5 w-2.5" />
          </span>
        </Button>
      ))}
      <Button variant="ghost" size="sm" onClick={() => onClear('all')} className="text-xs underline-offset-2 hover:underline">
        Clear all
      </Button>
    </div>
  );
}
