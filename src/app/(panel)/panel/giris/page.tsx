import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/panel/login-form';
import { panelVenue } from '@/lib/venues';

export const metadata = { title: 'Giriş' };

// Mekân girişi (starter'daki iki sütunlu giriş ekranı). Oturum açıksa doğrudan panele.
export default async function LoginPage() {
  if (await panelVenue()) redirect('/panel');
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,oklch(0.623_0.214_259.815),transparent_45%),radial-gradient(circle_at_80%_70%,oklch(0.68_0.21_33),transparent_40%)]" aria-hidden="true" />
        <Link href="/" className="relative z-10 flex items-center gap-2 text-lg font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-blue-500">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="5" cy="5" r="2" fill="#fff" /><circle cx="11" cy="11" r="2" fill="#fff" /></svg>
          </span>
          oyunhadi
        </Link>
        <div className="relative z-10 grid grid-cols-3 gap-3" aria-hidden="true">
          {[['Tabu', '#e0457f'], ['Bil Bakalım', '#1f9d6b'], ['Casus', '#7a4b2a'], ['Vampir Köylü', '#6b2fb0'], ['Çiz Bakalım', '#f2a900'], ['Satranç', '#1d2a5c']].map(([n, c], i) => (
            <div key={n} className="rounded-xl p-4 text-sm font-bold shadow-lg" style={{ background: c, transform: `rotate(${[-4, 3, -2, 2, -3, 4][i]}deg)` }}>{n}</div>
          ))}
        </div>
        <blockquote className="relative z-10 space-y-2">
          <p className="text-lg">&ldquo;Hafta içi öğleden sonraları masalar artık boş kalmıyor. Öğrenciler Tabu için geliyor, iki çay daha içip gidiyor.&rdquo;</p>
          <footer className="text-sm text-zinc-400">Örnek mekân yorumu</footer>
        </blockquote>
      </div>
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Mekân girişi</h1>
          <p className="text-muted-foreground mt-1 mb-6 text-sm">Panelinize e-posta adresiniz ve şifrenizle girin.</p>
          <LoginForm />
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Henüz müşterimiz değil misiniz? <Link href="/teklif" className="text-primary underline-offset-4 hover:underline">Teklif alın</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
