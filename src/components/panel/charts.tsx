'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

// Panel grafikleri (starter'daki overview grafiklerinin oyunhadi verisine uyarlanmış hâli).

const weekCfg = {
  oyun: { label: 'Oyun', color: 'var(--chart-1)' },
  oyuncu: { label: 'Oyuncu', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function WeekChart({ data }: { data: { day: string; oyun: number; oyuncu: number }[] }) {
  return (
    <ChartContainer config={weekCfg} className="aspect-auto h-[260px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillOyun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-oyun)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-oyun)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillOyuncu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-oyuncu)" stopOpacity={0.6} />
            <stop offset="95%" stopColor="var(--color-oyuncu)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area dataKey="oyuncu" type="natural" fill="url(#fillOyuncu)" stroke="var(--color-oyuncu)" />
        <Area dataKey="oyun" type="natural" fill="url(#fillOyun)" stroke="var(--color-oyun)" />
      </AreaChart>
    </ChartContainer>
  );
}

export function GameBarChart({ data }: { data: { name: string; oyun: number; color: string }[] }) {
  const cfg = { oyun: { label: 'Oyun', color: 'var(--chart-1)' } } satisfies ChartConfig;
  return (
    <ChartContainer config={cfg} className="aspect-auto h-[300px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={96} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="oyun" radius={6}>
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function SimpleBarChart({ data, x, y, label }: { data: Record<string, string | number>[]; x: string; y: string; label: string }) {
  const cfg = { [y]: { label, color: 'var(--chart-1)' } } satisfies ChartConfig;
  return (
    <ChartContainer config={cfg} className="aspect-auto h-[240px] w-full">
      <BarChart data={data} margin={{ top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={x} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey={y} fill={`var(--color-${y})`} radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
