import localFont from 'next/font/local';
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const jakarta = localFont({
  src: [
    { path: './fonts/PlusJakartaSans-300.woff2', weight: '300', style: 'normal' },
    { path: './fonts/PlusJakartaSans-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/PlusJakartaSans-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/PlusJakartaSans-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/PlusJakartaSans-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aydence – Speaking Coaching (B1 Level) with Dr. Shoba Kapoor',
  description:
    'Build your career in Germany by speaking German with confidence: 9-week Speaking Coaching (B1 Level) online with Dr. Shoba Kapoor.',
  keywords:
    'German speaking coaching B1, communication coach, speak German confidently, career in Germany, Shoba Kapoor',
  openGraph: {
    title: 'Aydence – Speaking Coaching (B1 Level) with Dr. Shoba Kapoor',
    description:
      'Build your career in Germany by speaking German with confidence: 9-week Speaking Coaching (B1 Level) online with Dr. Shoba Kapoor.',
    type: 'website',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de" className={jakarta.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-new.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
