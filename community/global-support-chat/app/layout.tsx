import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global Support Chat',
  description: 'Multilingual support dashboard powered by Lingo.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
