import type { Venue } from '@/lib/demo';
import VenueBadge from './VenueBadge';

// Masa ana sayfasının üst satırı: mekân logosu ve adı.
export default function PlayerTop({ venue }: { venue: Venue }) {
  return (
    <div className="oh-top">
      <VenueBadge venue={venue} />
      <span className="oh-top-name">
        {venue.name}
        <small>{venue.city}</small>
      </span>
    </div>
  );
}
