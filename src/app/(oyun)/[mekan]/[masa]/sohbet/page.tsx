import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChatHub from '@/components/sohbet/ChatHub';
import { findCafe, hasTable } from '@/lib/rooms';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/[mekan]/[masa]/sohbet'>): Promise<Metadata> {
  const { mekan } = await params;
  const v = await findCafe(mekan);
  return { title: `${v ? v.name : 'Sohbet'} · Masalar arası sohbet` };
}

// Masalar arası sohbet: aynı mekândaki masalarla istek gönderip özel sohbet açılır.
export default async function ChatPage({ params }: PageProps<'/[mekan]/[masa]/sohbet'>) {
  const { mekan, masa } = await params;
  const v = await findCafe(mekan);
  if (!v || !hasTable(v, masa)) notFound();
  return <ChatHub cafe={mekan} masa={masa} no={masa.replace('masa-', '')} />;
}
