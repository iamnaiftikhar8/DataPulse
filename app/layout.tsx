import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ProfessionalHeader from '@/components/ui/ProfessionalHeader';
import RouteChangeOverlay from '@/components/ui/RouteChangeOverlay';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DataPulse',
  description: 'Transform your data into insights.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.className} min-h-screen bg-black text-gray-200`}>
        <ProfessionalHeader />
        <RouteChangeOverlay />

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
