import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lingo Chat Demo",
    description: "Redirecting...",
};

export default function RedirectLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
