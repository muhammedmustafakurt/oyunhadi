import PageContainer from '@/components/panel/page-container';
import ChatSettings from '@/components/panel/chat-settings';
import ChatAction from '@/components/panel/chat-action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireVenue } from '@/lib/venues';
import { panelChat } from '@/lib/chat';

export const metadata = { title: 'Sosyal Sohbet' };
export const dynamic = 'force-dynamic';

type Session = { id: number; tbl: string; nick: string; bio: string; status: string; seen_at: number };
type RoomRow = { id: number; a_tbl: string; a_nick: string; b_tbl: string; b_nick: string; msgs: number; last_at: number };
type Report = { id: number; reason: string; at: number; by_nick: string; by_tbl: string; target_nick: string; target_tbl: string };
type ChatData = {
  settings: { enabled: boolean; open_mode: boolean; retention_hours: number };
  sessions: Session[]; rooms: RoomRow[]; reports: Report[];
};

const ago = (at: number) => {
  const s = Math.max(0, Math.round((Date.now() - at) / 1000));
  if (s < 60) return 'az önce';
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`;
  if (s < 86400) return `${Math.floor(s / 3600)} sa önce`;
  return `${Math.floor(s / 86400)} gün önce`;
};

// Masalar arası sohbetin işletme tarafı: ayarlar, canlı oturumlar, sohbetler ve şikâyetler.
// Özel mesaj içerikleri burada gösterilmez; yalnızca katılımcı ve şikâyet bilgisi görünür.
export default async function PanelChatPage() {
  const v = await requireVenue();
  const { settings, sessions, rooms, reports } = (await panelChat(v.id)) as ChatData;

  return (
    <PageContainer
      title="Sosyal Sohbet"
      description="Müşterileriniz masalar arasında tanışıp sohbet edebilir. Sohbetler yalnızca sizin mekânınızla sınırlıdır."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Canlı masalar</CardTitle>
              <CardDescription>Şu an sohbet oturumu açmış masalar. Bir oturumu kapattığınızda kişi sohbetten düşer.</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-muted-foreground text-sm">Şu an sohbete katılmış masa yok.</p>
              ) : (
                <ul className="divide-y">
                  {sessions.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-medium">
                          {s.nick}
                          <Badge variant="outline">{s.tbl.replace('masa-', 'Masa ')}</Badge>
                          {s.status === 'paused' && <Badge variant="secondary">Sohbet kapalı</Badge>}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Son görülme: {ago(s.seen_at)}{s.bio ? ` · ${s.bio}` : ''}
                        </p>
                      </div>
                      <ChatAction
                        action="kick"
                        id={s.id}
                        label="Oturumu kapat"
                        variant="destructive"
                        confirm={`${s.nick} (${s.tbl.replace('masa-', 'Masa ')}) kişisinin sohbet oturumu kapatılsın mı?`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktif sohbetler</CardTitle>
              <CardDescription>İki masa arasında açılmış özel sohbetler. İçerik görünmez, yalnızca süre ve mesaj sayısı izlenir.</CardDescription>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <p className="text-muted-foreground text-sm">Şu an aktif sohbet yok.</p>
              ) : (
                <ul className="divide-y">
                  {rooms.map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-medium">{r.a_nick} ({r.a_tbl.replace('masa-', 'Masa ')}) ↔ {r.b_nick} ({r.b_tbl.replace('masa-', 'Masa ')})</p>
                        <p className="text-muted-foreground text-xs">{r.msgs} mesaj · son hareket {ago(r.last_at)}</p>
                      </div>
                      <ChatAction action="close_room" id={r.id} label="Sohbeti kapat" confirm="Bu sohbet kapatılsın mı?" />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Şikâyetler</CardTitle>
              <CardDescription>Müşterilerin bildirdiği rahatsız edici davranışlar. İnceleyip gerekirse oturumu kapatın.</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-muted-foreground text-sm">Açık şikâyet yok.</p>
              ) : (
                <ul className="divide-y">
                  {reports.map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium">{r.by_nick} ({r.by_tbl.replace('masa-', 'Masa ')}) → {r.target_nick} ({r.target_tbl.replace('masa-', 'Masa ')})</p>
                        <p className="text-sm">{r.reason}</p>
                        <p className="text-muted-foreground text-xs">{ago(r.at)}</p>
                      </div>
                      <ChatAction action="dismiss_report" id={r.id} label="İncelendi" />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Ayarlar</CardTitle>
              <CardDescription>Özelliği kapatabilir, istek akışını veya açık sohbet modunu yönetebilirsiniz.</CardDescription>
            </CardHeader>
            <ChatSettings settings={settings} />
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Nasıl çalışır?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2 text-sm">
              <p>Müşteri masasındaki karekodu okutup sohbet ekranını açar, takma adla aynı mekânda oturan diğer masaları görür.</p>
              <p>Karşı masa isteği kabul ederse iki masa arasında özel sohbet açılır. İlk sürümde yalnızca metin mesajı gönderilir.</p>
              <p>Özel mesaj içerikleri panelde görünmez. Şikâyet edilen sohbetlerde yalnızca şikâyet nedeni ve taraflar listelenir.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
