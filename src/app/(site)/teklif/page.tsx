import LeadForm from '@/components/site/lead-form';
import Icon from '@/components/site/icon';
import { Dice } from '@/components/site/props';
import { whatsappLink } from '@/lib/site';

export const metadata = {
  title: 'Teklif Al',
  description: 'Mekânınız için oyunhadi teklifi alın ya da canlı gösterim isteyin. Bir iş günü içinde sizi arıyoruz.',
  alternates: { canonical: '/teklif' },
};

export default function LeadPage() {
  return (
    <section className="hero-light relative overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <Dice className="bottom-16 left-[3%] hidden w-24 xl:block" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-32 pb-20 sm:px-6 md:pt-40 md:pb-28 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-4xl leading-[1.02] font-black md:text-6xl">Mekânınıza <span className="hl-coral">özel teklif</span></h1>
          <p className="mt-6 text-lg text-muted">Formu doldurun, bir iş günü içinde arayalım. İsterseniz oyunları ve paneli ekran paylaşımıyla birlikte gezelim.</p>
          <ul className="mt-8 space-y-5">
            {[
              ['Canlı gösterim', 'Oyunları, ödül kodlarını ve paneli 15 dakikada gösterelim.'],
              ['Masa sayınıza göre pleksi', 'Kaç masanız varsa o kadar karekod hazırlanır.'],
              ['Çok şubeli mekânlar', 'Şube sayısına göre ayrı fiyatlandırma.'],
            ].map(([h, p]) => (
              <li key={h} className="flex gap-3">
                <span className="mt-1"><Icon name="check" className="fill-leaf" /></span>
                <div><p className="font-bold">{h}</p><p className="text-muted">{p}</p></div>
              </li>
            ))}
          </ul>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex font-bold text-leaf hover:underline">
            Formla uğraşmak istemiyor musunuz? WhatsApp&apos;tan yazın →
          </a>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
