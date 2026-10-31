import PageContainer from '@/components/panel/page-container';
import RewardVerify from '@/components/panel/reward-verify';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = { title: 'Kod doğrula' };

// Garson ekranı: telefonda tek elle kullanılacak şekilde büyük ve sade.
export default function VerifyPage() {
  return (
    <PageContainer title="Ödül kodu doğrula" description="Misafirin gösterdiği kodu yazın. Geçerliyse ikramı verip kodu kapatın.">
      <Card>
        <CardContent className="py-10">
          <RewardVerify />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
