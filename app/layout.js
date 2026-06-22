import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600', '700', '800'] });

export const metadata = {
  title: 'CollegeFinder — Discover & Compare Indian Colleges',
  description: 'Browse, filter and compare top Indian engineering colleges — IITs, NITs and private institutes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-background">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-border/60 bg-muted/30 mt-16">
          <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} CollegeFinder · Built with Next.js, Tailwind & Recharts</span>
            <span>Designed and crafted with care.</span>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
