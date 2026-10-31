import type { Venue } from '@/lib/venue-types';

// Mekân logosu; logo yüklenmediyse baş harfler mekân renginde gösterilir.
export default function VenueBadge({ venue, size = 'md' }: { venue: Venue; size?: 'md' | 'lg' }) {
  return (
    <span className={`oh-badge ${size}`} aria-hidden={size === 'md' ? true : undefined}>
      {venue.logoUrl ? <img src={venue.logoUrl} alt={venue.name} /> : venue.initials}
    </span>
  );
}
