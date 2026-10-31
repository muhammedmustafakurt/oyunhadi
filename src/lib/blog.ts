// Blog yazıları. Şimdilik örnek yazılar; ileride MDX dosyalarına taşınabilir.

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readMin: number;
  tag: string;
  body: { h?: string; p: string }[];
};

export const POSTS: Post[] = [
  {
    slug: 'kafede-bos-saatleri-doldurmanin-7-yolu',
    title: 'Kafede boş saatleri doldurmanın 7 yolu',
    description: 'Hafta içi öğleden sonraları masalar boş mu kalıyor? Misafiri içeri çeken, uzun oturtan ve geri getiren pratik fikirler.',
    date: '2026-10-20',
    readMin: 5,
    tag: 'İşletme',
    body: [
      { p: 'Çoğu kafe için en zor saatler hafta içi 14:00 ile 18:00 arası. Mutfak hazır, personel işte ama masalar yarı boş. Bu yazıda, büyük bütçe gerektirmeyen ve hemen uygulanabilen yedi fikri topladık.' },
      { h: '1. Masaya bir sebep koyun', p: 'Misafir yalnızca kahve için değil, birlikte vakit geçirmek için gelir. Masadaki karekodla açılan grup oyunları, arkadaş gruplarına "bir el daha" dedirtir.' },
      { h: '2. Saatlik küçük etkinlikler', p: 'Çarşamba 16:00 Tabu turnuvası, cuma bilgi yarışması… Duyurunuzu oyun ekranının en üstüne koyun; masada oturan herkes görsün.' },
      { h: '3. Ödülü küçük, etkisi büyük tutun', p: 'Kazanan masaya bir çay ya da tatlı ikramı, maliyeti düşük ama akılda kalan bir jesttir. Tek kullanımlık kodlarla kötüye kullanımın önüne geçin.' },
      { h: '4. Öğrencileri ve uzaktan çalışanları düşünün', p: 'Uzun oturan misafir için priz, iyi Wi-Fi ve mola anında oynanacak kısa oyunlar, mekânınızı ikinci ofis yapar.' },
    ],
  },
  {
    slug: 'karekod-masa-oyunlari-nasil-calisir',
    title: 'Karekodla masa oyunu nasıl çalışır?',
    description: 'Misafir karekodu okutunca ne oluyor? Uygulama indirmeden, aynı masadaki herkesin kendi telefonundan oynadığı oyunların arka planı.',
    date: '2026-10-08',
    readMin: 4,
    tag: 'Rehber',
    body: [
      { p: 'Karekodla oyun, misafirin telefon kamerasını masadaki koda tutmasıyla başlar. Açılan sayfa mekânın logosu ve renkleriyle karşılar; uygulama indirmek ya da üye olmak gerekmez.' },
      { h: 'Aynı masa, ayrı telefonlar', p: 'Bir oyuncu oyunu seçer, masadaki arkadaşları kendi telefonlarından aynı karekodu okutup katılır. Oyun durumu sunucuda tutulur; herkesin ekranı aynı anda güncellenir.' },
      { h: 'Gizli kartlar gerçekten gizli', p: 'Casus ya da Vampir Köylü gibi oyunlarda her telefona yalnızca o oyuncunun görmesi gereken bilgi gider. Kimse başkasının ekranına bakarak hile yapamaz.' },
      { h: 'Evden oynanamaz', p: 'Mekân konum kilidini açtıysa masaya yalnızca mekândaki telefonlar katılabilir. Karekodun fotoğrafını çekip evde oynamak işe yaramaz.' },
    ],
  },
  {
    slug: 'arkadas-grubuyla-oynanacak-en-iyi-masa-oyunlari',
    title: 'Arkadaş grubuyla oynanacak en iyi 5 masa oyunu',
    description: 'Kalabalık masalar için klasikler: Tabu\'dan Vampir Köylü\'ye, telefondan oynanabilen en eğlenceli grup oyunları.',
    date: '2026-09-25',
    readMin: 6,
    tag: 'Oyunlar',
    body: [
      { p: 'Kalabalık bir masada herkesi aynı anda oyuna katmak zordur. Bu listedeki oyunlar 4 ila 10 kişiyle oynanır ve kuralları birkaç dakikada öğrenilir.' },
      { h: 'Tabu', p: 'İki takım, yasaklı kelimeler ve bitmeyen kahkaha. Rakip takım hakemlik yaptığı için kimse kural dışına çıkamaz.' },
      { h: 'Vampir Köylü', p: 'Gece vampirler avlanır, gündüz köy oylar. 5–10 kişilik gruplar için gerilim ve blöf dolu bir klasik.' },
      { h: 'Casus', p: 'Herkes aynı mekânda, biri hariç. Kısa turlar ve keskin sorular; sipariş beklerken birebir.' },
      { h: 'Çiz Bakalım', p: 'Parmağınızla çizin, arkadaşlarınız tahmin etsin. Çizim yeteneği gerekmez, hatta yokluğu daha eğlenceli.' },
      { h: 'Bil Bakalım', p: 'Herkes aynı soruyu aynı anda cevaplar. Hızlı olan kazanır; 5 dakikada biter.' },
    ],
  },
];

export const findPost = (slug: string) => POSTS.find((p) => p.slug === slug) ?? null;

export const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
