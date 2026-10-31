// Panel istatistikleri play_logs (oyun başlangıç kayıtları) ve game_rooms (odaların canlı durumu)
// üzerinden hesaplanır. Veri yoksa boş/0 döner; hiçbir yerde sahte sayı üretilmez.
import { all } from './db';
import { IDLE_MS } from './rooms';

const DAY = 86_400_000;
const TBL = 'masa-';
const GN = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MN = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

// Oyuncu tarafındaki künyede haftanın ilk günü Pazartesi kabul edilir.
const dow = (ms) => (new Date(ms).getUTCDay() + 6) % 7;
const dayStart = (ms) => { const d = new Date(ms); d.setUTCHours(0, 0, 0, 0); return d.getTime(); };

// son N gün: her gün için oyun ve oyuncu sayısı (oyun başına başlangıçtaki oyuncu sayısı toplanır).
export async function weekDocs(biz, days = 7) {
  const from = dayStart(Date.now()) - (days - 1) * DAY;
  const rows = await all('SELECT at, players FROM play_logs WHERE biz_id = ? AND at >= ?', biz, from);
  const out = Array.from({ length: days }, (_, i) => {
    const t = from + i * DAY;
    return { ms: t, day: GN[dow(t)], oyun: 0, oyuncu: 0 };
  });
  for (const r of rows) {
    const d = out[Math.floor((dayStart(Number(r.at)) - from) / DAY)];
    if (d) { d.oyun++; d.oyuncu += Number(r.players) || 0; }
  }
  return out;
}

// Son N günün saat yoğunluğu (2 saatlik dilimler: 10–12, 12–14, … 22–00).
export async function hoursDocs(biz, days = 7) {
  const from = dayStart(Date.now()) - (days - 1) * DAY;
  const rows = await all('SELECT at FROM play_logs WHERE biz_id = ? AND at >= ?', biz, from);
  const out = Array.from({ length: 7 }, (_, i) => ({ saat: String(12 + i * 2), oyun: 0 }));
  for (const r of rows) {
    const h = new Date(Number(r.at)).getUTCHours();
    const i = Math.min(6, Math.floor((h - 10 + 24) % 24 / 2));
    if (i >= 0) out[i].oyun++;
  }
  return out;
}

// Oyun dağılımı: son N günde hangi oyun kaç kez başladı.
export async function gameDocs(biz, days = 7) {
  const from = dayStart(Date.now()) - (days - 1) * DAY;
  const rows = await all('SELECT game, count(*)::int AS n FROM play_logs WHERE biz_id = ? AND at >= ? GROUP BY game ORDER BY n DESC', biz, from);
  return rows.map((r) => ({ game: r.game, oyun: Number(r.n) }));
}

// Son N ayın aylık toplamı (bu ay dahil).
export async function monthDocs(biz, months = 6) {
  const now = new Date();
  const from = dayStart(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));
  const rows = await all('SELECT at FROM play_logs WHERE biz_id = ? AND at >= ?', biz, from);
  const start = new Date(from);
  const out = Array.from({ length: months }, (_, i) => {
    const d = new Date(start.getUTCFullYear(), start.getUTCMonth() + i, 1);
    return { y: d.getFullYear(), m: d.getMonth(), ay: MN[d.getMonth()], oyun: 0 };
  });
  for (const r of rows) {
    const d = new Date(Number(r.at));
    const o = out.find((x) => x.y === d.getFullYear() && x.m === d.getMonth());
    if (o) o.oyun++;
  }
  return out;
}

// Bugünkü oyunlar: masa bazında sayı.
export async function todayByTable(biz) {
  const rows = await all('SELECT masa, count(*)::int AS n FROM play_logs WHERE biz_id = ? AND at >= ? GROUP BY masa', biz, todayStart());
  return new Map(rows.map((r) => [String(r.masa), Number(r.n)]));
}

const label = (masa) => `Masa ${String(masa).replace(TBL, '')}`;
const todayStart = () => dayStart(Date.now());

// Oda satırlarını canlı durumla birleştirir: hangi masa oynanıyor (oyun + kişi), boş mu.
// game_rooms.state JSON'dan okunur; IDLE_MS süredir yoklamayan oyuncu "masada" sayılmaz.
const nowSeen = (s) => s.phase === 'play' && s.seats.some((x) => !x.left && Date.now() - Number(x.seen ?? 0) < IDLE_MS);

export async function tableRows(biz, tables) {
  const [rooms, today] = await Promise.all([
    all('SELECT tbl, game, state FROM game_rooms WHERE biz_id = ?', biz),
    todayByTable(biz),
  ]);
  const live = new Map();
  for (const r of rooms) {
    if (!String(r.tbl).startsWith(TBL)) continue;
    let s;
    try { s = JSON.parse(r.state); } catch { continue; }
    if (nowSeen(s)) {
      const no = Number(String(r.tbl).replace(TBL, ''));
      const players = s.seats.filter((x) => !x.left).length;
      // Aynı masada birden fazla oyun açık olabilir; oyuncu sayısı en yüksek olan gösterilir.
      const cur = live.get(no);
      if (!cur || players > cur.players) live.set(no, { game: r.game, players });
    }
  }
  return Array.from({ length: tables }, (_, i) => {
    const no = i + 1;
    return {
      no, label: label(`${TBL}${no}`),
      status: live.has(no) ? 'oynaniyor' : 'bos',
      game: live.get(no)?.game ?? null,
      players: live.get(no)?.players ?? 0,
      today: today.get(`${TBL}${no}`) ?? 0,
    };
  });
}
