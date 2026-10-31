// Başlık bandındaki süs şekilleri: zar, piyon, yıldız ve kart; mekânın ikinci rengini (--accent) kullanır.
export default function Confetti() {
  return (
    <svg className="oh-confetti" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="var(--accent)">
        <rect x="318" y="26" width="46" height="46" rx="11" transform="rotate(14 341 49)" opacity=".9" />
        <circle cx="331" cy="40" r="4.5" fill="var(--brand)" />
        <circle cx="351" cy="58" r="4.5" fill="var(--brand)" />
        <path d="M30 236l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" opacity=".85" />
        <circle cx="372" cy="196" r="9" opacity=".7" />
        <circle cx="64" cy="58" r="6" opacity=".55" />
        <rect x="248" y="248" width="34" height="48" rx="6" transform="rotate(-18 265 272)" opacity=".5" />
        <path d="M190 18c8 0 13 6 13 13 0 5-3 9-6 11l5 14h-24l5-14c-3-2-6-6-6-11 0-7 5-13 13-13z" opacity=".45" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".35">
        <path d="M108 30q12-14 24 0t24 0" />
        <path d="M300 140q10-12 20 0t20 0" />
        <circle cx="140" cy="268" r="12" />
      </g>
    </svg>
  );
}
