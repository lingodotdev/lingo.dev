'use client';

import Link from 'next/link';
import Script from 'next/script';

export default function HomePage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-bg)' }}>
            <Script
                type="module"
                src="https://unpkg.com/@splinetool/viewer@1.0.28/build/spline-viewer.js"
            />

            <nav className="nav">
                <Link href="/" className="nav-brand"><span>r/</span>PolyglotChat</Link>
                <div style={{ flex: 1 }}></div>
                <div className="nav-actions">
                    <Link href="/chat" className="btn-reddit btn-reddit-primary" style={{ width: '120px' }}>Join</Link>
                </div>
            </nav>

            <div style={{ backgroundColor: 'var(--c-primary)', height: '120px' }}></div>

            <main className="app-container" style={{ marginTop: '-60px' }}>
                <div className="feed">
                    <div className="sidebar-box" style={{ padding: '24px', position: 'relative' }}>
                        <div className="spline-container">
                            {/* @ts-ignore */}
                            <spline-viewer url="https://prod.spline.design/6Wq1Q7YGyWf8Z9eY/scene.splinecode" />
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '20px',
                                zIndex: 10,
                                pointerEvents: 'none'
                            }}>
                                <h1 style={{ fontSize: '32px', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                    Global Feed
                                </h1>
                                <p style={{ color: 'var(--c-text-dim)' }}>r/PolyglotChat — powered by Lingo.dev</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>Talk to the World</h2>
                                <p style={{ color: 'var(--c-text-dim)', marginBottom: '16px' }}>
                                    A decentralized community where language is no longer a barrier.
                                    Every post is instantly localized into your native tongue using Lingo.dev's
                                    real-time SDK and Gemini 2.0.
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link href="/chat" className="btn-reddit btn-reddit-primary" style={{ width: '140px' }}>
                                        Enter Feed
                                    </Link>
                                    <Link href="/metrics" className="btn-reddit btn-reddit-secondary" style={{ width: '140px' }}>
                                        View Stats
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-box mt-4">
                        <div className="sidebar-title">Core Technology</div>
                        <div className="sidebar-content">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ padding: '16px', background: 'var(--c-card-hover)', borderRadius: '4px', border: '1px solid var(--c-border)' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--c-primary)', marginBottom: '4px' }}>Realtime SDK</div>
                                    <div style={{ fontSize: '12px', color: 'var(--c-text-dim)' }}>Lingo.dev handles complex i18n logic so you can focus on building features.</div>
                                </div>
                                <div style={{ padding: '16px', background: 'var(--c-card-hover)', borderRadius: '4px', border: '1px solid var(--c-border)' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--c-primary)', marginBottom: '4px' }}>Gemini 2.0</div>
                                    <div style={{ fontSize: '12px', color: 'var(--c-text-dim)' }}>State-of-the-art LLM translation ensures professional level nuances.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="sidebar">
                    <div className="sidebar-box">
                        <div className="sidebar-title">Community Details</div>
                        <div className="sidebar-content">
                            <div className="mb-4" style={{ fontSize: '16px', fontWeight: 700 }}>r/PolyglotChat</div>
                            <p style={{ fontSize: '13px', color: 'var(--c-text-dim)' }}>
                                Founded 2024. The world's first truly multilingual community.
                            </p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                                <span className="badge badge-primary">Lingo.dev</span>
                                <span className="badge">Next.js 14</span>
                                <span className="badge">TypeScript</span>
                                <span className="badge">Redis</span>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-box">
                        <div className="sidebar-title">Tech Resources</div>
                        <div className="sidebar-content">
                            <a
                                href="https://github.com/lingo-dev/lingo.dev"
                                target="_blank"
                                className="btn-reddit btn-reddit-secondary"
                            >
                                GitHub Repository
                            </a>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
