'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// TASARIM AŞAMASI: gerçek giriş yok; düğme panele geçirir.
export default function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => { e.preventDefault(); setBusy(true); router.push('/panel'); }}
    >
      <div className="grid gap-2">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="ornek@mekaniniz.com" defaultValue="elif@hadikafe.com" required />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="pw">Şifre</Label>
          <a href="#" className="text-muted-foreground text-xs underline-offset-4 hover:underline">Şifremi unuttum</a>
        </div>
        <Input id="pw" type="password" autoComplete="current-password" defaultValue="demo1234" required />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'Giriş yapılıyor…' : 'Giriş yap'}</Button>
    </form>
  );
}
