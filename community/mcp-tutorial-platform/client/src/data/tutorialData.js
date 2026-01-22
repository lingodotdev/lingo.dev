export const tutorials = [
    {
        id: 'nextjs-app-router',
        title: 'Next.js App Router i18n Setup',
        framework: 'Next.js',
        difficulty: 'Beginner',
        duration: '15 mins',
        description: 'Learn how to set up internationalization in Next.js 13+ App Router using Lingo.dev MCP.',
        icon: '⚡',
        steps: [
            {
                title: 'Initialize Your Project',
                description: 'First, ensure you have a Next.js project with App Router. If starting fresh, create one with:',
                code: 'npx create-next-app@latest my-app --app',
                language: 'bash'
            },
            {
                title: 'Set up Lingo.dev MCP',
                description: 'With Lingo.dev MCP configured in your AI assistant (Claude Code, Cursor, etc.), simply prompt:',
                code: 'Set up i18n with the following locales: en, es, and fr. The default locale is "en".',
                language: 'text',
                mcpPrompt: true
            },
            {
                title: 'What MCP Creates',
                description: 'The MCP will automatically generate the necessary files and configurations:',
                beforeAfter: {
                    before: `// Before: Standard App Router structure
app/
  page.tsx
  layout.tsx`,
                    after: `// After: i18n-enabled structure
app/
  [locale]/
    page.tsx
    layout.tsx
  i18n/
    config.ts
    routing.ts
middleware.ts
components/
  LanguageSwitcher.tsx`
                }
            },
            {
                title: 'Language Switcher Component',
                description: 'MCP generates a ready-to-use language switcher component:',
                code: `'use client'
import { usePathname, useRouter } from 'next/navigation'
import { locales } from '@/i18n/config'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  
  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(/^\\/[^/]+/, \`/\${locale}\`)
    router.push(newPath)
  }
  
  return (
    <select onChange={(e) => switchLocale(e.target.value)}>
      {locales.map(locale => (
        <option key={locale} value={locale}>{locale}</option>
      ))}
    </select>
  )
}`,
                language: 'typescript'
            },
            {
                title: 'Middleware for Locale Detection',
                description: 'Automatic locale detection middleware is created:',
                code: `import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales } from './i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if pathname already has locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(\`/\${locale}/\`) || pathname === \`/\${locale}\`
  )
  
  if (pathnameHasLocale) return
  
  // Redirect to default locale
  request.nextUrl.pathname = \`/\${defaultLocale}\${pathname}\`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)']
}`,
                language: 'typescript'
            },
            {
                title: 'Using Translations',
                description: 'Now integrate Lingo.dev SDK or CLI for actual translations:',
                code: `// Install Lingo.dev SDK
npm install lingo.dev

// Use in your components
import { useTranslations } from 'lingo.dev/react'

export default function HomePage() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
    </div>
  )
}`,
                language: 'typescript'
            }
        ]
    },
    {
        id: 'nextjs-pages-router',
        title: 'Next.js Pages Router i18n Setup',
        framework: 'Next.js',
        difficulty: 'Beginner',
        duration: '12 mins',
        description: 'Set up internationalization in Next.js Pages Router with Lingo.dev MCP.',
        icon: '📄',
        steps: [
            {
                title: 'Create Pages Router Project',
                description: 'Start with a Next.js Pages Router project:',
                code: 'npx create-next-app@latest my-app',
                language: 'bash'
            },
            {
                title: 'Prompt Lingo.dev MCP',
                description: 'Use your AI assistant with MCP configured:',
                code: 'Set up i18n for Next.js Pages Router with locales: en, es, pt-BR. Default is "en".',
                language: 'text',
                mcpPrompt: true
            },
            {
                title: 'Generated Configuration',
                description: 'MCP creates next.config.js with i18n settings:',
                code: `/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'es', 'pt-BR'],
    defaultLocale: 'en',
    localeDetection: true,
  },
}

module.exports = nextConfig`,
                language: 'javascript'
            },
            {
                title: 'Dynamic Routes',
                description: 'Access locale in your pages:',
                code: `import { useRouter } from 'next/router'

export default function HomePage() {
  const router = useRouter()
  const { locale } = router
  
  return (
    <div>
      <h1>Current Locale: {locale}</h1>
      <p>Welcome to Lingo.dev!</p>
    </div>
  )
}`,
                language: 'javascript'
            },
            {
                title: 'Language Switcher',
                description: 'Switch between languages programmatically:',
                code: `import Link from 'next/link'
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
          className={locale === currentLocale ? 'active' : ''}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}`,
                language: 'javascript'
            }
        ]
    },
    {
        id: 'react-router',
        title: 'React Router v7 i18n Setup',
        framework: 'React Router',
        difficulty: 'Intermediate',
        duration: '18 mins',
        description: 'Implement internationalization in React Router v7 applications with Lingo.dev MCP.',
        icon: '🔄',
        steps: [
            {
                title: 'Create React Router Project',
                description: 'Initialize a new React Router v7 project:',
                code: 'npx create-react-router@latest my-app',
                language: 'bash'
            },
            {
                title: 'Configure MCP',
                description: 'Prompt your AI assistant:',
                code: 'Set up i18n for React Router v7 with en, de, ja locales. Default: "en".',
                language: 'text',
                mcpPrompt: true
            },
            {
                title: 'Locale-Based Routes',
                description: 'MCP sets up routes with locale parameters:',
                code: `import { createBrowserRouter } from 'react-router-dom'
import { LocaleLayout } from './layouts/LocaleLayout'
import HomePage from './pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/:locale',
    element: <LocaleLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      // Add more routes
    ]
  }
])`,
                language: 'typescript'
            },
            {
                title: 'Locale Context',
                description: 'MCP creates a context for locale management:',
                code: `import { createContext, useContext } from 'react'
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

export const useLocale = () => useContext(LocaleContext)`,
                language: 'typescript'
            },
            {
                title: 'Navigation with Locale',
                description: 'Create locale-aware navigation:',
                code: `import { Link } from 'react-router-dom'
import { useLocale } from './LocaleContext'

export function Navigation() {
  const locale = useLocale()
  
  return (
    <nav>
      <Link to={\`/\${locale}\`}>Home</Link>
      <Link to={\`/\${locale}/about\`}>About</Link>
      <Link to={\`/\${locale}/contact\`}>Contact</Link>
    </nav>
  )
}`,
                language: 'typescript'
            }
        ]
    }
]

export const frameworkFilters = [
    { id: 'all', label: 'All Frameworks', count: tutorials.length },
    { id: 'nextjs', label: 'Next.js', count: tutorials.filter(t => t.framework === 'Next.js').length },
    { id: 'react-router', label: 'React Router', count: tutorials.filter(t => t.framework === 'React Router').length },
    { id: 'tanstack', label: 'TanStack Start', count: 0 }
]

export const getTutorialById = (id) => {
    return tutorials.find(t => t.id === id)
}
