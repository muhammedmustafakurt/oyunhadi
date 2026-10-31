'use client';

import { useState } from 'react';
import { whatsappLink } from '@/lib/site';

// Teklif formu. TASARIM AŞAMASI: gönderim henüz bir yere kaydedilmiyor; backend eklenince /api/teklif'e bağlanacak.
export default function LeadForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card p-10 text-center" role="status">
        <p className="mb-3 text-5xl">🎲</p>
        <h2 className="text-3xl font-black">Teşekkürler!</h2>
        <p className="mt-3 text-muted">Bir iş günü içinde sizi arayacağız. Beklemek istemezseniz WhatsApp&apos;tan yazabilirsiniz.</p>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn mt-6 bg-[#25d366] text-white">WhatsApp&apos;tan yaz</a>
      </div>
    );
  }

  const label = 'mb-1.5 block text-sm font-semibold';
  return (
    <form className="card p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Adınız soyadınız <span className="text-coral">*</span></span>
          <input className="form-input" name="name" required autoComplete="name" placeholder="Ayşe Yılmaz" />
        </label>
        <label className="block">
          <span className={label}>Telefon <span className="text-coral">*</span></span>
          <input className="form-input" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" />
        </label>
        <label className="block">
          <span className={label}>Mekân adı <span className="text-coral">*</span></span>
          <input className="form-input" name="venue" required placeholder="Hadi Kafe" />
        </label>
        <label className="block">
          <span className={label}>Şehir / ilçe</span>
          <input className="form-input" name="city" placeholder="Kadıköy, İstanbul" />
        </label>
        <label className="block">
          <span className={label}>Mekân türü</span>
          <select className="form-select" name="type" defaultValue="Kafe">
            {['Kafe', 'Bar & pub', 'Restoran', 'Otel lobisi', 'Tatlıcı', 'Diğer'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={label}>Masa sayısı</span>
          <input className="form-input" name="tables" type="number" min={1} max={500} inputMode="numeric" placeholder="12" />
        </label>
        <label className="block sm:col-span-2">
          <span className={label}>Notunuz</span>
          <textarea className="form-textarea" name="note" rows={3} placeholder="Canlı gösterim istiyorum, iki şubemiz var…" />
        </label>
        <label className="flex items-start gap-2.5 text-sm text-muted sm:col-span-2">
          <input type="checkbox" className="form-checkbox mt-0.5" required />
          <span><a href="/yasal/kvkk" className="font-semibold text-grape underline">KVKK aydınlatma metnini</a> okudum, iletişim bilgilerimin teklif için kullanılmasını kabul ediyorum.</span>
        </label>
      </div>
      <button className="btn btn-primary mt-6 w-full" type="submit">Bana özel teklif al</button>
    </form>
  );
}
