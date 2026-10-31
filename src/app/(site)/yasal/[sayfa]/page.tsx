import { notFound } from 'next/navigation';

// Yasal metinler. TASLAK: içerikler hukuk danışmanıyla yazılıp buraya eklenecek.
const PAGES: Record<string, string> = {
  kvkk: 'KVKK Aydınlatma Metni',
  gizlilik: 'Gizlilik ve Çerez Politikası',
  'mesafeli-satis': 'Mesafeli Satış Sözleşmesi',
  iade: 'Teslimat ve İade Koşulları',
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((sayfa) => ({ sayfa }));
}

export async function generateMetadata({ params }: PageProps<'/yasal/[sayfa]'>) {
  const { sayfa } = await params;
  return { title: PAGES[sayfa] ?? 'Yasal', robots: { index: false } };
}

export default async function LegalPage({ params }: PageProps<'/yasal/[sayfa]'>) {
  const { sayfa } = await params;
  const title = PAGES[sayfa];
  if (!title) notFound();
  return (
    <section className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 md:pt-40">
      <h1 className="text-4xl font-black md:text-5xl">{title}</h1>
      <p className="mt-8 rounded-2xl bg-sun/40 p-5 font-medium">Bu metin hazırlanıyor. Yayına almadan önce hukuki içerik eklenecek.</p>
    </section>
  );
}
