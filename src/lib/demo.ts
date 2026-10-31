// Tasarım aşaması için örnek veriler. Veritabanı, giriş ve ödeme eklenince bu dosyanın yerini gerçek sorgular alacak.
// Oyuncu ekranı (src/app/(oyun)) ve mekân paneli (src/app/(panel)) aynı örnek mekânları kullanır.

export const PLAYABLE = ['monopoly', 'satranc', 'spyfall', 'ajanlar', 'vampir', 'tabu', 'kimim', 'cizim', 'bil'] as const;

export type Venue = {
  id: number;
  slug: string;
  name: string;
  city: string;
  /** Logo yüklenmediyse gösterilen kısaltma */
  initials: string;
  logoUrl: string | null;
  /** Ana renk: butonlar, başlık bandı. Oyunlarda --blue değişkeninin yerini alır. */
  color: string;
  /** İkinci renk: süslemeler, rozetler */
  accent: string;
  tables: number;
  /** Konum kontrolü: doluysa masaya yalnızca mekândaki telefonlar katılabilir */
  lat: number | null;
  lng: number | null;
  games: string[];
  welcome: string;
  announcement: { title: string; body: string } | null;
  reward: { game: string; goal: string; prize: string } | null;
};

export const VENUES: Venue[] = [
  {
    id: 1,
    slug: 'demo',
    name: 'Hadi Kafe',
    city: 'Kadıköy, İstanbul',
    initials: 'HK',
    logoUrl: null,
    color: '#ff4f2e',
    accent: '#ffc83d',
    tables: 12,
    lat: null,
    lng: null,
    games: [...PLAYABLE],
    welcome: 'Çaylar bizden değil ama oyunlar bizden!',
    announcement: { title: 'Cuma akşamı Tabu turnuvası', body: 'Saat 20:00\'de. Kazanan masaya büyük boy pizza ikramımız.' },
    reward: { game: 'bil', goal: 'Bil Bakalım\'da 6.000 puanı geç', prize: '1 tatlı ikram' },
  },
  {
    id: 2,
    slug: 'lavanta-bistro',
    name: 'Lavanta Bistro',
    city: 'Alsancak, İzmir',
    initials: 'LB',
    logoUrl: null,
    color: '#7c3aed',
    accent: '#22d3ee',
    tables: 8,
    lat: null,
    lng: null,
    games: ['spyfall', 'tabu', 'kimim', 'cizim', 'bil', 'satranc'],
    welcome: 'Siparişiniz gelene kadar bir el oynayın.',
    announcement: null,
    reward: null,
  },
];

export const findVenue = (slug: string) => VENUES.find((v) => v.slug === slug) ?? null;

/** Panelde oturum açmış mekân (giriş eklenince oturumdan gelecek) */
export const CURRENT_VENUE = VENUES[0];

// ---------- Panel için örnek istatistikler ----------

export const WEEK = [
  { day: 'Pzt', oyun: 18, oyuncu: 54 },
  { day: 'Sal', oyun: 22, oyuncu: 71 },
  { day: 'Çar', oyun: 25, oyuncu: 80 },
  { day: 'Per', oyun: 31, oyuncu: 104 },
  { day: 'Cum', oyun: 47, oyuncu: 168 },
  { day: 'Cmt', oyun: 58, oyuncu: 212 },
  { day: 'Paz', oyun: 41, oyuncu: 139 },
];

export const MONTHS = [
  { ay: 'May', oyun: 412 },
  { ay: 'Haz', oyun: 498 },
  { ay: 'Tem', oyun: 561 },
  { ay: 'Ağu', oyun: 604 },
  { ay: 'Eyl', oyun: 688 },
  { ay: 'Eki', oyun: 802 },
];

export const BY_GAME = [
  { game: 'tabu', oyun: 61 },
  { game: 'bil', oyun: 54 },
  { game: 'cizim', oyun: 38 },
  { game: 'spyfall', oyun: 29 },
  { game: 'kimim', oyun: 24 },
  { game: 'vampir', oyun: 17 },
  { game: 'monopoly', oyun: 12 },
  { game: 'ajanlar', oyun: 11 },
  { game: 'satranc', oyun: 6 },
];

export const HOURS = [
  { saat: '12', oyun: 6 }, { saat: '14', oyun: 9 }, { saat: '16', oyun: 14 }, { saat: '18', oyun: 23 },
  { saat: '20', oyun: 41 }, { saat: '22', oyun: 37 }, { saat: '00', oyun: 12 },
];

export type TableRow = { no: number; label: string; status: 'oynaniyor' | 'bos' | 'kapali'; game: string | null; players: number; today: number; lastScan: string };

export const TABLES: TableRow[] = Array.from({ length: CURRENT_VENUE.tables }, (_, i) => {
  const no = i + 1;
  const games = ['tabu', 'bil', 'cizim', 'spyfall', null, 'kimim', null, 'vampir', 'tabu', null, 'monopoly', null];
  const game = games[i] ?? null;
  return {
    no,
    label: no <= 8 ? `Masa ${no}` : `Bahçe ${no - 8}`,
    status: no === 12 ? 'kapali' : game ? 'oynaniyor' : 'bos',
    game: no === 12 ? null : game,
    players: game ? [4, 3, 5, 6, 0, 4, 0, 7, 4, 0, 3, 0][i] : 0,
    today: [9, 7, 6, 5, 2, 4, 1, 3, 6, 0, 2, 0][i],
    lastScan: game ? 'şimdi' : ['', '', '', '', '18 dk önce', '', '1 sa önce', '', '', 'dün', '', '3 gün önce'][i],
  };
});

export type RewardCode = { code: string; table: string; game: string; prize: string; status: 'bekliyor' | 'kullanildi' | 'suresi-doldu'; issued: string };

export const REWARD_CODES: RewardCode[] = [
  { code: 'HK-7Q4M', table: 'Masa 3', game: 'bil', prize: '1 tatlı ikram', status: 'bekliyor', issued: '12 dk önce' },
  { code: 'HK-2XPA', table: 'Masa 1', game: 'bil', prize: '1 tatlı ikram', status: 'kullanildi', issued: '1 sa önce' },
  { code: 'HK-9DLE', table: 'Bahçe 1', game: 'tabu', prize: 'Masaya çay', status: 'kullanildi', issued: '2 sa önce' },
  { code: 'HK-K3TR', table: 'Masa 6', game: 'bil', prize: '1 tatlı ikram', status: 'suresi-doldu', issued: 'dün' },
  { code: 'HK-5WNB', table: 'Masa 2', game: 'cizim', prize: 'Masaya çay', status: 'kullanildi', issued: 'dün' },
];

export const REWARD_RULES = [
  { id: 1, game: 'bil', goal: '6.000 puan ve üstü', prize: '1 tatlı ikram', limit: 'Masa başına günde 1', active: true },
  { id: 2, game: 'tabu', goal: 'Kazanan takım', prize: 'Masaya çay', limit: 'Günde en fazla 10', active: true },
  { id: 3, game: 'cizim', goal: 'Oyunu birinci bitir', prize: 'Masaya çay', limit: 'Masa başına günde 1', active: false },
];

export const SUBSCRIPTION = {
  plan: 'Yıllık paket',
  status: 'aktif' as const,
  startedAt: '14 Mart 2026',
  endsAt: '14 Mart 2027',
  daysLeft: 134,
  totalDays: 365,
  paid: '₺24.000 + KDV',
  method: 'iyzico · 3 taksit',
  payments: [
    { date: '14 Mart 2026', desc: '1. taksit', amount: '₺9.600', status: 'Ödendi' },
    { date: '14 Nisan 2026', desc: '2. taksit', amount: '₺9.600', status: 'Ödendi' },
    { date: '14 Mayıs 2026', desc: '3. taksit', amount: '₺9.600', status: 'Ödendi' },
  ],
};
