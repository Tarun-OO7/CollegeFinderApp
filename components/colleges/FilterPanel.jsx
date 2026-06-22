'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SlidersHorizontal } from 'lucide-react';
import { formatINR } from '@/lib/format';

export default function FilterPanel({ filters, onChange, states = [], onReset, maxFeeCeiling = 2000000 }) {
  const f = filters || { state: 'all', type: 'all', maxFees: maxFeeCeiling, minRating: 0 };
  const update = (patch) => onChange?.({ ...f, ...patch });

  const activeCount =
    (f.state !== 'all' ? 1 : 0) +
    (f.type !== 'all' ? 1 : 0) +
    (f.maxFees !== maxFeeCeiling ? 1 : 0) +
    (f.minRating > 0 ? 1 : 0);

  return (
    <Card className="sticky top-20 rounded-2xl border-border/60 shadow-soft">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-sm font-semibold">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={activeCount === 0} className="h-7 text-xs">
          Reset
        </Button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <Field label="State">
          <Select value={f.state} onValueChange={(v) => update({ state: v })}>
            <SelectTrigger className="h-10"><SelectValue placeholder="All states" /></SelectTrigger>
            <SelectContent className="max-h-72">
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
                className={`h-9 rounded-lg border text-xs font-medium transition-all ${
                  f.type === t.v
                    ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Max Fees" trailing={<span className="font-medium text-foreground">{formatINR(f.maxFees)}</span>}>
          <Slider value={[f.maxFees]} min={0} max={maxFeeCeiling} step={50000} onValueChange={(v) => update({ maxFees: v[0] })} />
        </Field>

        <Field label="Min Rating" trailing={<span className="font-medium text-foreground">{f.minRating.toFixed(1)} ★</span>}>
          <Slider value={[f.minRating]} min={0} max={5} step={0.1} onValueChange={(v) => update({ minRating: v[0] })} />
        </Field>
      </div>
    </Card>
  );
}

function Field({ label, trailing, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
        {trailing && <span className="text-xs text-muted-foreground">{trailing}</span>}
      </div>
      {children}
    </div>
  );
}
