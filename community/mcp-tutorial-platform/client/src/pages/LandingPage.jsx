import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
    const features = [
        {
            icon: '⚡',
            title: 'Instant Setup',
            description: 'Set up complete i18n infrastructure with a single MCP prompt. No manual configuration needed.'
        },
        {
            icon: '🎯',
            title: 'Framework Support',
            description: 'Works with Next.js (App & Pages Router), React Router v7, and TanStack Start out of the box.'
        },
        {
            icon: '🔄',
            title: 'Auto-Generated Code',
            description: 'MCP generates locale routes, language switchers, middleware, and locale detection automatically.'
        },
        {
            icon: '📚',
            title: 'Interactive Tutorials',
            description: 'Learn with step-by-step guides, code examples, and before/after comparisons.'
        },
        {
            icon: '💻',
            title: 'Code Playground',
            description: 'Experiment with MCP prompts and see real-time results in our interactive editor.'
        },
        {
            icon: '🚀',
            title: 'Production Ready',
            description: 'Generated code follows best practices and is ready for production deployment.'
        }
    ]

    const supportedFrameworks = [
        { name: 'Next.js App Router', version: 'v13-16', icon: '▲' },
        { name: 'Next.js Pages Router', version: 'v13-16', icon: '▲' },
        { name: 'React Router', version: 'v7', icon: '🔄' },
        { name: 'TanStack Start', version: 'v1', icon: '⚡', soon: true }
    ]

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero section">
                <div className="container">
                    <div className="hero-content animate-fade-in">
                        <div className="hero-badge">
                            <span className="badge badge-primary">NEW: Model Context Protocol</span>
                        </div>

                        <h1 className="hero-title">
                            Master <span className="gradient-text">Lingo.dev MCP</span>
                            <br />
                            for Instant i18n Setup
                        </h1>

                        <p className="hero-description">
                            Learn how to set up internationalization in seconds using Lingo.dev's Model Context Protocol.
                            Interactive tutorials, code playground, and step-by-step guides for every major React framework.
                        </p>

                        <div className="hero-actions">
                            <Link to="/tutorials" className="btn btn-primary btn-lg">
                                Start Learning
                            </Link>
                            <Link to="/playground" className="btn btn-secondary btn-lg">
                                Try Playground
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-value">3+</div>
                                <div className="stat-label">Frameworks</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">10+</div>
                                <div className="stat-label">Tutorials</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">&lt;1min</div>
                                <div className="stat-label">Setup Time</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is MCP Section */}
            <section className="section mcp-explanation">
                <div className="container">
                    <div className="section-header">
                        <h2>What is Lingo.dev MCP?</h2>
                        <p className="section-subtitle">
                            Model Context Protocol (MCP) enables AI coding assistants to integrate with external tools
                        </p>
                    </div>

                    <div className="mcp-demo-card card card-elevated">
                        <div className="mcp-demo-content">
                            <div className="mcp-demo-prompt">
                                <div className="prompt-label">You prompt:</div>
                                <code className="prompt-text">Set up i18n with locales: en, es, fr. Default is "en"</code>
                            </div>

                            <div className="mcp-demo-arrow">↓</div>

                            <div className="mcp-demo-result">
                                <div className="result-label">MCP generates:</div>
                                <ul className="result-list">
                                    <li>✅ Locale-based routes (<code>/en</code>, <code>/es</code>, <code>/fr</code>)</li>
                                    <li>✅ Language switcher component</li>
                                    <li>✅ Automatic locale detection</li>
                                    <li>✅ Middleware configuration</li>
                                    <li>✅ i18n routing setup</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section features">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Use This Platform?</h2>
                    </div>

                    <div className="grid grid-3">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supported Frameworks */}
            <section className="section frameworks">
                <div className="container">
                    <div className="section-header">
                        <h2>Supported Frameworks</h2>
                        <p className="section-subtitle">
                            Works seamlessly with your favorite React frameworks
                        </p>
                    </div>

                    <div className="frameworks-grid">
                        {supportedFrameworks.map((framework, index) => (
                            <div key={index} className="framework-card card">
                                <div className="framework-icon">{framework.icon}</div>
                                <div className="framework-info">
                                    <h4>{framework.name}</h4>
                                    <p className="framework-version">{framework.version}</p>
                                </div>
                                {framework.soon && <span className="badge badge-warning">Coming Soon</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta">
                <div className="container">
                    <div className="cta-card card-elevated">
                        <h2>Ready to Get Started?</h2>
                        <p>
                            Dive into our interactive tutorials and learn how to set up i18n in your React applications
                            using Lingo.dev MCP in just minutes.
                        </p>
                        <div className="cta-actions">
                            <Link to="/tutorials" className="btn btn-primary btn-lg">
                                Explore Tutorials
                            </Link>
                            <a
                                href="https://lingo.dev/en/mcp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-lg"
                            >
                                Read MCP Docs
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
