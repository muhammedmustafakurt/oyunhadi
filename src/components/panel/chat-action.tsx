'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Panel sohbet moderasyonu: oturum kapatma, sohbet kapatma, şikâyet kapatma.
export default function ChatAction({ action, id, label, confirm, variant = 'outline' }: {
  action: 'kick' | 'close_room' | 'dismiss_report';
  id: number;
  label: string;
  confirm?: string;
  variant?: 'outline' | 'destructive' | 'ghost' | 'secondary';
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (confirm && !window.confirm(confirm)) return;
    setBusy(true);
    const r = await fetch('/api/panel/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id }),
    });
    setBusy(false);
    if (r.ok) { toast('İşlem tamamlandı'); router.refresh(); }
    else toast.error('İşlem başarısız.');
  };

  return <Button size="sm" variant={variant} disabled={busy} onClick={run}>{busy ? '…' : label}</Button>;
}
