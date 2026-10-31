import { neon } from '@neondatabase/serverless';
import { randomBytes, scryptSync } from 'node:crypto';

// Neon (sunucusuz Postgres). Bağlantı adresi DATABASE_URL ortam değişkeninden gelir.
// DATABASE_URL yoksa (yerel tasarım/deneme aşaması) aynı SQL bellekteki PGlite'ta çalışır; sunucu kapanınca silinir.
// Çağrı yerleri `?` yer tutucusuyla yazılır; burada Postgres'in $1, $2 biçimine çevrilir.

const g = globalThis;

async function client() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const sql = (g.__neonSql ??= neon(url));
    return (text, params) => sql.query(text, params);
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL ayarlanmamış. Neon bağlantı adresini ortam değişkenlerine ekleyin.');
  }
  g.__pglite ??= import('@electric-sql/pglite').then(({ PGlite }) => new PGlite());
  const db = await g.__pglite;
  return async (text, params) => (await db.query(text, params)).rows;
}

const toPg = (text) => {
  let i = 0;
  return text.replace(/\?/g, () => `$${++i}`);
};

// Şimdilik oyun odaları, mekânlar ve oyun kayıtları veritabanında.
const SCHEMA = [
  // Mekân masalarındaki çok oyunculu oyun odaları: her (mekân, masa, oyun) için bir satır, durum JSON olarak tutulur.
  `CREATE TABLE IF NOT EXISTS game_rooms (
    id SERIAL PRIMARY KEY,
    biz_id INTEGER NOT NULL, -- mekân numarası
    tbl TEXT NOT NULL,
    game TEXT NOT NULL,
    state TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 0,
    updated_at BIGINT NOT NULL,
    UNIQUE (biz_id, tbl, game)
  )`,
  // Mekân kayıtları: panelin yönettiği ve oyuncu ekranının okuduğu mekân bilgisi. Sütunlar src/lib/venue-types.ts'teki
  // Venue tipiyle birebir; games virgülle ayrılmış liste, announcement ve reward (varsa) kendi sütunlarında.
  `CREATE TABLE IF NOT EXISTS venues (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    initials TEXT NOT NULL DEFAULT '',
    logo_url TEXT,
    color TEXT NOT NULL DEFAULT '#ff4f2e',
    accent TEXT NOT NULL DEFAULT '#ffc83d',
    ntables INTEGER NOT NULL DEFAULT 1,
    lat BIGINT, lng BIGINT, -- null: konum kilidi kapalı; derece × 1e6 tam sayı olarak tutulur (NUMERIC yerine basitlik)
    games TEXT NOT NULL DEFAULT '',
    welcome TEXT NOT NULL DEFAULT '',
    ann_title TEXT, ann_body TEXT,
    reward_game TEXT, reward_goal TEXT, reward_prize TEXT,
    email TEXT NOT NULL DEFAULT '',
    password TEXT NOT NULL DEFAULT '', -- scrypt karması: salt:hash
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  )`,
  // Başlanan her oyun bir kayıt: panelin istatistikleri (haftalık, saat, oyun bazlı) buradan hesaplanır.
  `CREATE TABLE IF NOT EXISTS play_logs (
    id SERIAL PRIMARY KEY,
    biz_id INTEGER NOT NULL,
    masa TEXT NOT NULL,
    game TEXT NOT NULL,
    players INTEGER NOT NULL DEFAULT 0,
    at BIGINT NOT NULL
  )`,
];

// Veritabanı boş açılırsa ilk mekânlar örnek verilerle eklenir. Panel girişi test hesabıyla yapılır
// (elif@hadikafe.com / demo1234); şifre alanında scrypt karması saklanır.
const SCRYPT = { N: 16384, r: 8, p: 1 };
export function hashPassword(plain, salt) {
  const s = salt ?? randomBytes(16).toString('hex');
  const h = scryptSync(plain, s, 32, SCRYPT).toString('hex');
  return `${s}:${h}`;
}

const SEED_VENUES = () => {
  const now = Date.now();
  return [
    {
      slug: 'demo', name: 'Hadi Kafe', city: 'Kadıköy, İstanbul', initials: 'HK', logo_url: null,
      color: '#ff4f2e', accent: '#ffc83d', ntables: 12, lat: null, lng: null,
      games: 'monopoly,satranc,spyfall,ajanlar,vampir,tabu,kimim,cizim,bil',
      welcome: 'Çaylar bizden değil ama oyunlar bizden!',
      ann_title: 'Cuma akşamı Tabu turnuvası', ann_body: "Saat 20:00'de. Kazanan masaya büyük boy pizza ikramımız.",
      reward_game: 'bil', reward_goal: "Bil Bakalım'da 6.000 puanı geç", reward_prize: '1 tatlı ikram',
      email: 'elif@hadikafe.com', password: hashPassword('demo1234'),
    },
    {
      slug: 'lavanta-bistro', name: 'Lavanta Bistro', city: 'Alsancak, İzmir', initials: 'LB', logo_url: null,
      color: '#7c3aed', accent: '#22d3ee', ntables: 8, lat: null, lng: null,
      games: 'spyfall,tabu,kimim,cizim,bil,satranc',
      welcome: 'Siparişiniz gelene kadar bir el oynayın.',
      ann_title: null, ann_body: null,
      reward_game: null, reward_goal: null, reward_prize: null,
      email: '', password: '',
    },
  ].map((v) => ({ ...v, created_at: now, updated_at: now }));
};

function ensure() {
  const sig = SCHEMA.join(';');
  if (g.__dbSig !== sig) { g.__dbSig = sig; g.__dbReady = null; }
  g.__dbReady ??= (async () => {
    const q = await client();
    for (const stmt of SCHEMA) await q(stmt, []);
    const rows = await q('SELECT count(*)::int AS n FROM venues', []);
    if (rows[0]?.n === 0) {
      for (const v of SEED_VENUES()) {
        await q(
          'INSERT INTO venues (slug, name, city, initials, logo_url, color, accent, ntables, lat, lng, games, welcome, ann_title, ann_body, reward_game, reward_goal, reward_prize, email, password, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) ON CONFLICT (slug) DO NOTHING',
          [v.slug, v.name, v.city, v.initials, v.logo_url, v.color, v.accent, v.ntables, v.lat, v.lng, v.games, v.welcome, v.ann_title, v.ann_body, v.reward_game, v.reward_goal, v.reward_prize, v.email, v.password, v.created_at, v.updated_at],
        );
      }
    }
  })().catch((err) => {
    g.__dbReady = null; // sonraki istekte yeniden dene
    throw err;
  });
  return g.__dbReady;
}

async function exec(text, params) {
  await ensure();
  const q = await client();
  return q(toPg(text), params);
}

export const get = async (text, ...params) => (await exec(text, params))[0];
export const all = (text, ...params) => exec(text, params);
export const run = async (text, ...params) => { await exec(text, params); };
