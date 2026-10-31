'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// TASARIM AŞAMASI: duyuru kaydedilmez.
export default function AnnouncementForm() {
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => { e.preventDefault(); toast('Duyuru taslağı hazır', { description: 'Kaydetme, veritabanı bağlanınca çalışacak.' }); }}
    >
      <div className="grid gap-2"><Label htmlFor="t">Başlık</Label><Input id="t" maxLength={60} placeholder="Cuma akşamı Tabu turnuvası" required /></div>
      <div className="grid gap-2"><Label htmlFor="b">Metin</Label><Textarea id="b" maxLength={160} rows={3} placeholder="Saat 20:00'de. Kazanan masaya pizza bizden!" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2"><Label htmlFor="s">Başlangıç</Label><Input id="s" type="date" /></div>
        <div className="grid gap-2"><Label htmlFor="e">Bitiş</Label><Input id="e" type="date" /></div>
      </div>
      <Button type="submit">Yayınla</Button>
    </form>
  );
}
