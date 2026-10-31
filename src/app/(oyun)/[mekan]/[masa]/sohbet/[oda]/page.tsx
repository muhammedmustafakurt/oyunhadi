import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChatRoom from '@/components/sohbet/ChatRoom';
import { findCafe, hasTable } from '@/lib/rooms';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/[mekan]/[masa]/sohbet/[oda]'>): Promise<Metadata> {
  const { mekan } = await params;
  const v = await findCafe(mekan);
  return { title: `${v ? v.name : 'Sohbet'} · Sohbet` };
}

// İki masa arasındaki özel sohbet odası. Oda kimliği sunucuda katılımcıya göre doğrulanır.
export default async function ChatRoomPage({ params }: PageProps<'/[mekan]/[masa]/sohbet/[oda]'>) {
  const { mekan, masa, oda } = await params;
  const v = await findCafe(mekan);
  if (!v || !hasTable(v, masa) || !/^\d{1,9}$/.test(oda)) notFound();
  return <ChatRoom cafe={mekan} masa={masa} oda={oda} no={masa.replace('masa-', '')} />;
}
