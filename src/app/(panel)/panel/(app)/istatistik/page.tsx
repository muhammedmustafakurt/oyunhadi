import PageContainer from '@/components/panel/page-container';
import StatCard from '@/components/panel/stat-card';
import { GameBarChart, SimpleBarChart, WeekChart } from '@/components/panel/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BY_GAME, HOURS, MONTHS, TABLES, WEEK } from '@/lib/demo';
import { gameColor, gameName } from '@/lib/game-meta';

export const metadata = { title: 'İstatistikler' };

export default function StatsPage() {
  const top = [...TABLES].sort((a, b) => b.today - a.today).slice(0, 5);
  return (
    <PageContainer title="İstatistikler" description="Misafirleriniz ne zaman, hangi oyunu, kaç kişiyle oynuyor?">
      <Tabs defaultValue="hafta" className="gap-4">
        <TabsList>
          <TabsTrigger value="hafta">Bu hafta</TabsTrigger>
          <TabsTrigger value="ay">Son 6 ay</TabsTrigger>
        </TabsList>
        <TabsContent value="hafta" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Oynanan oyun" value="242" change={18} note="Geçen haftaya göre" />
            <StatCard label="Oyuncu" value="828" change={12} note="Tekil telefon sayısı" />
            <StatCard label="Ortalama oyun süresi" value="14 dk" change={3} note="Tabu ve Vampir en uzun" />
            <StatCard label="Karekod okutma" value="1.106" change={21} note="Oyuna dönüşme %76" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Günlere göre</CardTitle><CardDescription>Oyun ve oyuncu sayısı</CardDescription></CardHeader>
              <CardContent><WeekChart data={WEEK} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Saatlere göre</CardTitle><CardDescription>En yoğun saat 20:00–22:00</CardDescription></CardHeader>
              <CardContent><SimpleBarChart data={HOURS} x="saat" y="oyun" label="Oyun" /></CardContent>
            </Card>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Oyun dağılımı</CardTitle></CardHeader>
              <CardContent><GameBarChart data={BY_GAME.map((g) => ({ name: gameName(g.game), oyun: g.oyun, color: gameColor(g.game) }))} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>En hareketli masalar</CardTitle><CardDescription>Bugün</CardDescription></CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {top.map((t, i) => (
                    <li key={t.no} className="flex items-center gap-3">
                      <span className="bg-muted grid size-7 place-items-center rounded-full text-xs font-bold">{i + 1}</span>
                      <span className="font-medium">{t.label}</span>
                      <div className="bg-muted mx-2 h-2 flex-1 overflow-hidden rounded-full"><div className="bg-primary h-full rounded-full" style={{ width: `${(t.today / top[0].today) * 100}%` }} /></div>
                      <span className="text-muted-foreground w-14 text-right text-sm tabular-nums">{t.today} oyun</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="ay">
          <Card>
            <CardHeader><CardTitle>Aylık oyun sayısı</CardTitle><CardDescription>Mayıs–Ekim 2026</CardDescription></CardHeader>
            <CardContent><SimpleBarChart data={MONTHS} x="ay" y="oyun" label="Oyun" /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
