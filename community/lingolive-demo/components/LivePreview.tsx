'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface LivePreviewProps {
  userText: string
  selectedLanguage: string
  t: (key: string, fallback?: string) => string
  loading: boolean
  error: string | null
}

export function LivePreview({ userText, selectedLanguage, t, loading, error }: LivePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (userText) {
      try {
        await navigator.clipboard.writeText(userText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text:', err)
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {t('preview.title', 'Live Preview')}
        </h2>
        <div className="flex items-center space-x-2">
          {userText && (
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy text"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            {t('preview.loading', 'Translating...')}
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Preview */}
      {!loading && !error && (
        <div className="space-y-4">
          {/* User Text Preview */}
          {userText ? (
            <div className="animate-fade-in">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap break-words">
                  {userText}
                </p>
              </div>
              
              {/* Character Count */}
              <div className="mt-2 text-xs text-gray-500">
                {userText.length} {userText.length === 1 ? 'character' : 'characters'}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">
                {t('input.placeholder', 'Enter your text here...')}
              </p>
            </div>
          )}

          {/* Translation Status */}
          {selectedLanguage !== 'en' && userText && !loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <p className="text-sm text-blue-800">
                  Content displayed in {selectedLanguage === 'en' ? 'English' : selectedLanguage.toUpperCase()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}