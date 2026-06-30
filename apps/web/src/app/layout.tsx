import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IASA — Intelligent API Security Assessment',
    template: '%s | IASA',
  },
  description:
    'Automated API security testing and vulnerability detection platform. Scan REST APIs against OWASP API Security Top 10.',
  keywords: ['API security', 'OWASP', 'vulnerability scanner', 'penetration testing', 'API testing'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen bg-background`}>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(217.2 32.6% 12%)',
                border: '1px solid hsl(217.2 32.6% 20%)',
                color: 'hsl(210 40% 98%)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
