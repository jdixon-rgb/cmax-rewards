import type { Metadata, Viewport } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import BottomNav from '@/components/BottomNav';
import FloatingFeedback from '@/components/FloatingFeedback';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['600', '700', '800', '900'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'CMAX Rewards | Climbmax Rock Gym',
  description: 'Earn points. Climb the leaderboard. Win prizes.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="bg-black text-white font-body">
        <AppProvider>
          <main className="min-h-dvh pb-20 bg-texture">{children}</main>
          <FloatingFeedback />
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
