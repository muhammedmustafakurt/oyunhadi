import type { Metadata } from 'next';

// Site, panel ve oyuncu ekranı ayrı kök layout'lar kullandığı için eşleşmeyen adreslerin 404 sayfası burada.
export const metadata: Metadata = { title: 'Sayfa bulunamadı · oyunhadi', robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="tr">
      <body style={{ margin: 0, minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#fff7ee', color: '#1c1233', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: 24 }}>
        <main>
          <p style={{ fontSize: 64, margin: 0, fontWeight: 800, color: '#ff4f2e' }}>404</p>
          <h1 style={{ margin: '8px 0', fontSize: 28 }}>Bu sayfa masada yok.</h1>
          <p style={{ color: '#6a5f80', margin: '0 0 24px' }}>Karekodu yeniden okutmayı deneyin ya da ana sayfaya dönün.</p>
          <a href="/" style={{ display: 'inline-block', padding: '12px 20px', borderRadius: 14, background: '#ff4f2e', color: '#fff', fontWeight: 700, textDecoration: 'none', border: '2.5px solid #1c1233' }}>Ana sayfa</a>
        </main>
      </body>
    </html>
  );
}
