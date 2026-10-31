import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/panel/app-sidebar';
import Header from '@/components/panel/header';
import { panelVenue } from '@/lib/venues';

// Giriş yapılmış panel sayfaları: oturum çerezi venues tablosundaki mekâna bağlı. Çerez yoksa giriş ekranına.
export default async function PanelAppLayout({ children }: { children: React.ReactNode }) {
  const venue = await panelVenue();
  if (!venue) redirect('/panel/giris');
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar venue={venue} />
      <SidebarInset id="main-content" className="scroll-mt-16">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
