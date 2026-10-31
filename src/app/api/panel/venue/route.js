import { NextResponse } from 'next/server';
import { panelVenue, updateVenue } from '@/lib/venues';

export const dynamic = 'force-dynamic';

// Uygulamalı panel kaydetmesi: marka, oyun listesi, konum, duyuru, ödül ve masa sayısı.
// Oturumu olmayan istekler reddedilir.
export async function POST(req) {
  try {
    const v = await panelVenue();
    if (!v) return NextResponse.json({ error: 'Oturum yok.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    const patch = await req.json().catch(() => null);
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
      return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    const venue = await updateVenue(v.id, patch);
    return NextResponse.json({ venue }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[panel venue]', e);
    return NextResponse.json({ error: 'Kaydedilemedi.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
