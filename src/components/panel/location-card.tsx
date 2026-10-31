'use client';

import { useState } from 'react';
import { IconCurrentLocation } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Konum kilidi (nfc'deki CafeLocation bileşeninin panel hâli). TASARIM AŞAMASI: kaydedilmez.
export default function LocationCard({ lat, lng }: { lat: number | null; lng: number | null }) {
  const [on, setOn] = useState(lat != null);
  const [la, setLa] = useState(lat?.toFixed(6) ?? '');
  const [ln, setLn] = useState(lng?.toFixed(6) ?? '');
  const [radius, setRadius] = useState('250');

  const here = () => {
    if (!navigator.geolocation) { toast.error('Bu tarayıcı konum vermiyor.'); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setLa(p.coords.latitude.toFixed(6)); setLn(p.coords.longitude.toFixed(6)); setOn(true); },
      () => toast.error('Konum alınamadı, izin verin ya da elle girin.'),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <div className="grid gap-4">
      <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
        <span>
          <span className="block font-medium">Konum kilidi</span>
          <span className="text-muted-foreground text-sm">Açıkken masaya yalnızca mekânınızdaki telefonlar katılabilir; uzaklaşan oyuncu masadan düşer.</span>
        </span>
        <Switch checked={on} onCheckedChange={setOn} />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2"><Label htmlFor="lat">Enlem</Label><Input id="lat" value={la} onChange={(e) => setLa(e.target.value)} inputMode="decimal" placeholder="40.990211" disabled={!on} /></div>
        <div className="grid gap-2"><Label htmlFor="lng">Boylam</Label><Input id="lng" value={ln} onChange={(e) => setLn(e.target.value)} inputMode="decimal" placeholder="29.029431" disabled={!on} /></div>
        <div className="grid gap-2"><Label htmlFor="r">Yarıçap (metre)</Label><Input id="r" value={radius} onChange={(e) => setRadius(e.target.value)} inputMode="numeric" disabled={!on} /></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={here}><IconCurrentLocation /> Şu anki konumumu kullan</Button>
        <Button onClick={() => toast('Konum ayarı hazır (önizleme)', { description: 'Kaydetme, veritabanı bağlanınca çalışacak.' })}>Kaydet</Button>
      </div>
      <p className="text-muted-foreground text-xs">İpucu: Bu sayfayı mekânınızdayken açıp &ldquo;Şu anki konumumu kullan&rdquo;a basın.</p>
    </div>
  );
}
