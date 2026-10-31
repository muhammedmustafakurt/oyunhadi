'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type G = { id: string; name: string; note: string; players: string; minutes: string; color: string; fg: string; plays: number };

// Oyun aç/kapa listesi. TASARIM AŞAMASI: seçim kaydedilmez.
export default function GamesToggle({ games, initial }: { games: G[]; initial: string[] }) {
  const [on, setOn] = useState(() => new Set(initial));
  const flip = (g: G, v: boolean) => {
    setOn((s) => { const n = new Set(s); if (v) n.add(g.id); else n.delete(g.id); return n; });
    toast(v ? `${g.name} açıldı` : `${g.name} kapatıldı`, { description: 'Masalardaki oyun listesi anında güncellenir.' });
  };
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {games.map((g) => {
        const active = on.has(g.id);
        return (
          <li key={g.id} className={`bg-card flex items-center gap-4 rounded-xl border p-4 transition-opacity ${active ? '' : 'opacity-60'}`}>
            <span className="grid size-12 shrink-0 place-items-center rounded-xl text-lg font-extrabold" style={{ background: g.color, color: g.fg }}>{g.name[0]}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-semibold">{g.name} {g.plays > 40 && <Badge variant="secondary">Popüler</Badge>}</p>
              <p className="text-muted-foreground truncate text-sm">{g.players.replace('-', '–')} kişi · {g.minutes.replace('-', '–')} dk · bu hafta {g.plays}</p>
            </div>
            <Switch checked={active} onCheckedChange={(v) => flip(g, v)} aria-label={`${g.name} ${active ? 'kapat' : 'aç'}`} />
          </li>
        );
      })}
    </ul>
  );
}
