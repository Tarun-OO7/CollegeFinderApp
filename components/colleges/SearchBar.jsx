'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

const YELLOW = '#F5C800';

export default function SearchBar({ value, onChange, placeholder = 'Search by name, city or state...' }) {
  const hasValue = Boolean(value);
  return (
    <div className="relative w-full group">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-[#F5C800]" />
      <Input
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-12 pl-10 pr-10 border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40 focus-visible:border-[#F5C800] focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{ borderRadius: 4 }}
        aria-label="Search colleges"
      />
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          style={{ borderRadius: 4 }}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
