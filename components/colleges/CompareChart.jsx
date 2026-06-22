'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Convert raw rupees to lakhs for compact axis labels.
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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Visual Comparison <span className="text-xs font-normal text-muted-foreground ml-2">(values in ₹ Lakhs)</span></CardTitle>
      </CardHeader>
      <CardContent className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => `₹${v} L`}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Total Fees (L)" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} />
            <Bar dataKey="Avg Package (L)" fill="hsl(var(--chart-2))" radius={[4,4,0,0]} />
            <Bar dataKey="Highest Package (L)" fill="hsl(var(--chart-3))" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
