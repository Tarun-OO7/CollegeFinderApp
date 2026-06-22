'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search by name, city or state...' }) {
  const hasValue = Boolean(value);
  return (
    <div className="relative w-full group">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
      <Input
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-12 pl-10 pr-10 rounded-xl border-border/70 bg-background shadow-soft focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-shadow"
        aria-label="Search colleges"
      />
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
