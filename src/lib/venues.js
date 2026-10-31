// Mekân kayıtları (venues tablosu). Oyuncu ekranı ve panel buradan okur; panel kaydetme işlemleri
// updateVenue ile yapılır. Şema src/lib/db.js'te, tip src/lib/venue-types.ts'te tanımlı.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, scryptSync } from 'node:crypto';
import { get, all, run } from './db';
// Venue tipi veren dosya TS olduğu için JS dosyasında yalnızca JSDoc ile Referanslı tip kullanılır:

const COLS = 'id, slug, name, city, initials, logo_url, color, accent, ntables, lat, lng, games, welcome, ann_title, ann_body, reward_game, reward_goal, reward_prize, email';
const VENUE_GAMES = 'monopoly satranc spyfall ajanlar vampir tabu kimim cizim bil'.split(' ');
const SCRYPT = { N: 16384, r: 8, p: 1 }; // db.js hashPassword ile aynı olmalı

function deg(raw) {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) && n !== 0 ? n / 1_000_000 : null;
}

// Satırı Venue tipine dönüştürür; duyuru ve ödül boşsa null olur, konum yarımlıysa tamamen null.
export function shapeVenue(r) {
  const v = {
    id: r.id, slug: r.slug, name: r.name, city: r.city, initials: r.initials,
    logoUrl: r.logo_url, color: r.color, accent: r.accent, tables: r.ntables,
    lat: deg(r.lat), lng: deg(r.lng),
    games: String(r.games || '').split(',').filter((x) => VENUE_GAMES.includes(x)),
    welcome: r.welcome, email: r.email,
    announcement: r.ann_title && r.ann_body ? { title: r.ann_title, body: r.ann_body } : null,
    reward: r.reward_game && r.reward_goal && r.reward_prize ? { game: r.reward_game, goal: r.reward_goal, prize: r.reward_prize } : null,
  };
  if (v.lat == null) v.lng = null;
  if (v.lng == null) v.lat = null;
  return v;
}

export async function listVenues() {
  return (await all(`SELECT ${COLS} FROM venues ORDER BY id`, [])).map(shapeVenue);
}

export async function getVenueBySlug(slug) {
  const r = await get(`SELECT ${COLS} FROM venues WHERE slug = ?`, slug);
  return r ? shapeVenue(r) : null;
}

export async function getVenue(id) {
  const r = await get(`SELECT ${COLS} FROM venues WHERE id = ?`, id);
  return r ? shapeVenue(r) : null;
}

// Panel sayfalarından gelen yamayı uygular; yalnızca izinli alanlar yazılır.
export async function updateVenue(id, patch = {}) {
  const SET = {
    name: 'name', city: 'city', welcome: 'welcome', logoUrl: 'logo_url', color: 'color', accent: 'accent', initials: 'initials',
  };
  const clean = (s, max) => String(s ?? '').replace(/[<>]/g, '').trim().slice(0, max);
  const parts = [];
  const params = [];

  for (const [k, col] of Object.entries(SET)) {
    if (k in patch) { parts.push([col, clean(patch[k], 200)]); }
  }
  if ('tables' in patch) {
    const n = Math.max(1, Math.min(500, Math.floor(Number(patch.tables) || 1)));
    parts.push(['ntables', n]);
  }
  if ('lat' in patch || 'lng' in patch) {
    const lat = Number(patch.lat), lng = Number(patch.lng);
    const ok = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    if (ok) parts.push(['lat', Math.round(lat * 1e6)], ['lng', Math.round(lng * 1e6)]);
    else parts.push(['lat', null], ['lng', null]);
  }
  if ('games' in patch && Array.isArray(patch.games)) {
    parts.push(['games', patch.games.filter((x) => VENUE_GAMES.includes(x)).join(',')]);
  }
  if ('announcement' in patch) {
    const a = patch.announcement;
    if (a && clean(a.title, 60)) parts.push(['ann_title', clean(a.title, 60)], ['ann_body', clean(a.body ?? '', 200)]);
    else parts.push(['ann_title', null], ['ann_body', null]);
  }
  if ('reward' in patch) {
    const w = patch.reward;
    if (w && clean(w.goal, 60) && clean(w.prize, 60) && VENUE_GAMES.includes(w.game)) {
      parts.push(['reward_game', w.game], ['reward_goal', clean(w.goal, 60)], ['reward_prize', clean(w.prize, 60)]);
    } else parts.push(['reward_game', null], ['reward_goal', null], ['reward_prize', null]);
  }
  if (!parts.length) return getVenue(id);
  parts.push(['updated_at', Date.now()]);
  const set = parts.map(([c], i) => `${c} = $${i + 1}`).join(', ');
  await run(`UPDATE venues SET ${set} WHERE id = $${parts.length + 1}`, ...parts.map(([, v]) => v), id);
  return getVenue(id);
}

// ---------- Panel oturumu ----------
// Oturum çerezinde yalnızca mekân id'si + imzası taşınır (sunucusuz ortamda bellek yok). İmza, sır
// olmadan DATABASE_URL'den türetilir (aynı veritabanına bağlanamayan biri imzayı taklit edemez).
const CO = 'oh-panel';

function sign() {
  return createHmac('sha256', process.env.DATABASE_URL ?? 'local').digest('hex').slice(0, 24);
}
const stamp = (id) => `${id}.${sign()}`;

// Oturum çerezinden güncel mekânı döndürür; girişli değilse null. Oturum yoksa panelleri /panel/giris'e atar.
export async function panelVenue() {
  try {
    const raw = (await cookies()).get(CO)?.value ?? '';
    const [id] = raw.split('.');
    if (!/^\d+$/.test(id) || stamp(id) !== raw) return null;
    return await getVenue(Number(id));
  } catch {
    return null;
  }
}

// Panel sayfaları için: mutlaka oturumlu mekân; yoksa giriş ekranına yönlendirilir.
export async function requireVenue() {
  const v = await panelVenue();
  if (!v) redirect('/panel/giris');
  return v;
}

export function cookieFor(id) {
  return { name: CO, value: stamp(String(id)), httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' };
}

// Giriş: e-posta + şifre venues tablosundaki kayıtla karşılaştırılır (scrypt). Başarılıysa mekân id'si.
export async function loginVenue(email, password) {
  const em = String(email ?? '').trim().toLowerCase();
  const r = await get('SELECT id, password FROM venues WHERE lower(email) = ? LIMIT 1', em);
  const pw = String(r?.password ?? '');
  if (!pw) return null;
  const [salt, h] = pw.split(':');
  const ok = !!h && scryptSync(String(password ?? ''), salt, 32, SCRYPT).toString('hex') === h;
  return ok ? r.id : null;
}
