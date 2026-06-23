'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const YELLOW = '#F5C800';
const INK = '#0A0A0A';

const toLakh = (v) => (typeof v === 'number' ? +(v / 100000).toFixed(2) : 0);

export default function CompareChart({ colleges = [] }) {
  if (colleges.length === 0) return null;

  const data = colleges.map((c) => ({
    name: c.name.length > 22 ? c.name.slice(0, 22) + '…' : c.name,
    'Total Fees (L)': toLakh(c.totalFees),
    'Avg Package (L)': toLakh(c?.placements?.averagePackage),
    'Highest Package (L)': toLakh(c?.placements?.highestPackage),
  }));

  return (
    <div
      className="relative overflow-hidden text-white"
      style={{ background: INK, borderRadius: 4 }}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        <span
          className="inline-flex items-center px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-black"
          style={{ background: YELLOW, borderRadius: 2 }}
        >
          Visual
        </span>
        <span className="font-headline text-xl uppercase tracking-tight">Side-by-side</span>
        <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-white/40">₹ Lakhs
        </span>
      </div>
      <div className="h-[360px] px-2 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)' }} interval={0} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)' }} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#000', border: `1px solid ${YELLOW}`, borderRadius: 4, fontSize: 12, color: '#fff' }}
              cursor={{ fill: 'rgba(245,200,0,0.08)' }}
              labelStyle={{ color: YELLOW, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              formatter={(v) => `₹${v} L`}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em' }} />
            <Bar dataKey="Total Fees (L)"    fill={YELLOW}            radius={[2,2,0,0]} />
            <Bar dataKey="Avg Package (L)"   fill="#FFFFFF"           radius={[2,2,0,0]} />
            <Bar dataKey="Highest Package (L)" fill="rgba(245,200,0,0.45)" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
