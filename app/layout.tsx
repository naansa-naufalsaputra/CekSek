import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ceksek - Marketplace Barang Bekas Kampus',
  description: 'Beli barang bekas kampus 100% aman dengan garansi 7 hari & escrow khusus area kampus UNNES.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable}`}>
      <body suppressHydrationWarning className="font-sans bg-[#f8f9ff] text-[#0b1c30]">
        {children}
      </body>
    </html>
  );
}
