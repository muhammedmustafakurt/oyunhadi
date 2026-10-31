import { NextResponse } from 'next/server';
import { panelVenue } from '@/lib/venues';
import { panelChat, panelSettings, panelAction } from '@/lib/chat';

export const dynamic = 'force-dynamic';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

// Panel sohbet yönetimi: yalnızca oturumlu işletmenin kendi verisi (panelVenue çerezden çözer).
export async function GET() {
  try {
    const venue = await panelVenue();
    if (!venue) return json({ error: 'Yetkisiz.' }, 401);
    return json(await panelChat(venue.id));
  } catch (e) {
    console.error('[panel chat GET]', e);
    return json({ error: 'Sunucu hatası.' }, 500);
  }
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Geçersiz istek.' }, 400); }
  try {
    const venue = await panelVenue();
    if (!venue) return json({ error: 'Yetkisiz.' }, 401);
    if (body?.type === 'settings') {
      return json(await panelSettings(venue.id, body.patch && typeof body.patch === 'object' ? body.patch : {}));
    }
    const res = await panelAction(venue.id, String(body?.action ?? ''), body?.id);
    return json(res, res.status ?? 200);
  } catch (e) {
    console.error('[panel chat POST]', e);
    return json({ error: 'Sunucu hatası.' }, 500);
  }
}
