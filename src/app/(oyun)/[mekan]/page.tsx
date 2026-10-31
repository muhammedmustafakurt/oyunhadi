import { notFound } from 'next/navigation';
import { findCafe } from '@/lib/rooms';
import VenueBadge from '@/components/oyun/VenueBadge';
import Confetti from '@/components/oyun/Confetti';

export async function generateMetadata({ params }: PageProps<'/[mekan]'>) {
  const { mekan } = await params;
  const v = await findCafe(mekan);
  return { title: v ? v.name : 'Mekân' };
}

// Masa numarası olmadan açılan mekân adresi: karşılama ekranı.
export default async function VenueWelcome({ params }: PageProps<'/[mekan]'>) {
  const { mekan } = await params;
  const v = await findCafe(mekan);
  if (!v) notFound();
  return (
    <main className="oh-welcome">
      <Confetti />
      <div className="oh-welcome-in">
        <VenueBadge venue={v} size="lg" />
        <h1>{v.name}</h1>
        <p className="oh-welcome-city">{v.city}</p>
        <div className="oh-scan" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <rect x="8" y="8" width="104" height="104" rx="22" fill="#fff" />
            <g fill="currentColor">
              <rect x="22" y="22" width="26" height="26" rx="6" /><rect x="72" y="22" width="26" height="26" rx="6" /><rect x="22" y="72" width="26" height="26" rx="6" />
              <rect x="30" y="30" width="10" height="10" fill="#fff" rx="2" /><rect x="80" y="30" width="10" height="10" fill="#fff" rx="2" /><rect x="30" y="80" width="10" height="10" fill="#fff" rx="2" />
              <rect x="58" y="58" width="8" height="8" rx="2" /><rect x="72" y="62" width="8" height="8" rx="2" /><rect x="86" y="72" width="12" height="8" rx="2" /><rect x="62" y="80" width="8" height="18" rx="2" /><rect x="78" y="86" width="8" height="12" rx="2" /><rect x="56" y="22" width="8" height="12" rx="2" /><rect x="22" y="56" width="12" height="8" rx="2" />
            </g>
          </svg>
        </div>
        <p className="oh-welcome-lead">Masanızdaki karekodu telefonunuzun kamerasıyla okutun, oyunlar açılsın.</p>
        <p className="oh-welcome-note">Uygulama indirmeniz gerekmez.</p>
      </div>
      <footer className="oh-foot"><a href="/">oyunhadi</a> ile oynanıyor</footer>
    </main>
  );
}
