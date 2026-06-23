'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, GitCompareArrows } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ThemeToggle from '@/components/ThemeToggle';

const YELLOW = '#F5C800';

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === 'dark' : true; // default dark to match initial render

  useEffect(() => {
    const sync = () => {
      try {
        const ids = JSON.parse(localStorage.getItem('compareIds') || '[]');
        setCount(Array.isArray(ids) ? ids.length : 0);
      } catch { setCount(0); }
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('compare:update', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('compare:update', sync);
    };
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b"
      style={{
        background: isDark ? '#0A0A0A' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            className="inline-flex h-9 w-9 items-center justify-center text-black transition-transform group-hover:scale-105"
            style={{ background: YELLOW, borderRadius: 4 }}
          >
            <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="flex flex-col leading-none">
            <span
              className="font-display text-base font-bold tracking-tight"
              style={{ color: isDark ? '#fff' : '#000' }}
            >
              CollegeFinder
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' }}
            >
              India · 2026
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition-colors border"
            style={{
              borderRadius: 4,
              borderColor: pathname === '/' ? YELLOW : 'transparent',
              color: pathname === '/' ? YELLOW : (isDark ? '#fff' : '#000'),
              background: pathname === '/' ? (isDark ? '#0A0A0A' : 'transparent') : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/') {
                e.currentTarget.style.borderColor = YELLOW;
                e.currentTarget.style.color = YELLOW;
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/') {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = isDark ? '#fff' : '#000';
              }
            }}
          >
            Browse
          </Link>

          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black"
            style={{ background: YELLOW, borderRadius: 4 }}
          >
            <GitCompareArrows className="h-3.5 w-3.5" strokeWidth={3} />
            Compare
            {count > 0 && (
              <span
                className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center px-1.5 text-[10px] font-extrabold text-white"
                style={{ background: '#000', borderRadius: 2 }}
              >
                {count}
              </span>
            )}
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
