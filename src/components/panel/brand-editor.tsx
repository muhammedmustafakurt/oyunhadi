'use client';

import { useState } from 'react';
import { IconUpload } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PRESETS = [
  ['#ff4f2e', '#ffc83d'], ['#7c3aed', '#22d3ee'], ['#0f766e', '#fde047'], ['#1d4ed8', '#f472b6'], ['#b91c1c', '#fbbf24'], ['#166534', '#f97316'],
];

// Logo ve renk seçimi; sağda oyuncu ekranının canlı önizlemesi. TASARIM AŞAMASI: kaydedilmez.
export default function BrandEditor({ venue }: { venue: { name: string; initials: string; color: string; accent: string; welcome: string } }) {
  const [color, setColor] = useState(venue.color);
  const [accent, setAccent] = useState(venue.accent);
  const [name, setName] = useState(venue.name);
  const [welcome, setWelcome] = useState(venue.welcome);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toLocaleUpperCase('tr')).join('') || venue.initials;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Görünüm</CardTitle>
          <CardDescription>Değişiklikler kaydedince bütün masalarda anında görünür.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl border-2 border-zinc-900 bg-white text-xl font-extrabold" style={{ color }}>{initials}</span>
              <Button variant="outline" type="button" onClick={() => toast('Logo yükleme yakında', { description: 'Kare, en az 256×256 px PNG ya da SVG.' })}><IconUpload /> Logo yükle</Button>
              <span className="text-muted-foreground text-xs">Kare PNG/SVG, en az 256 px</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vn">Mekân adı</Label>
            <Input id="vn" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wl">Karşılama cümlesi</Label>
            <Textarea id="wl" value={welcome} onChange={(e) => setWelcome(e.target.value)} maxLength={80} rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="c1">Ana renk</Label>
              <div className="flex gap-2"><input id="c1" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded-md border" /><Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono" /></div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c2">İkinci renk</Label>
              <div className="flex gap-2"><input id="c2" type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-9 w-12 cursor-pointer rounded-md border" /><Input value={accent} onChange={(e) => setAccent(e.target.value)} className="font-mono" /></div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Hazır renkler</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(([a, b]) => (
                <button key={a} type="button" onClick={() => { setColor(a); setAccent(b); }} className="flex overflow-hidden rounded-full border-2 border-transparent hover:border-zinc-900" aria-label={`${a} ve ${b}`}>
                  <span className="size-7" style={{ background: a }} /><span className="size-7" style={{ background: b }} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => toast('Görünüm kaydedildi (önizleme)', { description: 'Kaydetme, veritabanı bağlanınca çalışacak.' })}>Kaydet</Button>
            <Button variant="ghost" onClick={() => { setColor(venue.color); setAccent(venue.accent); setName(venue.name); setWelcome(venue.welcome); }}>Geri al</Button>
          </div>
        </CardContent>
      </Card>

      {/* Canlı önizleme: oyuncu ekranının üst kısmı */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <p className="text-muted-foreground mb-2 text-sm font-medium">Önizleme</p>
        <div className="mx-auto w-[280px] rounded-[2.4rem] bg-zinc-900 p-2.5 shadow-xl">
          <div className="overflow-hidden rounded-[2rem] bg-[#fff7ee] pb-4">
            <div className="relative overflow-hidden rounded-b-3xl border-b-2 border-zinc-900 px-4 pt-8 pb-5 text-white" style={{ background: color }}>
              <svg className="absolute -right-2 top-5 h-14 w-14 rotate-12" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill={accent} /><circle cx="13" cy="13" r="4" fill={color} /><circle cx="27" cy="27" r="4" fill={color} /></svg>
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl border-2 border-zinc-900 bg-white text-xs font-extrabold" style={{ color }}>{initials}</span>
                <span className="text-sm leading-tight font-bold">{name}</span>
              </div>
              <span className="mt-5 inline-block -rotate-3 rounded-full border-2 border-zinc-900 px-3 py-0.5 text-xs font-extrabold text-zinc-900" style={{ background: accent }}>Masa 5</span>
              <p className="mt-2 text-2xl leading-[0.95] font-extrabold tracking-tight">Hadi, bir oyun seçin!</p>
              <p className="mt-2 text-xs opacity-90">{welcome}</p>
            </div>
            <div className="space-y-2 px-3 pt-3">
              {[['Tabu', '#e0457f'], ['Bil Bakalım', '#1f9d6b'], ['Casus', '#7a4b2a']].map(([n, c]) => (
                <div key={n} className="rounded-xl border-2 border-zinc-900 px-3 py-3 text-sm font-extrabold text-white" style={{ background: c }}>{n}</div>
              ))}
              <div className="rounded-xl border-2 border-zinc-900 px-3 py-2.5 text-center text-sm font-bold text-white" style={{ background: color }}>Masaya katıl</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
