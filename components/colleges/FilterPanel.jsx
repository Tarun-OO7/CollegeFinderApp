'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';
import { formatINR } from '@/lib/format';

const YELLOW = '#F5C800';

export default function FilterPanel({ filters, onChange, states = [], onReset, maxFeeCeiling = 2000000 }) {
  const f = filters || { state: 'all', type: 'all', maxFees: maxFeeCeiling, minRating: 0 };
  const update = (patch) => onChange?.({ ...f, ...patch });

  const activeCount =
    (f.state !== 'all' ? 1 : 0) +
    (f.type !== 'all' ? 1 : 0) +
    (f.maxFees !== maxFeeCeiling ? 1 : 0) +
    (f.minRating > 0 ? 1 : 0);

  return (
    <div
      className="sticky top-20"
      style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-6 w-6 items-center justify-center text-black"
            style={{ background: YELLOW, borderRadius: 2 }}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="font-headline text-sm uppercase tracking-[0.18em] text-white">Filters</span>
          {activeCount > 0 && (
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center px-1.5 text-[10px] font-extrabold text-black"
              style={{ background: YELLOW, borderRadius: 2 }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <button
          onClick={onReset}
          disabled={activeCount === 0}
          className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70 hover:text-[#F5C800] disabled:text-white/20 disabled:hover:text-white/20 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <Field label="State">
          <Select value={f.state} onValueChange={(v) => update({ state: v })}>
            <SelectTrigger className="h-10 bg-[#0A0A0A] border-white/15 text-white" style={{ borderRadius: 4 }}>
              <SelectValue placeholder="All states" />
            </SelectTrigger>
            <SelectContent className="max-h-72 bg-[#0A0A0A] border-white/15 text-white">
              <SelectItem value="all">All States</SelectItem>
              {states.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Type">
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { v: 'all',     label: 'All' },
              { v: 'Govt',    label: 'Govt' },
              { v: 'Private', label: 'Private' },
              { v: 'Deemed',  label: 'Deemed' },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => update({ type: t.v })}
                className={`h-9 text-[10px] font-extrabold uppercase tracking-[0.18em] transition-all ${
                  f.type === t.v
                    ? 'text-black'
                    : 'text-white/70 hover:text-[#F5C800]'
                }`}
                style={{
                  background: f.type === t.v ? YELLOW : '#0A0A0A',
                  border: f.type === t.v ? `1px solid ${YELLOW}` : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 4,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Max Fees" trailing={<span className="font-bold text-white">{formatINR(f.maxFees)}</span>}>
          <Slider value={[f.maxFees]} min={0} max={maxFeeCeiling} step={50000} onValueChange={(v) => update({ maxFees: v[0] })} />
        </Field>

        <Field label="Min Rating" trailing={<span className="font-bold text-white">{f.minRating.toFixed(1)} ★</span>}>
          <Slider value={[f.minRating]} min={0} max={5} step={0.1} onValueChange={(v) => update({ minRating: v[0] })} />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, trailing, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: YELLOW }}>{label}</Label>
        {trailing && <span className="text-[11px] text-white/70">{trailing}</span>}
      </div>
      {children}
    </div>
  );
}
