import { notFound } from 'next/navigation';
import { findCafe } from '@/lib/rooms';
import type { Venue } from '@/lib/venue-types';

// Mekânın renkleri bütün oyuncu sayfalarına buradan yayılır; oyunlar --blue değişkeniyle mekân rengini alır.
export default async function VenueLayout({ children, params }: LayoutProps<'/[mekan]'>) {
  const { mekan } = await params;
  const venue: Venue | null = await findCafe(mekan);
  if (!venue) notFound();
  return (
    <div className="oh" style={{ '--brand': venue.color, '--accent': venue.accent } as React.CSSProperties}>
      {children}
    </div>
  );
}
