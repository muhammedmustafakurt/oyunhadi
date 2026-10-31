import Link from 'next/link';
import { notFound } from 'next/navigation';
import Monopoly from '@/components/games/Monopoly';
import Chess from '@/components/games/Chess';
import GameBand from '@/components/oyun/GameBand';
import { GAMES } from '@/lib/games';

// Mekân dışında, tek telefonda sırayla oynanan sürümler (sitedeki "Hemen dene" bağlantıları buraya gelir).
const VIEWS: Record<string, React.ComponentType> = { monopoly: Monopoly, satranc: Chess };

export async function generateMetadata({ params }: PageProps<'/oyna/[game]'>) {
  const { game } = await params;
  const g = GAMES.find((x) => x.id === game);
  return { title: g ? `${g.name} · Tek telefonda` : 'Oyun' };
}

export default async function LocalPlay({ params }: PageProps<'/oyna/[game]'>) {
  const { game } = await params;
  const g = GAMES.find((x) => x.id === game && x.play && !x.tableOnly);
  if (!g || !VIEWS[g.id]) notFound();
  const View = VIEWS[g.id];
  return (
    <main className="oh oh-play" style={{ '--brand': '#ff4f2e', '--accent': '#ffc83d' } as React.CSSProperties}>
      <header className="oh-play-top">
        <Link href="/oyunlar" className="oh-back" aria-label="Oyunlar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </Link>
        <span className="oh-play-where">oyunhadi<small>Tek telefonda sırayla</small></span>
      </header>
      <GameBand game={g} />
      <div className={`shell oh-play-body${g.id === 'monopoly' ? ' game-board' : ''}`}>
        <View />
      </div>
    </main>
  );
}
