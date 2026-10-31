import Link from 'next/link';

// oyunhadi işareti: iki noktalı zar + yazı.
export default function Logo({ withText = true, light = false }: { withText?: boolean; light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="oyunhadi ana sayfa">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <rect x="1.5" y="1.5" width="27" height="27" rx="9" fill={light ? '#ffc83d' : '#ff4f2e'} transform="rotate(-8 15 15)" />
        <circle cx="10.5" cy="10.5" r="3" fill={light ? '#1c1233' : '#fff'} />
        <circle cx="19.5" cy="19.5" r="3" fill={light ? '#1c1233' : '#fff'} />
      </svg>
      {withText && <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>oyunhadi</span>}
    </Link>
  );
}
