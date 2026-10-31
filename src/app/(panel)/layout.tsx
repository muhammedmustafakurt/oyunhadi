import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/panel.css';
import ThemeProvider from '@/components/panel/theme-provider';
import { Toaster } from '@/components/ui/sonner';

// Mekân paneli (next-shadcn-dashboard-starter teması). Site ve oyuncu ekranından ayrı kök layout.
const sans = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist' });
const mono = Geist_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: { default: 'Mekân paneli', template: '%s · oyunhadi panel' },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function PanelRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} bg-background overflow-x-hidden font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
