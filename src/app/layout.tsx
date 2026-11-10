import type { Metadata } from 'next';
import '@/styles/globals.css';
import ClientShell from '@/components/client-shell';

export const metadata: Metadata = {
  title: 'ShadowSpark Fleet — enterprise bulk logistics, Nigeria',
  description: 'Fleet dashboard, bulk upload, route optimization and cold-chain monitoring for enterprise logistics across Nigeria.',
  metadataBase: new URL('https://shadowspark.tech'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
