'use client'

import { cleanMarkdown } from '@/app/actions/cleanMarkdown'
import { fetchContent, type ArticleData } from '@/app/actions/fetchContent'
import { translateMarkdown } from '@/app/actions/translate'
import ArticleHeader from '@/components/ArticleHeader'
import LanguageSelector from '@/components/LanguageSelector'
import { MDXRender } from '@/components/MDXRender'
import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { getFromStorage, saveToStorage } from '@/lib/storage'
import { reconstructUrl } from '@/lib/utils'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ReadPage() {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [cleanupStatus, setCleanupStatus] = useState('')
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [translatedContent, setTranslatedContent] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)
  const [showOriginal, setShowOriginal] = useState(true)
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadArticle() {
      try {
        if (cancelled) return

        const resolvedParams = await params;
        const decodedUrl = reconstructUrl(resolvedParams.url as string | string[])
        setResolvedUrl(decodedUrl)

        setLoading(true)
        setCleanupStatus('')
        setError(null)
        setTranslatedContent(null)
        setSelectedLanguage(null)
        setShowOriginal(true)

        const cached = getFromStorage(decodedUrl)
        if (cached) {
          setArticle({
            markdown: cached.article.content,
            metadata: {
              title: cached.article.title,
              author: cached.article.author,
              publishedTime: cached.article.date,
              ogImage: cached.article.image,
              language: cached.article.sourceLanguage
            }
          })
          if (cached.translation) {
            setTranslatedContent(cached.translation.content)
            setSelectedLanguage(cached.translation.language)
            setShowOriginal(false)
          }
          setLoading(false)
          return
        }

        setCleanupStatus('Fetching article...')
        const scrapeResult = await fetchContent(decodedUrl)

        if (!scrapeResult.success || !scrapeResult.data) {
          setError(scrapeResult.error || 'Failed to load article')
          return
        }

        setCleanupStatus('Cleaning up content...')
        const cleanResult = await cleanMarkdown(
          scrapeResult.data.markdown,
          scrapeResult.data.metadata
        )

        let finalArticle: ArticleData

        if (cleanResult.success && cleanResult.data) {
          finalArticle = {
            markdown: cleanResult.data.markdown,
            metadata: cleanResult.data.metadata
          }
        } else {
          console.warn('Markdown cleanup failed, using raw content:', cleanResult.error)
          finalArticle = scrapeResult.data
        }

        setArticle(finalArticle)
        saveToStorage(decodedUrl, {
          article: {
            content: finalArticle.markdown,
            title: finalArticle.metadata.title,
            author: finalArticle.metadata.author,
            date: finalArticle.metadata.publishedTime,
            image: finalArticle.metadata.ogImage,
            sourceLanguage: finalArticle.metadata.language
          },
          timestamp: Date.now()
        })
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
        setCleanupStatus('')
      }
    }

    loadArticle()

    return () => {
      cancelled = true
    }
  }, [params])

  async function handleLanguageChange(language: string | null) {
    if (!article || !resolvedUrl) return

    if (language === null) {
      setShowOriginal(true)
      setSelectedLanguage(null)
      return
    }

    setTranslating(true)
    const result = await translateMarkdown(
      article.markdown,
      article.metadata.language || null,
      language
    )

    if (result.success && result.data) {
      setTranslatedContent(result.data)
      setShowOriginal(false)
      setSelectedLanguage(language)

      saveToStorage(resolvedUrl, {
        article: {
          content: article.markdown,
          title: article.metadata.title,
          author: article.metadata.author,
          date: article.metadata.publishedTime,
          image: article.metadata.ogImage,
          sourceLanguage: article.metadata.language
        },
        translation: {
          content: result.data,
          language
        },
        timestamp: Date.now()
      })
    } else {
      setShowOriginal(true)
      setSelectedLanguage(null)
      console.error('Translation failed:', result.error)
    }

    setTranslating(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-bold text-xl hover:opacity-80 transition-opacity">
              Shift
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">{cleanupStatus || 'Loading article...'}</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-bold text-xl hover:opacity-80 transition-opacity">
              Shift
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <p className="text-destructive text-lg">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/')} variant="outline">
                Go Home
              </Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-xl hover:opacity-80 transition-opacity">
            Shift
          </Link>
          <div className="flex items-center gap-4">
            {translating ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Translating...</span>
              </div>
            ) : (
              <LanguageSelector
                sourceLanguage={article.metadata.language}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                disabled={loading}
              />
            )}

            {translatedContent && (
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
              >
                {showOriginal ? 'Recent Translation' : 'Show Original'}
              </button>
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <ArticleHeader
          title={article.metadata.title}
          author={article.metadata.author}
          date={article.metadata.publishedTime}
          image={article.metadata.ogImage}
        />

        <div className="prose prose-sm dark:prose-invert max-w-none cursor-text transition-all">
          <MDXRender content={showOriginal ? article.markdown : translatedContent || ''} />
        </div>
      </main>
    </div>
  )
}
