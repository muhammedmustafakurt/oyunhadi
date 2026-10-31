import { IconCheck, IconDownload } from '@tabler/icons-react';
import PageContainer from '@/components/panel/page-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION } from '@/lib/demo';

export const metadata = { title: 'Abonelik' };

// Abonelik durumu ve ödemeler. TASARIM AŞAMASI: iyzico bağlantısı yok.
export default function BillingPage() {
  const s = SUBSCRIPTION;
  const used = Math.round(100 - (s.daysLeft / s.totalDays) * 100);
  return (
    <PageContainer title="Abonelik" description="Paketiniz, kalan süreniz ve ödemeleriniz.">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{s.plan}</CardTitle>
            <CardDescription>{s.startedAt} – {s.endsAt}</CardDescription>
            <CardAction><Badge className="bg-emerald-600 text-white">Aktif</Badge></CardAction>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm"><span className="font-medium">{s.daysLeft} gün kaldı</span><span className="text-muted-foreground">%{used} kullanıldı</span></div>
              <div className="bg-muted h-3 overflow-hidden rounded-full"><div className="bg-primary h-full rounded-full" style={{ width: `${used}%` }} /></div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div><dt className="text-muted-foreground text-sm">Tutar</dt><dd className="font-semibold">{s.paid}</dd></div>
              <div><dt className="text-muted-foreground text-sm">Ödeme</dt><dd className="font-semibold">{s.method}</dd></div>
              <div><dt className="text-muted-foreground text-sm">Yenileme</dt><dd className="font-semibold">Elle (otomatik değil)</dd></div>
            </dl>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button>Şimdi yenile</Button>
            <Button variant="outline">Fatura bilgilerini düzenle</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pakete dahil</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {['Tüm oyunlar ve yeni eklenenler', '12 masa karekodu (pleksi)', 'Panel, istatistik ve duyurular', 'Ödül kodları', 'Logo ve renkler', 'Konum kilidi', 'WhatsApp desteği'].map((t) => (
                <li key={t} className="flex items-center gap-2"><IconCheck className="size-4 text-emerald-600" /> {t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Ödemeler</CardTitle><CardDescription>Kart ödemeleri iyzico güvencesiyle alınır.</CardDescription></CardHeader>
        <CardContent className="px-0 sm:px-6">
          <Table>
            <TableHeader><TableRow><TableHead>Tarih</TableHead><TableHead>Açıklama</TableHead><TableHead>Tutar</TableHead><TableHead>Durum</TableHead><TableHead className="text-right">Fatura</TableHead></TableRow></TableHeader>
            <TableBody>
              {s.payments.map((p) => (
                <TableRow key={p.date}>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.desc}</TableCell>
                  <TableCell className="tabular-nums">{p.amount}</TableCell>
                  <TableCell><Badge variant="secondary">{p.status}</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon-sm" aria-label="Faturayı indir"><IconDownload /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
