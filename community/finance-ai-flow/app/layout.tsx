import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Finance AI Flow',
    description: 'Your financial overview powered by AI',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>{children}</body>
        </html>
    );
}
