import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Website Localization SaaS',
  description: 'Translate your website content instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
