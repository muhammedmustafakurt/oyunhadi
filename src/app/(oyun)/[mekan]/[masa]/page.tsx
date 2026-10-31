import { redirect } from 'next/navigation';

// Karekod doğrudan masanın oyun listesine açılır.
export default async function TablePage({ params }: PageProps<'/[mekan]/[masa]'>) {
  const { mekan, masa } = await params;
  redirect(`/${mekan}/${masa}/oyunlar`);
}
