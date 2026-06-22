'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, GitCompareArrows } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-glow transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">CollegeFinder</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">India · 2026</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button variant={pathname === '/' ? 'secondary' : 'ghost'} size="sm" className="font-medium">Browse</Button>
          </Link>
          <Link href="/compare">
            <Button variant={pathname === '/compare' ? 'secondary' : 'ghost'} size="sm" className="gap-1.5 font-medium">
              <GitCompareArrows className="h-4 w-4" />
              Compare
              {count > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground animate-pulse-glow">
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
