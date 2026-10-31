import Link from 'next/link';
import { whatsappLink } from '@/lib/site';
import { Dice, Pawn, Star } from './props';

// Sayfa sonu çağrısı: mor bant, konfeti ve uçuşan oyun nesneleri.
export default function Cta({ title = 'Masalarınıza oyun getirelim', lead = 'Formu doldurun, bir iş günü içinde arayalım. İsterseniz oyunları ve paneli canlı gösterelim.' }: { title?: string; lead?: string }) {
  return (
    <section className="band-grape relative overflow-hidden">
      <div className="confetti pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-lines-light pointer-events-none absolute inset-0" aria-hidden="true" />
      <Dice className="top-10 left-[6%] hidden w-24 md:block" />
      <Pawn className="right-[8%] bottom-8 hidden w-16 md:block" delay="-2s" />
      <Star className="top-12 right-[16%] hidden w-14 lg:block" delay="-4s" />
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 md:py-32" data-aos="zoom-y-out">
        <h2 className="text-4xl leading-[1.05] font-black md:text-6xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">{lead}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link className="btn btn-white" href="/teklif">Bana özel teklif al</Link>
          <a className="btn btn-ghost" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp&apos;tan yaz</a>
        </div>
      </div>
    </section>
  );
}
