import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PolyglotChat — Realtime Multilingual Chat",
    description: "A realtime multilingual community powered by Lingo.dev and Gemini 2.0.",
    keywords: ["chat", "translation", "multilingual", "lingo.dev", "ai"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ backgroundColor: 'var(--c-bg)', margin: 0, padding: 0 }}>
                {children}
            </body>
        </html>
    );
}
