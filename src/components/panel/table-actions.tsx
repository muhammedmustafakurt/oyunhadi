'use client';

import { IconDots, IconPencil, IconPlayerPause, IconRefresh, IconExternalLink } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Masa satırının işlem menüsü. TASARIM AŞAMASI: işlemler yalnızca bildirim gösterir.
export default function TableActions({ label, url }: { label: string; url: string }) {
  const soon = (what: string) => toast(`${label}: ${what}`, { description: 'Bu işlem veritabanı bağlanınca çalışacak.' });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`${label} işlemleri`} />}>
        <IconDots />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<a href={url} target="_blank" rel="noopener noreferrer" />}><IconExternalLink /> Oyuncu ekranını aç</DropdownMenuItem>
        <DropdownMenuItem onClick={() => soon('adı değiştir')}><IconPencil /> Adını değiştir</DropdownMenuItem>
        <DropdownMenuItem onClick={() => soon('geçici olarak kapat')}><IconPlayerPause /> Geçici olarak kapat</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => soon('masadaki oyunu sıfırla')}><IconRefresh /> Masadaki oyunu sıfırla</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
