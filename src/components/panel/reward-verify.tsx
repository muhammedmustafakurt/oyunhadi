'use client';

import { useState } from 'react';
import { IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { REWARD_CODES, type RewardCode } from '@/lib/demo';
import { gameName } from '@/lib/game-meta';

// Garsonun kod doğrulama ekranı. TASARIM AŞAMASI: örnek kodlarla çalışır (ör. HK-7Q4M).
export default function RewardVerify() {
  const [code, setCode] = useState('');
  const [res, setRes] = useState<{ kind: 'ok' | 'used' | 'expired' | 'none'; r?: RewardCode } | null>(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase().replace(/\s/g, '');
    const r = REWARD_CODES.find((x) => x.code.replace('-', '') === c.replace('-', ''));
    if (!r) setRes({ kind: 'none' });
    else setRes({ kind: r.status === 'bekliyor' ? 'ok' : r.status === 'kullanildi' ? 'used' : 'expired', r });
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={check} className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => { setCode(e.target.value); setRes(null); }}
          placeholder="HK-7Q4M"
          aria-label="Ödül kodu"
          autoCapitalize="characters"
          autoComplete="off"
          className="h-12 text-center font-mono text-lg tracking-widest uppercase"
        />
        <Button type="submit" size="lg" className="h-12 px-5">Doğrula</Button>
      </form>
      <p className="text-muted-foreground mt-2 text-center text-xs">Misafirin ekranındaki karekodu kamerayla da okutabilirsiniz.</p>

      {res && (
        <div
          role="status"
          className={`mt-6 rounded-2xl border-2 p-6 text-center ${res.kind === 'ok' ? 'border-emerald-500 bg-emerald-500/10' : res.kind === 'none' ? 'border-destructive bg-destructive/10' : 'border-amber-500 bg-amber-500/10'}`}
        >
          {res.kind === 'ok' && <IconCircleCheck className="mx-auto size-12 text-emerald-600" />}
          {res.kind === 'none' && <IconCircleX className="text-destructive mx-auto size-12" />}
          {(res.kind === 'used' || res.kind === 'expired') && <IconClock className="mx-auto size-12 text-amber-600" />}
          <p className="mt-3 text-xl font-bold">
            {res.kind === 'ok' ? 'Kod geçerli' : res.kind === 'used' ? 'Bu kod daha önce kullanıldı' : res.kind === 'expired' ? 'Kodun süresi dolmuş' : 'Böyle bir kod yok'}
          </p>
          {res.r && (
            <p className="text-muted-foreground mt-1">{res.r.table} · {gameName(res.r.game)} · {res.r.issued}</p>
          )}
          {res.kind === 'ok' && res.r && (
            <>
              <p className="mt-4 text-2xl font-extrabold">{res.r.prize}</p>
              <Button className="mt-5 w-full" size="lg" onClick={() => setRes({ kind: 'used', r: { ...res.r!, status: 'kullanildi' } })}>İkramı verdim, kodu kapat</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
