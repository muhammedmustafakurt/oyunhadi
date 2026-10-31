'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';

// Mekân adı/sehir kaydı. Karekod adresi (slug) buradan değiştirilemez: basılı karekodlar bozulur.
export default function SettingsSave({ name, city, slug }: { name: string; city: string; slug: string }) {
  const router = useRouter();
  const [n, setN] = useState(name);
  const [c, setCity] = useState(city);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!n.trim()) { toast.error('Mekân adı boş olamaz.'); return; }
    setBusy(true);
    const r = await fetch('/api/panel/venue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, city: c }),
    });
    setBusy(false);
    if (r.ok) { toast('Mekân bilgileri kaydedildi'); router.refresh(); }
    else toast.error('Kaydedilemedi, tekrar deneyin.');
  };

  return (
    <CardContent className="grid gap-4">
      <div className="grid gap-2"><Label htmlFor="n">Mekân adı</Label><Input id="n" value={n} onChange={(e) => setN(e.target.value)} maxLength={40} /></div>
      <div className="grid gap-2">
        <Label htmlFor="s">Adres (karekodlarda)</Label>
        <div className="flex items-center gap-1"><span className="text-muted-foreground text-sm">oyunhadi.com/</span><Input id="s" defaultValue={slug} className="font-mono" disabled readOnly /></div>
        <p className="text-muted-foreground text-xs">Basılı karekodlar bozulmasın diye adres kilitlidir.</p>
      </div>
      <div className="grid gap-2"><Label htmlFor="c">Şehir / ilçe</Label><Input id="c" value={c} onChange={(e) => setCity(e.target.value)} maxLength={40} /></div>
      <Button className="w-fit" onClick={save} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Kaydet'}</Button>
    </CardContent>
  );
}
