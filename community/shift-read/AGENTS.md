# LLM Agent Guidelines - Shift Read

## Project Overview

Shift is a minimal Next.js web application that lets users paste article URLs, view them in clean reader mode, and translate content to different languages.

### Technology Stack
- **Framework**: Next.js 16.1.4 (App Router)
- **Styling**: Tailwind CSS 4 (built-in, no @tailwindcss/typography plugin needed)
- **UI Components**: shadcn/ui (base-nova style, hugeicons)
- **Language**: TypeScript
- **Markdown Rendering**: react-markdown with remark-gfm and rehype-highlight
- **Web Scraping**: @mendable/firecrawl-js
- **Translation**: lingo.dev SDK

---

## Required Dependencies

```bash
pnpm install @mendable/firecrawl-js lingo.dev
pnpm install react-markdown remark-gfm rehype-highlight
pnpm install react-syntax-highlighter @types/react-syntax-highlighter
```

Note: Tailwind CSS 4 has built-in typography support. No @tailwindcss/typography plugin is required.

---

## Code Conventions

### General Rules
- NO comments in code unless explicitly requested
- Use TypeScript strict mode
- Follow existing code patterns in the codebase
- Use the `@/` alias for imports (already configured in tsconfig.json)

### Import Aliases
```typescript
// Components
import Component from "@/components/Component"
// UI Components (shadcn)
import { Button } from "@/components/ui/button"
// Utilities
import { cn } from "@/lib/utils"
// Hooks
import { useTheme } from "@/hooks/use-theme"
```

### File Naming
- Components: PascalCase (e.g., `ArticleRenderer.tsx`)
- Utilities/lib: camelCase (e.g., `storage.ts`)
- Server actions: camelCase (e.g., `scrape.ts`)

---

## File Structure

```
app/
├── page.tsx                      # Homepage with URL input
├── layout.tsx                    # Root layout with providers
├── globals.css                   # Global styles (Tailwind v4)
├── read/
│   └── [url]/
│       └── page.tsx             # Reading page with article display
├── actions/
│   ├── scrape.ts                # Firecrawl server action
│   └── translate.ts             # Lingo.dev server action
components/
├── ArticleRenderer.tsx           # Markdown renderer with custom components
├── ArticleHeader.tsx            # Title, author, date, image display
└── LanguageSelector.tsx         # Language dropdown
lib/
├── utils.ts                     # Utility functions (cn)
└── storage.ts                   # localStorage helpers
```

---

## Implementation Guidelines

### 1. Homepage (`app/page.tsx`)

**Requirements:**
- Centered design with generous whitespace
- Large "Shift" heading at top
- One-line tagline: "Read any article in your language"
- URL input field (56px height, placeholder: "https://example.com/article")
- "Extract & Read" button
- Theme toggle in top-right corner
- HTTPS URL validation with error display

**Implementation Pattern:**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.startsWith('https://')) {
      setError('Please enter a valid HTTPS URL')
      return
    }
    setError('')
    const encoded = encodeURIComponent(url)
    router.push(`/read/${encoded}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 text-center">
        <h1 className="text-6xl font-bold tracking-tight">Shift</h1>
        <p className="text-xl text-muted-foreground">Read any article in your language</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full h-14 px-4 rounded-lg border focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button type="submit" className="w-full h-14 bg-primary text-primary-foreground rounded-lg font-medium">
            Extract & Read
          </button>
        </form>
      </div>
    </main>
  )
}
```

---

### 2. Firecrawl Server Action (`app/actions/scrape.ts`)

**Requirements:**
- Server action (use 'use server')
- Accepts URL parameter
- Calls Firecrawl API with:
  - formats: ['markdown']
  - onlyMainContent: true
  - waitFor: 1000ms
- Returns: { markdown, metadata } with metadata containing { title, author, publishedTime, ogImage, language }
- Handle errors gracefully

**Implementation Pattern:**
```typescript
'use server'

import Firecrawl from '@mendable/firecrawl-js'

export interface ScrapedArticle {
  markdown: string
  metadata: {
    title?: string
    author?: string
    publishedTime?: string
    ogImage?: string
    language?: string
  }
}

export async function scrapeArticle(url: string): Promise<{ success: boolean; data?: ScrapedArticle; error?: string }> {
  try {
    const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY })
    
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['markdown'],
      onlyMainContent: true,
      waitFor: 1000
    })

    if (!result.success || !result.markdown) {
      return { success: false, error: 'Failed to extract article content' }
    }

    return {
      success: true,
      data: {
        markdown: result.markdown,
        metadata: result.metadata || {}
      }
    }
  } catch (error) {
    return { success: false, error: 'Failed to scrape article' }
  }
}
```

---

### 3. Lingo.dev Server Action (`app/actions/translate.ts`)

**Requirements:**
- Server action (use 'use server')
- Accepts: markdown, sourceLanguage, targetLanguage
- Initialize LingoDotDevEngine with API key
- Translate markdown content
- Return translated content

**Implementation Pattern:**
```typescript
'use server'

import { LingoDotDevEngine } from 'lingo.dev/sdk'

export async function translateContent(
  markdown: string,
  sourceLanguage: string | null,
  targetLanguage: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const lingoDotDev = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY
    })

    const result = await lingoDotDev.translateText(markdown, {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage
    })

    return {
      success: true,
      data: result
    }
  } catch (error) {
    return { success: false, error: 'Translation failed' }
  }
}
```

---

### 4. localStorage Utilities (`lib/storage.ts`)

**Requirements:**
- `getFromStorage(url)`: returns cached article data or null
- `saveToStorage(url, data)`: saves article + translation
- Key format: `shift_articles_[encoded-url]`

**Implementation Pattern:**
```typescript
export interface StoredArticle {
  article: {
    content: string
    title?: string
    author?: string
    date?: string
    image?: string
    sourceLanguage?: string
  }
  translation: {
    content: string
    language: string
  }
  timestamp: number
}

export function getStorageKey(url: string): string {
  return `shift_articles_${encodeURIComponent(url)}`
}

export function getFromStorage(url: string): StoredArticle | null {
  if (typeof window === 'undefined') return null
  
  try {
    const key = getStorageKey(url)
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function saveToStorage(url: string, data: StoredArticle): void {
  if (typeof window === 'undefined') return
  
  try {
    const key = getStorageKey(url)
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Silent fail
  }
}
```

---

### 5. Article Renderer (`components/ArticleRenderer.tsx`)

**Requirements:**
- Use react-markdown with remark-gfm and rehype-highlight
- Custom components:
  - `img`: Next.js Image, responsive, rounded corners
  - `a`: external links open in new tab with rel="noopener noreferrer"
  - `code`: inline code with background, block code with syntax highlighting
- Apply prose styling (use Tailwind's prose classes - built into Tailwind v4)

**Implementation Pattern:**
```typescript
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import Image from 'next/image'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'highlight.js/styles/github-dark.css'

interface ArticleRendererProps {
  content: string
}

export default function ArticleRenderer({ content }: ArticleRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      className="prose prose-lg dark:prose-invert max-w-none"
      components={{
        img: ({ src, alt }) => (
          <div className="my-8 rounded-lg overflow-hidden">
            <Image
              src={src || ''}
              alt={alt || ''}
              width={800}
              height={400}
              className="w-full h-auto object-cover"
            />
            {alt && <p className="text-sm text-muted-foreground mt-2 text-center">{alt}</p>}
          </div>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {children}
          </a>
        ),
        code: ({ inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              style={vscDarkPlus}
              PreTag="div"
              className="rounded-lg my-4"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
```

---

### 6. Article Header (`components/ArticleHeader.tsx`)

**Requirements:**
- Display title (large), author name, date, featured image
- Styled with appropriate spacing

**Implementation Pattern:**
```typescript
import Image from 'next/image'

interface ArticleHeaderProps {
  title?: string
  author?: string
  date?: string
  image?: string
}

export default function ArticleHeader({ title, author, date, image }: ArticleHeaderProps) {
  return (
    <header className="mb-8 pb-8 border-b">
      {image && (
        <div className="relative w-full h-64 sm:h-96 mb-6 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={title || 'Article'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
      {(author || date) && (
        <div className="flex items-center gap-4 text-muted-foreground">
          {author && <span>By {author}</span>}
          {author && date && <span>•</span>}
          {date && <span>{new Date(date).toLocaleDateString()}</span>}
        </div>
      )}
    </header>
  )
}
```

---

### 7. Language Selector (`components/LanguageSelector.tsx`)

**Requirements:**
- Dropdown with language options
- Shows "Original" + 10-12 common languages
- Filters out source language from options
- On change: triggers translation

**Supported Languages:**
- Spanish (es), French (fr), German (de)
- Japanese (ja), Chinese (zh), Arabic (ar)
- Hindi (hi), Portuguese (pt), Russian (ru)
- Korean (ko), Italian (it), Dutch (nl)

**Implementation Pattern:**
```typescript
'use client'

import { useState } from 'react'

interface LanguageOption {
  code: string
  name: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' }
]

interface LanguageSelectorProps {
  sourceLanguage?: string
  onLanguageChange: (language: string | null) => void
}

export default function LanguageSelector({ sourceLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>('Original')

  const availableLanguages = LANGUAGES.filter(lang => lang.code !== sourceLanguage)

  const handleSelect = (language: string | null) => {
    setSelected(language)
    setIsOpen(false)
    onLanguageChange(language)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-lg flex items-center gap-2"
      >
        {selected || 'Original'}
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 bg-popover border rounded-lg shadow-lg z-50 w-48 max-h-64 overflow-y-auto">
          <button
            onClick={() => handleSelect(null)}
            className="w-full px-4 py-2 text-left hover:bg-muted"
          >
            Original
          </button>
          {availableLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="w-full px-4 py-2 text-left hover:bg-muted"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### 8. Reading Page (`app/read/[url]/page.tsx`)

**Requirements:**
- On load: decode URL, check localStorage for cached article
- If cached: display instantly
- If not: call scrape action, then cache result
- Show article header + markdown content
- Loading states during scraping/translation
- Error states with retry option
- Sticky header with: app name, language selector, "Show Original" toggle, theme toggle

**Implementation Pattern:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleHeader from '@/components/ArticleHeader'
import ArticleRenderer from '@/components/ArticleRenderer'
import LanguageSelector from '@/components/LanguageSelector'
import { scrapeArticle } from '@/app/actions/scrape'
import { translateContent } from '@/app/actions/translate'
import { getFromStorage, saveToStorage } from '@/lib/storage'

export default function ReadPage({ params }: { params: { url: string } }) {
  const decodedUrl = decodeURIComponent(params.url)
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState(false)
  const [showOriginal, setShowOriginal] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [article, setArticle] = useState<{ content: string; title?: string; author?: string; date?: string; image?: string; sourceLanguage?: string } | null>(null)
  const [translatedContent, setTranslatedContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadArticle() {
      const cached = getFromStorage(decodedUrl)
      
      if (cached) {
        setArticle(cached.article)
        setTranslatedContent(cached.translation?.content || null)
        setSelectedLanguage(cached.translation?.language || null)
        setLoading(false)
        return
      }

      const result = await scrapeArticle(decodedUrl)
      
      if (!result.success || !result.data) {
        setError(result.error || 'Failed to load article')
        setLoading(false)
        return
      }

      const articleData = {
        content: result.data.markdown,
        title: result.data.metadata.title,
        author: result.data.metadata.author,
        date: result.data.metadata.publishedTime,
        image: result.data.metadata.ogImage,
        sourceLanguage: result.data.metadata.language
      }

      setArticle(articleData)
      saveToStorage(decodedUrl, {
        article: articleData,
        translation: { content: '', language: '' },
        timestamp: Date.now()
      })
      setLoading(false)
    }

    loadArticle()
  }, [decodedUrl])

  const handleLanguageChange = async (language: string | null) => {
    if (!article) return
    
    if (language === null) {
      setShowOriginal(true)
      setSelectedLanguage(null)
      return
    }

    setTranslating(true)
    const result = await translateContent(article.content, article.sourceLanguage || null, language)
    
    if (result.success && result.data) {
      setTranslatedContent(result.data)
      setShowOriginal(false)
      setSelectedLanguage(language)
      
      saveToStorage(decodedUrl, {
        article,
        translation: { content: result.data, language },
        timestamp: Date.now()
      })
    }
    setTranslating(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <a href="/" className="text-primary hover:underline">Go Home</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-xl">Shift</a>
          <div className="flex items-center gap-4">
            <LanguageSelector
              sourceLanguage={article?.sourceLanguage}
              onLanguageChange={handleLanguageChange}
            />
            {translatedContent && (
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className="px-3 py-1.5 text-sm border rounded-lg"
              >
                {showOriginal ? 'Show Translation' : 'Show Original'}
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <ArticleHeader
          title={article?.title}
          author={article?.author}
          date={article?.date}
          image={article?.image}
        />
        {translating && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Translating...</span>
          </div>
        )}
        <ArticleRenderer content={showOriginal ? article?.content || '' : translatedContent || ''} />
      </main>
    </div>
  )
}
```

---

## Environment Variables

Create `.env.local` file in project root:
```env
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
LINGODOTDEV_API_KEY=your_lingodotdev_api_key_here
```

---

## Testing Guidelines

### Manual Testing Checklist
1. **Homepage:**
   - URL input accepts valid HTTPS URLs
   - Invalid URLs show error message
   - "Extract & Read" button navigates to reading page
   - Theme toggle works

2. **Article Scraping:**
   - Medium articles scrape correctly
   - Substack articles scrape correctly
   - Personal blogs scrape correctly
   - Loading state displays during scraping
   - Error handling works for failed scrapes

3. **Reading Page:**
   - Article displays with proper typography
   - Images render correctly
   - Code blocks have syntax highlighting
   - Links open in new tab
   - Markdown formatting is preserved

4. **Translation:**
   - Language selector shows available languages
   - Source language is filtered from options
   - Translation triggers on language selection
   - Loading state displays during translation
   - "Show Original" toggle works
   - Translated content is cached

5. **localStorage Caching:**
   - Articles are cached after first scrape
   - Cached articles load instantly on revisit
   - Translations are cached
   - Cache key format is correct

6. **Responsive Design:**
   - Homepage looks good on mobile, tablet, desktop
   - Reading page is responsive
   - Images scale properly on all screen sizes

7. **Dark Mode:**
   - Light/dark theme toggle works
   - All components render correctly in both themes
   - Typography colors are readable in dark mode

---

## Common Issues and Solutions

### Issue: react-markdown with TypeScript
**Solution:** Install type definitions:
```bash
npm install @types/react @types/react-dom
```

### Issue: Syntax highlighting not working
**Solution:** Import highlight.js CSS:
```typescript
import 'highlight.js/styles/github-dark.css'
```

### Issue: Next.js Image component with external URLs
**Solution:** Configure next.config.ts to allow external domains:
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
}
```

### Issue: Server action imports in client components
**Solution:** Ensure 'use server' directive is at the top of server action files

---

## Success Criteria

**Functionality:**
- Scrapes articles from Medium, Substack, personal blogs
- Translates content while preserving formatting
- Caches articles for instant re-access
- Toggles between original and translated seamlessly

**Design:**
- Clean, minimal UI
- Beautiful typography on reading page
- Responsive on all devices
- Dark/light mode working

**Performance:**
- Homepage loads instantly
- Cached articles load instantly
- New scrapes complete in 3-6 seconds
- Translations complete in 3-8 seconds
