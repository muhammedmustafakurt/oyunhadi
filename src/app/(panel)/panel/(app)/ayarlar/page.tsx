import { IconPlus } from '@tabler/icons-react';
import PageContainer from '@/components/panel/page-container';
import LocationCard from '@/components/panel/location-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CURRENT_VENUE } from '@/lib/demo';

export const metadata = { title: 'Ayarlar' };

const USERS = [
  { name: 'Elif Kaya', email: 'elif@hadikafe.com', role: 'Sahip', ini: 'EK' },
  { name: 'Mert Demir', email: 'mert@hadikafe.com', role: 'Garson (kod doğrular)', ini: 'MD' },
];

export default function SettingsPage() {
  const v = CURRENT_VENUE;
  return (
    <PageContainer title="Ayarlar" description="Mekân bilgileri, konum kilidi ve panel kullanıcıları.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Mekân bilgileri</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="n">Mekân adı</Label><Input id="n" defaultValue={v.name} /></div>
            <div className="grid gap-2">
              <Label htmlFor="s">Adres (karekodlarda)</Label>
              <div className="flex items-center gap-1"><span className="text-muted-foreground text-sm">oyunhadi.com/</span><Input id="s" defaultValue={v.slug} className="font-mono" /></div>
              <p className="text-muted-foreground text-xs">Değiştirirseniz basılı karekodlar çalışmaz; yenilerini yazdırmanız gerekir.</p>
            </div>
            <div className="grid gap-2"><Label htmlFor="c">Şehir / ilçe</Label><Input id="c" defaultValue={v.city} /></div>
            <Button className="w-fit">Kaydet</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Konum</CardTitle><CardDescription>Karekodun fotoğrafını çekip evden oynanmasını önler.</CardDescription></CardHeader>
          <CardContent><LocationCard lat={v.lat} lng={v.lng} /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Panel kullanıcıları</CardTitle>
          <CardDescription>Garsonlar yalnızca ödül kodu doğrulama ekranını görür.</CardDescription>
          <CardAction><Button variant="outline" size="sm"><IconPlus /> Kullanıcı davet et</Button></CardAction>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {USERS.map((u) => (
              <li key={u.email} className="flex items-center gap-3 py-3">
                <Avatar><AvatarFallback>{u.ini}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><p className="font-medium">{u.name}</p><p className="text-muted-foreground truncate text-sm">{u.email}</p></div>
                <Badge variant="outline">{u.role}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
