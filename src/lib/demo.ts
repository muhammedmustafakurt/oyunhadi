// Ödül kodları ve abonelik örnek verisi. TASARIM AŞAMASI: ödül ve abonelik sistemi veritabanına
// bağlandığında bu dosyanın yerini gerçek sorgular alacak. Mekânlar artık DB'de (src/lib/venues.js).
// Oyuncu ekranı (src/app/(oyun)) veritabanındaki mekân kaydını okur.

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
