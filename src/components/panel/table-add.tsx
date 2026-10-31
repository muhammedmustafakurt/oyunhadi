'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Yeni masa: venues.ntables + 1 → karekod adresi otomatik oluşur (masalar/yazdir sayfası).
export default function TableAdd({ tables }: { tables: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const add = async () => {
    setBusy(true);
    const r = await fetch('/api/panel/venue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tables: tables + 1 }),
    });
    setBusy(false);
    if (r.ok) { toast(`Masa ${tables + 1} eklendi`, { description: 'Karekodunu yazdır sayfasından alabilirsiniz.' }); router.refresh(); }
    else toast.error('Masa eklenemedi, tekrar deneyin.');
  };

  return (
    <Button onClick={add} disabled={busy}><IconPlus /> Masa ekle</Button>
  );
}
