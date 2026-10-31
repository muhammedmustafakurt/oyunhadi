'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { IconMoon, IconSun, IconBell } from '@tabler/icons-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { titleOf } from './nav';

// Starter'daki üst bar: menü düğmesi, sayfa adı, tema düğmesi.
export default function Header() {
  const path = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <header className="no-print bg-background/60 sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-md md:h-14">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 data-vertical:self-center" />
        <span className="text-muted-foreground text-sm">Panel</span>
        <span className="text-muted-foreground text-sm">/</span>
        <span className="text-sm font-medium">{titleOf(path)}</span>
      </div>
      <div className="flex items-center gap-1 px-4">
        <Button variant="ghost" size="icon" aria-label="Bildirimler"><IconBell /></Button>
        <Button variant="ghost" size="icon" aria-label="Temayı değiştir" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
          <IconSun className="hidden dark:block" />
          <IconMoon className="dark:hidden" />
        </Button>
      </div>
    </header>
  );
}
