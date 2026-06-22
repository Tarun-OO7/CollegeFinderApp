'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { formatINR, formatRating } from '@/lib/format';

const ROWS = [
  { label: 'Location',         get: (c) => `${c.location || 'N/A'}, ${c.state || ''}` },
  { label: 'Type',             get: (c) => c.type || 'N/A', badge: true },
  { label: 'Rating',           get: (c) => formatRating(c.rating) },
  { label: 'Total Fees',       get: (c) => formatINR(c.totalFees) },
  { label: 'Avg. Package',     get: (c) => formatINR(c?.placements?.averagePackage) },
  { label: 'Highest Package',  get: (c) => formatINR(c?.placements?.highestPackage) },
  {
    label: 'Top Recruiters',
    get: (c) => {
      const arr = c?.placements?.topRecruiters;
      if (!arr || arr.length === 0) return 'N/A';
      return arr.slice(0, 4).join(', ');
    },
  },
];

export default function CompareTable({ colleges = [], onRemove }) {
  if (colleges.length === 0) return null;

  return (
    <Card className="overflow-x-auto rounded-2xl border-border/60 shadow-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40">
            <th className="sticky left-0 bg-muted/60 backdrop-blur p-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-40">Attribute</th>
            {colleges.map((c) => (
              <th key={c.id} className="p-4 text-left font-medium min-w-[220px]">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-sm font-semibold leading-snug line-clamp-2">{c.name}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => onRemove?.(c.id)} aria-label="Remove">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
              <td className="sticky left-0 bg-background/95 backdrop-blur p-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{row.label}</td>
              {colleges.map((c) => (
                <td key={c.id + row.label} className="p-4 text-sm font-medium">
                  {row.badge ? <Badge variant="secondary" className="rounded-full">{row.get(c)}</Badge> : row.get(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
