'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './logo';
import { NAV } from '@/lib/site';

// Üst menü: tam genişlik şerit, solda logo, ortada bağlantılar, sağda koyu hap düğme. Kaydırınca krem zemin alır.
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Ana sayfanın en üstünde menü yeşil çuhanın üstünde durur: açık renk yazı.
  const onFelt = path === '/' && !scrolled && !open;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] ${scrolled || open ? 'bg-cream/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo light={onFelt} />
        <nav className="hidden flex-1 md:block" aria-label="Ana menü">
          <ul className="flex items-center gap-1 text-[15px] font-semibold">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`rounded-full px-3 py-2 transition ${path?.startsWith(n.href) ? 'bg-ink text-white' : onFelt ? 'text-white/85 hover:text-white' : 'text-ink/75 hover:text-ink'}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/panel/giris" className={`hidden rounded-full px-3 py-2 text-[15px] font-semibold sm:block ${onFelt ? 'text-white/85 hover:text-white' : 'text-ink/75 hover:text-ink'}`}>Mekân girişi</Link>
          <Link href="/teklif" className={`btn-sm ${onFelt ? 'btn-sun' : 'btn-dark'}`}>Teklif al</Link>
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full md:hidden ${onFelt ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5'}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-t border-line px-4 pb-5 md:hidden" aria-label="Mobil menü">
          <ul className="grid gap-1 pt-3 text-lg font-semibold">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="block rounded-xl px-3 py-3 hover:bg-ink/5">{n.label}</Link></li>
            ))}
            <li><Link href="/panel/giris" className="block rounded-xl px-3 py-3 hover:bg-ink/5">Mekân girişi</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
