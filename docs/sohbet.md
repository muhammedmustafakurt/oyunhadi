# Masalar Arası Sohbet (Cafe Social)

Aynı işletmedeki masaların birbirine sohbet isteği gönderip özel sohbet açmasını sağlar. Mevcut
oyunhadi mimarisine (Next.js App Router + Neon Postgres + oyuncu ekranının 2 sn'lik yoklama deseni)
eklenmiştir; ayrı bir uygulama veya ek servis yoktur.

## Nasıl çalışır

1. Oyuncu masadaki karekodu okutur (`/[mekan]/[masa]/oyunlar`). Sayfanın sağ altında küçük bir
   **sohbet balonu** (canlı destek düğmesi) görünür; okunmamış mesaj varsa üstünde rozet taşır.
   Balon hem oyun destesi sayfasında hem oyun ekranlarında vardır. Yeni istek ve mesajlarda balonun
   sol üstünde bildirim kartı çıkar (telefonda titreşim, sekme başlığında sayı).
2. Balona basınca alt sayfa şeklinde sohbet paneli açılır. İlk açılışta sunucu bir ziyaretçi oturumu
   ve **tahmin edilemez 32 baytlık belirteç** üretir. Belirteç tarayıcıda
   `oh-chat-<mekan>-<masa>` anahtarında saklanır; işletme ve masa bilgisi her istekte bu oturum
   satırından okunur, istemciden gelen kimliklere güvenilmez.
3. Panelde aynı işletmedeki aktif oturumlar listelenir (başka işletmeler görünmez).
4. İstek gönderilir; karşı masa kabul ederse iki oturum arasında özel oda açılır.
5. Mesajlar yalnızca odanın iki katılımcısına döner; okundu bilgisi `chat_messages.seen_at` ile tutulur.
6. Oturum 10 dakika yoklama yapmazsa (sayfa kapandı) düşer; odaları kapanır. İşletme panelinden de
   oturum kapatılabilir (`kicked`).

Gerçek zamanlılık: Vercel sunucusuz ortamında kalıcı WebSocket yoktur ve projede mevcut bir realtime
servis yoktur. Bu nedenle oyun odalarıyla aynı yöntem kullanılır: panel açıkken istemci 2 sn'de bir,
panel kapalıyken (rozet güncel kalsın diye) 12 sn'de bir tek uç noktayı (`GET /api/chat`) yoklar.
Bağlantı kopunca istemci otomatik yeniden dener; arayüz "bağlantı koptu" durumunu gösterir.

## Veri modeli (otomatik migrasyon)

Tablolar `src/lib/db.js` içindeki `SCHEMA` dizisinde tanımlıdır ve uygulama ilk istek aldığında
`ensure()` ile `CREATE TABLE/INDEX IF NOT EXISTS` olarak oluşturulur. Elle SQL çalıştırmak gerekmez.

| Tablo | Amaç |
| --- | --- |
| `chat_settings` | İşletme ayarları: açık/kapalı, açık sohbet modu, saklama süresi (saat) |
| `chat_sessions` | Ziyaretçi oturumu (işletme + masa + cihaz pid + sunucu belirteci + takma ad/profil) |
| `chat_requests` | Sohbet istekleri ve durumları (pending/accepted/rejected/cancelled) |
| `chat_rooms` | İki oturum arasındaki özel oda (a_id < b_id, aktif çift için tek kayıt) |
| `chat_messages` | Mesaj gövdesi, zamanı, okundu zamanı |
| `chat_blocks` | Engel kayıtları (çift başına tek) |
| `chat_reports` | İşletmeye şikâyetler (mesaj içeriği kopyalanmaz) |

İndeksler: oturum/pid tekilliği ve canlı oturum sorgusu, bekleyen istek tekilliği (partial unique),
oda çifti tekilliği (partial unique), mesaj listeleme ve hız limiti sorguları.

Saklama/temizlik: kapalı odaların mesajları ve kapalı odalar `retention_hours` (varsayılan 24 saat)
sonrasında silinir; karar verilmiş istekler de aynı süreyle temizlenir. Temizlik, sohbet uçlarında
ara sıra (`prune`) çalışır; ayrı bir cron gerekmez.

## Güvenlik kararları

- Tüm yetkilendirme sunucudadır; `biz_id` istemciden alınmaz.
- Oda okuma/yazma öncesi katılımcılık kontrol edilir; başka oda kimliği 404 döner.
- Kabul edilmeden mesaj gönderilemez (oda ancak kabulle oluşur).
- Engel iki yönlü uygulanır: istek ve mesaj sunucuda reddedilir.
- Hız limitleri (veritabanı üzerinden, sunucusuz örnekler arasında tutarlı): dakikada 20 mesaj,
  saatte 10 istek, aynı anda 5 bekleyen istek, reddeden masaya 10 dk bekleme, saatte 3 şikâyet.
- Takma ad serbesttir; ad/telefon/sosyal medya istenmez. Mesaj ve profil uzunlukları sınırlıdır.
- İşletme paneli özel mesaj içeriğini görmez; yalnızca oturum/oda/şikâyet metadata'sı görünür.
- KVKK: yalnızca takma ad + isteğe bağlı kısa profil toplanır, saklama süresi yapılandırılabilir,
  süre dolunca içerik silinir.

## Uç noktalar

- `POST /api/chat` — `{type:'join', cafe, masa, pid, nick?, bio?}` oturum açar; diğer tipler:
  `request, accept, reject, cancel, send, close, block, unblock, report, profile, open, pause, leave`.
- `GET /api/chat?token&room&after` — durum (masalar, istekler, odalar, okunmamışlar) ve oda mesajları.
- `GET/POST /api/panel/chat` — panel verisi ve işlemleri (`settings`, `kick`, `close_room`,
  `dismiss_report`). Panel çereziyle korunur.

## Panel

`/panel/sohbet`: özelliği açıp kapatma, açık sohbet modu, saklama süresi; canlı oturumlar (oturum
kapatma), aktif sohbetler (sohbet kapatma) ve şikâyetler (incelendi).

## Test

```bash
# 1) Yerelde üretim sunucusu (DATABASE_URL .env'den okunur)
npm run build
npx next start -p 3002

# 2) Başka terminalde
npm run test:chat
```

`scripts/chat-test.mjs` gerçek API + gerçek veritabanıyla çalışır; sonunda oluşturduğu test verisini
siler. Kapsam: aynı mekânda istek/kabul/mesaj, okundu bilgisi, `after` ile geçmiş yükleme, işletme
yalıtımı, katılımcı olmayan erişimi, kabul öncesi mesaj engeli, yinelenen istek, red cooldown'u,
engelleme, hız limitleri, oturum sonlandırma/panel kapatma, sohbetin kapatılması ve panel yetkisi.

## İlk sürümde olmayanlar

- Görsel/dosya/sesli mesaj, görüntülü görüşme (bilinçli olarak yok).
- Push bildirimi; yalnızca sekme başlığındaki okunmamış sayacı ve uygulama içi rozetler var.
- İşletme panelinde mesaj içeriği görüntüleme (şeffaflık gereği varsayılan kapalı).
- Bildirim sesi/titreşimi.
