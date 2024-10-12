import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import OnchainProvider from '../providers/OnchainProvider';
import "@coinbase/onchainkit/styles.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });
// const instrumentSerif = Instrument_Serif({
//   weight: '400',
//   subsets: ['latin'],
//   variable: '--font-instrument-serif',
// });

export const metadata: Metadata = {
  title: 'Chain Insure',
  description: 'Secure your digital assets with blockchain technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={`${plusJakartaSans.className} ${instrumentSerif.variable}`}> */}
      <body className={plusJakartaSans.className}>
        <OnchainProvider>{children}</OnchainProvider>
      </body>
    </html>
  );
}