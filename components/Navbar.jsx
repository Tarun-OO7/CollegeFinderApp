'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, GitCompareArrows } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 w-full glass"
      style={{ borderBottom: scrolled ? '0.5px solid #E2DDD4' : '0.5px solid transparent', transition: 'border-color 0.2s' }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-glow transition-transform group-hover:scale-105"
            style={{ background: '#C6A84B' }}
          >
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight" style={{ color: '#1A1714' }}>CollegeFinder</span>
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: '#8A8377' }}>India · 2026</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button variant={pathname === '/' ? 'secondary' : 'ghost'} size="sm" className="font-medium">Browse</Button>
          </Link>
          <Link href="/compare">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 font-medium"
              style={{ border: '0.5px solid #E2DDD4', color: '#1A1714' }}
            >
              <GitCompareArrows className="h-4 w-4" />
              Compare
              {count > 0 && (
                <span
                  className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold animate-pulse-glow"
                  style={{ background: '#C6A84B', color: '#0E1117' }}
                >
                  {count}
                </span>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
