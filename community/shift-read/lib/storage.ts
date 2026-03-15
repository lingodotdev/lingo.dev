export interface StoredArticle {
  article: {
    content: string
    title?: string
    author?: string
    date?: string
    image?: string
    sourceLanguage?: string
  }
  translation?: {
    content: string
    language: string
  }
  timestamp: number
}

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

export function getStorageKey(url: string): string {
  return `shift_article_${encodeURIComponent(url)}`
}

export function getFromStorage(url: string): StoredArticle | null {
  if (typeof window === 'undefined') return null
  
  try {
    const key = getStorageKey(url)
    const item = localStorage.getItem(key)
    if (!item) return null
    
    const data: StoredArticle = JSON.parse(item)
    
    if (Date.now() - data.timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
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
  }
}

export function clearFromStorage(url: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const key = getStorageKey(url)
    localStorage.removeItem(key)
  } catch {
  }
}
