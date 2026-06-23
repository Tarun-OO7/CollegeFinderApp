'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Generates a window of page numbers with leading/trailing ellipses.
// Output examples (siblings=1):
//   total=5,  current=3 → [1,2,3,4,5]
//   total=10, current=1 → [1,2,3,'…',10]
//   total=10, current=5 → [1,'…',4,5,6,'…',10]
//   total=10, current=10→ [1,'…',8,9,10]
function buildPages(currentPage, totalPages, siblings = 1) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const left = Math.max(currentPage - siblings, 2);
  const right = Math.min(currentPage + siblings, totalPages - 1);
  const pages = [1];

  if (left > 2) pages.push('left-ellipsis');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('right-ellipsis');

  pages.push(totalPages);
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Defensive: ensure valid integers and a usable range.
  const total = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(Math.max(1, Number(currentPage) || 1), total);
  if (total <= 1) return null;

  const pages = buildPages(current, total);
  const go = (p) => {
    if (p < 1 || p > total || p === current) return;
    onPageChange?.(p);
  };

  return (
    <nav className="mt-8 flex items-center justify-between gap-3" aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={() => go(current - 1)}
        disabled={current === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Mobile: compact current/total indicator */}
      <div className="sm:hidden text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{current}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span>
      </div>

      {/* Desktop: numbered page buttons with ellipsis */}
      <ul className="hidden sm:flex items-center gap-1">
        {pages.map((p, idx) => {
          if (typeof p === 'string') {
            return (
              <li key={`${p}-${idx}`} aria-hidden="true">
                <span className="inline-flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">…</span>
              </li>
            );
          }
          const active = p === current;
          return (
            <li key={p}>
              <Button
                variant={active ? 'default' : 'outline'}
                size="sm"
                onClick={() => go(p)}
                aria-current={active ? 'page' : undefined}
                aria-label={`Go to page ${p}`}
                className="h-9 w-9 p-0"
              >
                {p}
              </Button>
            </li>
          );
        })}
      </ul>

      <Button
        variant="outline"
        size="sm"
        onClick={() => go(current + 1)}
        disabled={current === total}
        className="gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
