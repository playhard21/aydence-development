import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
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
