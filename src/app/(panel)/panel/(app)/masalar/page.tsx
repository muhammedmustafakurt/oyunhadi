import Link from 'next/link';
import { IconPrinter, IconPlus, IconExternalLink } from '@tabler/icons-react';
import PageContainer from '@/components/panel/page-container';
import TableActions from '@/components/panel/table-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { CURRENT_VENUE, TABLES } from '@/lib/demo';
import { gameName } from '@/lib/game-meta';

export const metadata = { title: 'Masalar ve karekodlar' };

export default function TablesPage() {
  const v = CURRENT_VENUE;
  return (
    <PageContainer
      title="Masalar ve karekodlar"
      description={`${TABLES.length} masa kayıtlı. Her masanın kendi karekodu var; aynı karekod NFC etikete de yazılabilir.`}
      action={
        <>
          <Link href="/panel/masalar/yazdir" className={buttonVariants({ variant: 'outline' })}><IconPrinter /> Karekodları yazdır</Link>
          <button type="button" className={buttonVariants()}><IconPlus /> Masa ekle</button>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Masalar</CardTitle>
          <CardDescription>Masa adını değiştirebilir, geçici olarak kapatabilir ya da karekodunu yenileyebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Masa</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="hidden md:table-cell">Şu an</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Bugün</TableHead>
                <TableHead className="hidden lg:table-cell">Adres</TableHead>
                <TableHead><span className="sr-only">İşlemler</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TABLES.map((t) => {
                const url = `/${v.slug}/masa-${t.no}/oyunlar`;
                return (
                  <TableRow key={t.no}>
                    <TableCell className="font-medium">{t.label}<span className="text-muted-foreground block text-xs">masa-{t.no}</span></TableCell>
                    <TableCell>
                      {t.status === 'oynaniyor' && <Badge className="bg-emerald-600 text-white">Oynanıyor</Badge>}
                      {t.status === 'bos' && <Badge variant="outline">Boş</Badge>}
                      {t.status === 'kapali' && <Badge variant="secondary">Kapalı</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {t.status === 'oynaniyor' ? `${gameName(t.game)} · ${t.players} kişi` : t.lastScan ? `Son okutma ${t.lastScan}` : '—'}
                    </TableCell>
                    <TableCell className="hidden text-right tabular-nums sm:table-cell">{t.today} oyun</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-mono text-xs">
                        oyunhadi.com{url} <IconExternalLink className="size-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right"><TableActions label={t.label} url={url} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
