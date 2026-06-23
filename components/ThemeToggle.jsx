'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const YELLOW = '#F5C800';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Prevent SSR/CSR mismatch flash by rendering a placeholder until mounted.
  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center border"
        style={{ borderRadius: 4, borderColor: 'rgba(127,127,127,0.25)' }}
      />
    );
  }

  const isDark = (resolvedTheme || theme) === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`group relative inline-flex h-9 w-9 items-center justify-center border transition-colors ${
        isDark
          ? 'border-white/15 text-white hover:border-[#F5C800] hover:text-[#F5C800]'
          : 'border-black/15 text-black hover:border-[#F5C800] hover:bg-[#F5C800]'
      }`}
      style={{ borderRadius: 4 }}
    >
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
        strokeWidth={2.5}
        style={isDark ? { color: YELLOW } : undefined}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        strokeWidth={2.5}
      />
    </button>
  );
}
