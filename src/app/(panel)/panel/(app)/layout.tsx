import { cookies } from 'next/headers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/panel/app-sidebar';
import Header from '@/components/panel/header';

// Giriş yapılmış panel sayfaları. TASARIM AŞAMASI: oturum kontrolü yok, örnek mekân gösterilir.
export default async function PanelAppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset id="main-content" className="scroll-mt-16">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
