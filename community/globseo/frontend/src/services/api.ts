const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
  if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL not set, using default localhost:3001/api');
  }
}

export interface SEOScores {
  title_quality: number;
  description_quality: number;
  keyword_optimization: number;
  content_alignment: number;
  technical_seo: number;
}

export interface SmartRewrites {
  title_variations: string[];
  description_variations: string[];
}

export interface SEOAnalysis {
  scores: SEOScores;
  total_score: number;
  issues: string[];
  recommendations: string[];
  smart_rewrites?: SmartRewrites;
}

export interface Metadata {
  url: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  author: string;
  canonical: string;
  robots: string;
  h1: string;
  h2: string;
  lang: string;
  language: string;
  content?: string;
}

export interface ScrapeAndScoreResponse {
  success: boolean;
  url: string;
  metadata: Metadata;
  seoScore: SEOAnalysis;
  timestamp: string;
}

export interface ScrapeTranslateScoreResponse {
  success: boolean;
  url: string;
  metadata: Metadata;
  translations: TranslationResult;
  seoScore: SEOAnalysis;
  targetLanguages: string[];
  timestamp: string;
}

export interface TranslationResult {
  [language: string]: {
    meta?: {
      title?: string;
      description?: string;
      keywords?: string;
      h1?: string;
    };
    og?: {
      title?: string;
      description?: string;
    };
    twitter?: {
      title?: string;
      description?: string;
    };
  };
}

export interface TranslateResponse {
  success: boolean;
  url: string;
  original: Metadata;
  translations: TranslationResult;
  targetLanguages: string[];
  timestamp: string;
}

class APIService {
  /**
   * Helper method to safely parse JSON responses
   */
  private async parseJSONResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content-type'}`);
    }
    return response.json();
  }

  /**
   * Scrape metadata from a URL
   */
  async scrape(url: string): Promise<Metadata> {
    try {
      const response = await fetch(`${API_BASE_URL}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await this.parseJSONResponse<any>(response);
          errorMessage = errorData.message || errorData.error || 'Unknown error';
        } catch {
          // If we can't parse the error response, use the status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(`Scrape failed: ${errorMessage}`);
      }

      const data = await this.parseJSONResponse<{ metadata: Metadata }>(response);
      return data.metadata;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error during scrape: Cannot connect to ${API_BASE_URL}/scrape. Is the backend running?`);
      }
      throw error;
    }
  }

  /**
   * Scrape and get SEO score in one call
   */
  async scrapeAndScore(url: string, primaryKeyword?: string, geminiApiKey?: string): Promise<ScrapeAndScoreResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/scrape-and-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, primaryKeyword, geminiApiKey })
      });

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await this.parseJSONResponse<any>(response);
          errorMessage = errorData.message || errorData.error || 'Unknown error';
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(`Scrape and score failed: ${errorMessage}`);
      }

      return this.parseJSONResponse<ScrapeAndScoreResponse>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error during scrape-and-score: Cannot connect to ${API_BASE_URL}/scrape-and-score. Is the backend running?`);
      }
      throw error;
    }
  }

  /**
   * Complete pipeline: Scrape, translate metadata, and score SEO
   */
  async scrapeTranslateScore(
    url: string, 
    languages: string[], 
    primaryKeyword?: string,
    lingoApiKey?: string,
    geminiApiKey?: string
  ): Promise<ScrapeTranslateScoreResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/scrape-translate-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, languages, primaryKeyword, lingoApiKey, geminiApiKey }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await this.parseJSONResponse<any>(response);
          errorMessage = errorData.message || errorData.error || 'Unknown error';
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage || 'Failed to complete pipeline');
      }

      return this.parseJSONResponse<ScrapeTranslateScoreResponse>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. The analysis is taking longer than expected.');
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error during scrape-translate-score: Cannot connect to ${API_BASE_URL}/scrape-translate-score. Is the backend running?`);
      }
      throw error;
    }
  }

  /**
   * Generate SEO score from existing metadata
   */
  async generateScore(params: {
    url: string;
    title?: string;
    description?: string;
    keywords?: string;
    ogTags?: Record<string, string>;
    content?: string;
    language?: string;
    primaryKeyword?: string;
  }): Promise<{ success: boolean; analysis: SEOAnalysis }> {
    try {
      const response = await fetch(`${API_BASE_URL}/seo-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await this.parseJSONResponse<any>(response);
          errorMessage = errorData.message || errorData.error || 'Unknown error';
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(`SEO score generation failed: ${errorMessage}`);
      }

      return this.parseJSONResponse<{ success: boolean; analysis: SEOAnalysis }>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error during seo-score: Cannot connect to ${API_BASE_URL}/seo-score. Is the backend running?`);
      }
      throw error;
    }
  }

  /**
   * Scrape and translate metadata
   */
  async translate(url: string, languages: string[], lingoApiKey?: string): Promise<TranslateResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, languages, lingoApiKey })
      });

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await this.parseJSONResponse<any>(response);
          errorMessage = errorData.message || errorData.error || 'Unknown error';
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(`Translation failed: ${errorMessage}`);
      }

      return this.parseJSONResponse<TranslateResponse>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error during translate: Cannot connect to ${API_BASE_URL}/translate. Is the backend running?`);
      }
      throw error;
    }
  }

  /**
   * Get list of supported languages
   */
  async getLanguages(): Promise<Array<{ code: string; name: string; native: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/languages`);

      if (!response.ok) {
        throw new Error('Failed to fetch languages');
      }

      const data = await this.parseJSONResponse<{ supported: Array<{ code: string; name: string; native: string }> }>(response);
      return data.supported;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error during languages: Cannot connect to ${API_BASE_URL}/languages. Is the backend running?`);
      }
      throw error;
    }
  }

  /**
   * Health check
   */
  async health(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return this.parseJSONResponse<{ status: string; message: string }>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error during health check: Cannot connect to ${API_BASE_URL}/health. Is the backend running?`);
      }
      throw error;
    }
  }
}

export const api = new APIService();
export default api;
