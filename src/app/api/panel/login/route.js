import { NextResponse } from 'next/server';
import { loginVenue, cookieFor } from '@/lib/venues';

export const dynamic = 'force-dynamic';

// Panel girişi: e-posta + şifre DB'deki mekân kaydıyla karşılaştırılır; başarılıysa imzalı çerez yazılır.
export async function POST(req) {
  const body = await req.json().catch(() => null);
  const id = body && await loginVenue(body.email, body.password);
  if (!id) {
    return NextResponse.json({ error: 'E-posta ya da şifre hatalı.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(cookieFor(id));
  return res;
}
