import PageContainer from '@/components/panel/page-container';
import AnnouncementForm from '@/components/panel/announcement-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CURRENT_VENUE } from '@/lib/demo';

export const metadata = { title: 'Duyurular' };

const PAST = [
  { title: 'Happy hour 16:00–18:00', body: 'Tüm sıcak içeceklerde %20 indirim.', when: '1–15 Ekim', state: 'Bitti' },
  { title: 'Yeni: San Sebastian', body: 'Haftanın tatlısı vitrinde.', when: '20–27 Eylül', state: 'Bitti' },
];

export default function AnnouncementsPage() {
  const a = CURRENT_VENUE.announcement;
  return (
    <PageContainer title="Duyurular" description="Duyurunuz masalardaki oyun listesinin en üstünde görünür.">
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {a && (
            <Card>
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
                <CardDescription>{a.body}</CardDescription>
                <CardAction><Badge className="bg-emerald-600 text-white">Yayında</Badge></CardAction>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">31 Ekim – 1 Kasım · 12 masada gösteriliyor</CardContent>
            </Card>
          )}
          {PAST.map((p) => (
            <Card key={p.title} className="opacity-70">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.body}</CardDescription>
                <CardAction><Badge variant="outline">{p.state}</Badge></CardAction>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">{p.when}</CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-fit">
          <CardHeader><CardTitle>Yeni duyuru</CardTitle></CardHeader>
          <CardContent><AnnouncementForm /></CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
