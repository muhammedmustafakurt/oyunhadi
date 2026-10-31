import Link from 'next/link';
import { IconPlus, IconScan } from '@tabler/icons-react';
import PageContainer from '@/components/panel/page-container';
import StatCard from '@/components/panel/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { buttonVariants } from '@/components/ui/button';
import { REWARD_CODES, REWARD_RULES } from '@/lib/demo';
import { gameName } from '@/lib/game-meta';

export const metadata = { title: 'Ödüller' };

const STATUS = { bekliyor: 'Bekliyor', kullanildi: 'Kullanıldı', 'suresi-doldu': 'Süresi doldu' } as const;

export default function RewardsPage() {
  return (
    <PageContainer
      title="Ödüller"
      description="Hedefi tutturan masaya tek kullanımlık kod çıkar. Kod 4 saat geçerlidir, garson buradan doğrular."
      action={
        <>
          <Link href="/panel/oduller/dogrula" className={buttonVariants()}><IconScan /> Kod doğrula</Link>
          <button type="button" className={buttonVariants({ variant: 'outline' })}><IconPlus /> Yeni kural</button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Bu ay verilen" value="112" change={9} note="Geçen aya göre" />
        <StatCard label="Kullanılan" value="94" note="%84 kullanım oranı" />
        <StatCard label="Tahmini maliyet" value="₺4.230" note="Kurallardaki ikram fiyatlarına göre" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ödül kuralları</CardTitle>
          <CardDescription>Hangi oyunda, hangi hedefe, hangi ikram?</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Oyun</TableHead><TableHead>Hedef</TableHead><TableHead>Ödül</TableHead><TableHead className="hidden md:table-cell">Sınır</TableHead><TableHead className="text-right">Açık</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {REWARD_RULES.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{gameName(r.game)}</TableCell>
                  <TableCell>{r.goal}</TableCell>
                  <TableCell>{r.prize}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{r.limit}</TableCell>
                  <TableCell className="text-right"><Switch defaultChecked={r.active} aria-label="Kuralı aç/kapat" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Son verilen kodlar</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Kod</TableHead><TableHead>Masa</TableHead><TableHead className="hidden sm:table-cell">Oyun</TableHead><TableHead className="hidden md:table-cell">Ödül</TableHead><TableHead>Durum</TableHead><TableHead className="hidden sm:table-cell text-right">Zaman</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {REWARD_CODES.map((r) => (
                <TableRow key={r.code}>
                  <TableCell><code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{r.code}</code></TableCell>
                  <TableCell>{r.table}</TableCell>
                  <TableCell className="hidden sm:table-cell">{gameName(r.game)}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.prize}</TableCell>
                  <TableCell><Badge variant={r.status === 'bekliyor' ? 'default' : r.status === 'kullanildi' ? 'secondary' : 'outline'}>{STATUS[r.status]}</Badge></TableCell>
                  <TableCell className="text-muted-foreground hidden text-right sm:table-cell">{r.issued}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
