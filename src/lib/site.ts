// Tanıtım sitesinin metinleri ve ayarları. Fiyat ve iletişim bilgileri tek yerden değişsin diye burada.

export const BRAND = 'oyunhadi';
export const SITE_URL = (process.env.SITE_URL || 'https://oyunhadi.com').replace(/\/+$/, '');

// TASLAK: Fiyat henüz kesinleşmedi; yayından önce güncellenecek.
export const PRICE = {
  yearly: '₺19.900',
  note: '+ KDV / yıl',
  monthly: 'ayda ₺1.990 karşılığı (KDV dahil)',
  perks: ['Peşin ödemede 2 ay hediye', 'Peşin fiyatına 3 taksit', 'Kurulum ücreti yok'],
};

export const whatsappLink = (text = 'Merhaba, oyunhadi hakkında bilgi almak istiyorum.') => {
  const n = (process.env.NEXT_PUBLIC_WHATSAPP || '905000000000').replace(/\D/g, '');
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
};

export const NAV = [
  { href: '/ozellikler', label: 'Özellikler' },
  { href: '/nasil-calisir', label: 'Nasıl Çalışır' },
  { href: '/oyunlar', label: 'Oyunlar' },
  { href: '/fiyat', label: 'Fiyat' },
  { href: '/sss', label: 'SSS' },
  { href: '/blog', label: 'Blog' },
];

export const VENUE_TYPES = ['Kafe', 'Bar & pub', 'Restoran', 'Otel lobisi', 'Tatlıcı', 'Kampüs kafesi', 'Nargile salonu', 'Bowling & eğlence'];

export type Feature = { icon: string; title: string; body: string; tag?: string };

export const FEATURES: Feature[] = [
  { icon: 'group', title: 'Masada birlikte oyun', body: 'Aynı masadaki herkes kendi telefonundan katılır. Tabu, Casus, Vampir Köylü gibi oyunlar birbirine karşı ya da takım halinde oynanır.' },
  { icon: 'qr', title: 'Uygulama yok, karekod var', body: 'Misafir masadaki karekodu kamerasıyla okutur, oyunlar tarayıcıda açılır. İndirme, üyelik, şifre yok.' },
  { icon: 'palette', title: 'Mekânınızın renginde', body: 'Logonuz ve renkleriniz oyun ekranının her yerinde. Misafir oyunu sizin markanızla hatırlar.' },
  { icon: 'gift', title: 'Ödül ve ikram kodları', body: 'Hedefi tutturan masaya tek kullanımlık kod çıkar. Garson panelden okutur, ikramı siz belirlersiniz.' },
  { icon: 'chart', title: 'Kullanım istatistikleri', body: 'Hangi masa ne zaman, hangi oyunu kaç kişiyle oynadı? Haftalık ve aylık raporlar panelde.' },
  { icon: 'megaphone', title: 'Duyuru panosu', body: 'Turnuva akşamı, yeni tatlı, happy hour… Duyurunuz oyun listesinin en üstünde görünür.' },
  { icon: 'pin', title: 'Konum kilidi', body: 'Masaya yalnızca mekânınızdaki telefonlar katılabilir. Karekodun fotoğrafını çekip evden oynamak işe yaramaz.' },
  { icon: 'toggle', title: 'Oyunları siz seçin', body: 'Mekânınıza uymayan oyunu tek dokunuşla kapatın. Liste her masada anında güncellenir.' },
  { icon: 'nfc', title: 'NFC etikete hazır', body: 'Karekodun yanına NFC etiket de ekleyebilirsiniz; telefonu masaya yaklaştırmak yeter.', tag: 'Yakında' },
];

export const STEPS = [
  { no: '01', title: 'Karekodlar masalarınıza gelir', body: 'Masa sayınıza göre hazırlanan karekodlu pleksiler kargoyla gelir. Masaya koymanız yeterli; kurulum, cihaz, kablo yok.' },
  { no: '02', title: 'Misafir okutur, oyun başlar', body: 'Misafir karekodu okutur, mekânınızın renginde açılan listeden oyunu seçer. Masadaki arkadaşları kendi telefonlarından katılır.' },
  { no: '03', title: 'Siz panelden izlersiniz', body: 'Hangi oyunların sevildiğini, yoğun saatleri ve verilen ödülleri panelden görürsünüz. Oyunları ve duyuruları oradan yönetirsiniz.' },
];

export const BENEFITS = [
  { stat: '₺0', title: 'Kurulum ücreti', body: 'Pleksiler, panel ve bakım abonelikte dahil.' },
  { stat: '9', title: 'Grup oyunu', body: 'Her ay yeni oyunlar ekleniyor.' },
  { stat: '10 sn', title: 'Okut, oyna', body: 'Uygulama indirmeden, üye olmadan.' },
];

export type Faq = { q: string; a: string; cat: string };

export const FAQ: Faq[] = [
  { cat: 'Genel', q: 'oyunhadi nedir?', a: 'Kafe, bar, restoran ve otel lobileri için karekodla açılan masa oyunları hizmetidir. Misafir masadaki karekodu okutur, uygulama indirmeden telefonunda oyun oynar. Oyunların çoğu aynı masadaki arkadaşlarla birlikte oynanır.' },
  { cat: 'Genel', q: 'Misafirin uygulama indirmesi gerekir mi?', a: 'Hayır. Oyunlar telefonun tarayıcısında açılır. Güncel tarayıcısı olan her akıllı telefon yeterlidir; mekânın Wi-Fi\'ı ya da misafirin mobil verisi işini görür.' },
  { cat: 'Genel', q: 'Küçük bir mekân için uygun mu?', a: 'Evet. Birkaç masalı bir kafeden yüz masalı bir restorana kadar her ölçekte çalışır. Paket servis ağırlıklı, misafirin oturmadığı mekânlar için uygun değildir.' },
  { cat: 'Oyunlar', q: 'Hangi oyunlar var?', a: 'Emlak Krallığı, Satranç, Casus, Gizli Ajanlar, Vampir Köylü, Tabu, Ben Kimim?, Çiz Bakalım ve Bil Bakalım. Yeni oyunlar aboneliğinize ek ücret olmadan eklenir.' },
  { cat: 'Oyunlar', q: 'Kaç kişi birlikte oynayabilir?', a: 'Oyuna göre değişir: Satranç 2 kişiyle, Vampir Köylü 10 kişiye kadar oynanır. Masadaki herkes kendi telefonundan katılır.' },
  { cat: 'Oyunlar', q: 'Biri karekodun fotoğrafını çekip evden oynayabilir mi?', a: 'Konum kilidini açarsanız hayır. Masaya yalnızca mekânınızın yakınındaki telefonlar katılabilir; mekândan uzaklaşan oyuncu masadan düşer.' },
  { cat: 'Panel', q: 'Panelde neleri görebilirim?', a: 'Haftalık ve aylık oynanan oyun sayısı, oynayan kişi sayısı, en sevilen oyunlar, yoğun saatler, masaların durumu, verilen ve kullanılan ödül kodları.' },
  { cat: 'Panel', q: 'Logo ve renklerimi kullanabilir miyim?', a: 'Evet. Panelden logonuzu yükleyip iki renk seçersiniz; oyun ekranı anında sizin renklerinize bürünür.' },
  { cat: 'Ödüller', q: 'Ödül kodları nasıl çalışır?', a: 'Belirlediğiniz hedefi tutturan masaya tek kullanımlık bir kod çıkar. Garson kodu panelden doğrular. Kod birkaç saat geçerlidir ve ikinci kez kullanılamaz. Ödülü ve maliyetini siz belirlersiniz.' },
  { cat: 'Kurulum', q: 'Karekodlar nasıl teslim ediliyor?', a: 'Kaydınız onaylanınca masa sayınıza göre karekodlu pleksiler hazırlanıp kargolanır. Masa sayınız değişirse panelden yenilerini isteyebilir ya da karekodları kendiniz yazdırabilirsiniz.' },
  { cat: 'Kurulum', q: 'Almadan önce deneyebilir miyim?', a: 'Evet. Canlı gösterim isteyin, ekip arkadaşımız oyunları ve paneli birlikte gezsin. Ayrıca bu sitedeki demo masada oyunları hemen deneyebilirsiniz.' },
  { cat: 'Ödeme', q: 'Fiyat ne kadar?', a: 'Tek paket var, tüm oyunlar ve özellikler dahil. Güncel fiyatı Fiyat sayfasında görebilirsiniz. Peşin ödemede 2 ay hediye, istenirse peşin fiyatına 3 taksit.' },
  { cat: 'Ödeme', q: 'Ödemeyi nasıl yapıyorum?', a: 'Kredi kartıyla iyzico güvencesiyle ya da havale/EFT ile ödeyebilirsiniz. Faturanız e-posta ile gönderilir.' },
  { cat: 'Ödeme', q: 'Yıl dolmadan ayrılırsam ne olur?', a: 'Abonelik yıllıktır ve kendiliğinden yenilenmez. Mekânınız kapanırsa ya da hizmet bizden kaynaklı kesilirse kalan süre iade edilir.' },
];

// Oyun sayfaları için uzun anlatımlar (SEO ve "Nasıl oynanır?" bölümü).
export const GAME_INFO: Record<string, { intro: string; how: string[]; good: string }> = {
  monopoly: {
    intro: 'Emlak Krallığı, zar atıp şehir şehir mülk topladığınız, rakiplerinizden kira aldığınız klasik bir emlak oyunu. Her oyuncu kendi telefonundan zar atar, tahta herkesin ekranında aynı anda güncellenir.',
    how: ['2–4 oyuncu masaya katılır, sırayla zar atar.', 'Sahipsiz bir mülke gelen oyuncu satın alabilir ya da pas geçebilir.', 'Başkasının mülküne gelen kira öder; parası yetmeyen iflas eder.', 'Son kalan oyuncu krallığın sahibidir.'],
    good: 'Uzun oturulan akşamlar ve rekabeti seven masalar',
  },
  satranc: {
    intro: 'İki kişilik klasik satranç: rok, geçerken alma, şah-mat ve pat kuralları tam. Her oyuncu kendi telefonundan hamle yapar, rövanşta renkler değişir.',
    how: ['İki oyuncu masaya katılır; ilk katılan Beyaz oynar.', 'Taşa dokunun, gidebileceği kareler işaretlenir.', 'Şah-mat ya da pat ile oyun biter; tek dokunuşla rövanş.'],
    good: 'Sakin bir kahve eşliğinde iki kişilik düello',
  },
  spyfall: {
    intro: 'Casus\'ta herkes aynı gizli mekândadır; biri hariç. Casus mekânı bilmez ve belli etmemeye çalışır. Sorular sorun, cevapları dinleyin, casusu bulun.',
    how: ['3–8 oyuncu katılır; herkesin telefonuna mekân ve rolü, casusa ise yalnızca "Casussun" yazar.', 'Sırayla birbirinize mekânla ilgili sorular sorun.', 'Şüphelendiğiniz kişiyi suçlayın; masa oylar.', 'Casus mekânı tahmin ederse ya da süre biterse casus kazanır.'],
    good: 'Kahkaha ve şüphe dolu kısa turlar',
  },
  ajanlar: {
    intro: 'Gizli Ajanlar, iki takımın 25 kelimelik tahtada kendi ajanlarını bulmaya çalıştığı bir kelime ve ipucu oyunu. Yalnızca ajan şefleri hangi kelimenin kime ait olduğunu bilir.',
    how: ['4–8 oyuncu iki takıma ayrılır, her takımın bir ajan şefi olur.', 'Şef tek kelimelik bir ipucu ve bir sayı verir.', 'Takım ipucuna uyan kelimeleri seçer; yanlış kelime turu bitirir.', 'Suikastçıya dokunan takım anında kaybeder.'],
    good: 'Takım ruhu yüksek kalabalık masalar',
  },
  vampir: {
    intro: 'Vampir Köylü, gizli rollü bir gece-gündüz oyunu. Geceleri vampirler avlanır, doktor korur, kâhin araştırır; gündüz köy birini oylayıp eler.',
    how: ['5–10 oyuncu katılır; roller gizlice dağıtılır.', 'Gece: vampirler kurban seçer, doktor birini korur, kâhin birine bakar.', 'Gündüz: herkes tartışır ve birini oylayarak köyden çıkarır.', 'Vampirler biterse köy, vampirler köylülere eşitlenirse vampirler kazanır.'],
    good: 'Kalabalık arkadaş grupları ve uzun sohbetler',
  },
  tabu: {
    intro: 'Tabu\'da anlatıcı ekrandaki kelimeyi yasaklı kelimeleri kullanmadan anlatır, takım arkadaşları tahmin eder. Rakip takım kartı görür ve hakemlik yapar.',
    how: ['4–10 oyuncu iki takıma ayrılır.', 'Sırası gelen anlatıcı süre bitene kadar kelimeleri anlatır.', 'Doğru +1, yasaklı kelime −1; her turda 3 pas hakkı.', 'En çok puanı toplayan takım kazanır.'],
    good: 'Gürültülü, eğlenceli takım maçları',
  },
  kimim: {
    intro: 'Ben Kimim?\'de herkesin "alnında" gizli bir kart vardır: kendi kartınızı göremezsiniz ama başkalarınınkini görürsünüz. Evet-hayır sorularıyla kim olduğunuzu bulun.',
    how: ['3–10 oyuncu katılır; her telefonda diğerlerinin kartları görünür.', 'Sırası gelen masaya evet-hayır soruları sorar.', 'Bildiğinizi düşününce tahmin edin; masa "doğru" ya da "yanlış" der.', 'Kartını ilk bulan kazanır.'],
    good: 'Her yaştan kalabalık masalar',
  },
  cizim: {
    intro: 'Çiz Bakalım\'da sırası gelen oyuncu gizli kelimeyi parmağıyla çizer, diğerleri yazarak tahmin eder. Çizim herkesin ekranına canlı yansır.',
    how: ['3–10 oyuncu katılır; çizen kişi gizli kelimeyi görür.', 'Süre bitene kadar çizer; diğerleri tahminlerini yazar.', 'Erken bilen daha çok puan alır, çizen de puan kazanır.', 'Herkes çizdikten sonra en yüksek puan kazanır.'],
    good: 'Yaratıcı ve kahkahalı turlar',
  },
  bil: {
    intro: 'Bil Bakalım, herkesin aynı soruyu aynı anda kendi telefonundan cevapladığı hızlı bir bilgi yarışması. Hızlı ve doğru cevap, üst üste bilme serisi daha çok puan getirir.',
    how: ['2–10 oyuncu katılır, 10 soru gelir.', 'Her soruda 15 saniye; doğru cevap süre bitince açılır.', 'Hız ve seri bonuslarıyla puan toplanır.', 'Sonunda podyum: birinci kim?'],
    good: 'Sipariş beklerken 5 dakikalık yarış',
  },
};
