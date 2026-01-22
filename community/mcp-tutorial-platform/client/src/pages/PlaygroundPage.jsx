import { useState } from 'react'
import Editor from '@monaco-editor/react'
import './PlaygroundPage.css'

function PlaygroundPage() {
    const [prompt, setPrompt] = useState('Set up i18n with locales: en, es, fr. Default is "en".')
    const [framework, setFramework] = useState('nextjs-app')
    const [output, setOutput] = useState('')

    const examplePrompts = [
        {
            id: 1,
            text: 'Set up i18n with locales: en, es, fr. Default is "en".',
            framework: 'nextjs-app'
        },
        {
            id: 2,
            text: 'Set up i18n for Next.js Pages Router with en, de, ja locales.',
            framework: 'nextjs-pages'
        },
        {
            id: 3,
            text: 'Configure React Router v7 with internationalization support for en, es, pt-BR.',
            framework: 'react-router'
        }
    ]

    const exampleOutputs = {
        'nextjs-app': `// Generated files by Lingo.dev MCP

// app/[locale]/layout.tsx
import { LocaleProvider } from '@/i18n/LocaleProvider'

export default function LocaleLayout({ 
  children, 
  params: { locale } 
}: { 
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <LocaleProvider locale={locale}>
      {children}
    </LocaleProvider>
  )
}

// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(\`/\${locale}/\`) || pathname === \`/\${locale}\`
  )
  
  if (pathnameHasLocale) return
  
  request.nextUrl.pathname = \`/\${defaultLocale}\${pathname}\`
  return NextResponse.redirect(request.nextUrl)
}

// components/LanguageSwitcher.tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher() {
  const pathname =usePathname()
  const router = useRouter()
  
  return (
    <select onChange={(e) => {
      const newPath = pathname.replace(/^\\/[^/]+/, \`/\${e.target.value}\`)
      router.push(newPath)
    }}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  )
}`,
        'nextjs-pages': `// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'de', 'ja'],
    defaultLocale: 'en',
    localeDetection: true,
  },
}

// components/LanguageSwitcher.js
import Link from 'next/link'
import { useRouter } from 'next/router'

export function LanguageSwitcher() {
  const router = useRouter()
  const { locales, locale: currentLocale } = router
  
  return (
    <div>
      {locales.map(locale => (
        <Link 
          key={locale}
          href={router.asPath} 
          locale={locale}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}`,
        'react-router': `// router.tsx
import { createBrowserRouter } from 'react-router-dom'
import { LocaleLayout } from './layouts/LocaleLayout'

export const router = createBrowserRouter([
  {
    path: '/:locale',
    element: <LocaleLayout />,
    children: [
      // Your routes here
    ]
  }
])

// LocaleContext.tsx
import { createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'

const LocaleContext = createContext('en')

export function LocaleProvider({ children }) {
  const { locale } = useParams()
  
  return (
    <LocaleContext.Provider value={locale || 'en'}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)`
    }

    const handleSimulate = () => {
        setOutput(exampleOutputs[framework] || '// Code will be generated here...')
    }

    const loadExample = (example) => {
        setPrompt(example.text)
        setFramework(example.framework)
    }

    return (
        <div className="playground-page">
            <section className="playground-header section">
                <div className="container">
                    <h1 className="gradient-text">Code Playground</h1>
                    <p className="section-subtitle">
                        Experiment with MCP prompts and see what code gets generated
                    </p>
                </div>
            </section>

            <section className="playground-content">
                <div className="container-wide">
                    <div className="playground-grid">
                        {/* Left Panel - Input */}
                        <div className="playground-panel">
                            <div className="card">
                                <h3>Your MCP Prompt</h3>
                                <p className="panel-description">
                                    Try different prompts to see how MCP generates i18n setup code
                                </p>

                                <div className="form-group">
                                    <label>Framework</label>
                                    <select
                                        className="input select"
                                        value={framework}
                                        onChange={(e) => setFramework(e.target.value)}
                                    >
                                        <option value="nextjs-app">Next.js App Router</option>
                                        <option value="nextjs-pages">Next.js Pages Router</option>
                                        <option value="react-router">React Router v7</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Prompt</label>
                                    <textarea
                                        className="input textarea"
                                        rows={4}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Enter your MCP prompt here..."
                                    />
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleSimulate}
                                    style={{ width: '100%' }}
                                >
                                    ▶ Simulate MCP Output
                                </button>

                                <div className="examples-section">
                                    <h4>Example Prompts</h4>
                                    <div className="examples-list">
                                        {examplePrompts.map(example => (
                                            <button
                                                key={example.id}
                                                className="example-btn"
                                                onClick={() => loadExample(example)}
                                            >
                                                <span className="example-icon">💡</span>
                                                <span className="example-text">{example.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Output */}
                        <div className="playground-panel">
                            <div className="card">
                                <div className="output-header">
                                    <h3>Generated Code</h3>
                                    {output && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => navigator.clipboard.writeText(output)}
                                        >
                                            📋 Copy All
                                        </button>
                                    )}
                                </div>

                                {output ? (
                                    <div className="monaco-wrapper">
                                        <Editor
                                            height="600px"
                                            defaultLanguage="typescript"
                                            value={output}
                                            theme="vs-dark"
                                            options={{
                                                readOnly: true,
                                                minimap: { enabled: false },
                                                fontSize: 14,
                                                lineNumbers: 'on',
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true,
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="empty-output">
                                        <div className="empty-icon">📝</div>
                                        <p>No output yet. Enter a prompt and click "Simulate MCP Output"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="info-banner card">
                        <div className="info-icon">💡</div>
                        <div className="info-content">
                            <h4>How This Works</h4>
                            <p>
                                This playground simulates what Lingo.dev MCP would generate when you use it in your AI assistant
                                (Claude Code, Cursor, etc.). The actual MCP integrates directly with your codebase and generates
                                production-ready files based on your project structure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PlaygroundPage
