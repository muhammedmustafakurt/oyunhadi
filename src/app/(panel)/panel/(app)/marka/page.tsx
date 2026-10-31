import PageContainer from '@/components/panel/page-container';
import BrandEditor from '@/components/panel/brand-editor';
import { CURRENT_VENUE } from '@/lib/demo';

export const metadata = { title: 'Marka ve renkler' };

export default function BrandPage() {
  const v = CURRENT_VENUE;
  return (
    <PageContainer title="Marka ve renkler" description="Oyun ekranı mekânınızın logosu ve renkleriyle açılır.">
      <BrandEditor venue={{ name: v.name, initials: v.initials, color: v.color, accent: v.accent, welcome: v.welcome }} />
    </PageContainer>
  );
}
