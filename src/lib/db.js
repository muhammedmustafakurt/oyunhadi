import { neon } from '@neondatabase/serverless';

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

// Şimdilik yalnızca oyun odaları veritabanında; mekân ve masalar src/lib/demo.ts içindeki örnek verilerden gelir.
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
];

function ensure() {
  const sig = SCHEMA.join(';');
  if (g.__dbSig !== sig) { g.__dbSig = sig; g.__dbReady = null; }
  g.__dbReady ??= (async () => {
    const q = await client();
    for (const stmt of SCHEMA) await q(stmt, []);
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
