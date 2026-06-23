'use client';

import { useEffect, useState } from 'react';

const YELLOW = '#F5C800';

export default function ScrollIndicator({ sections = [] }) {
  const [active, setActive] = useState(sections[0]?.id || null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || sections.length === 0) return;

    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);

      let best = sections[0].id;
      let bestDist = Infinity;
      const center = window.innerHeight * 0.4;
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top - center);
        if (dist < bestDist && r.bottom > 0) { bestDist = dist; best = s.id; }
      });
      setActive(best);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 md:flex"
    >
      <div
        className="pointer-events-auto flex flex-col items-center gap-3 px-2 py-3"
        style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999 }}
      >
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              title={s.label}
              className="group relative flex h-7 items-center"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(s.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span
                className="block transition-all duration-300"
                style={{
                  width: isActive ? 24 : 8,
                  height: isActive ? 10 : 8,
                  background: isActive ? YELLOW : 'rgba(255,255,255,0.3)',
                  borderRadius: 999,
                }}
              />
              <span
                className="absolute right-full mr-2 hidden whitespace-nowrap px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black opacity-0 transition-opacity group-hover:block group-hover:opacity-100"
                style={{ background: YELLOW, borderRadius: 2 }}
              >
                {s.label}
              </span>
            </a>
          );
        })}
        <div className="mt-1 h-1 w-1 rounded-full" style={{ background: YELLOW, opacity: 0.4 + progress * 0.6 }} />
      </div>
    </nav>
  );
}
