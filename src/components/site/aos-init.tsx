'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Kaydırınca beliren animasyonlar (ilk ekrandaki öğelerde kullanılmaz).
export default function AosInit() {
  useEffect(() => {
    AOS.init({ once: true, disable: 'phone', duration: 700, easing: 'ease-out-cubic' });
    // Yazı tipleri ve görseller yüklenince düzen kayar; konumları yeniden hesapla.
    const refresh = () => AOS.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);
  return null;
}
