import { Inter, Plus_Jakarta_Sans, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600', '700', '800'] });
const headline = Bebas_Neue({ subsets: ['latin'], variable: '--font-headline', display: 'swap', weight: ['400'] });

export const metadata = {
  title: 'CollegeFinder — Discover & Compare Indian Colleges',
  description: 'Browse, filter and compare top NIRF-ranked Indian engineering colleges — IITs, NITs and leading private institutes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable} ${headline.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="border-t border-border bg-muted/40 mt-16">
            <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>© {new Date().getFullYear()} CollegeFinder · NIRF 2024 rankings · Demo data for illustration</span>
              <span>Designed and crafted with care.</span>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
