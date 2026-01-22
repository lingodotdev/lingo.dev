'use client'

import { useState } from 'react'
import { Send, Trash2 } from 'lucide-react'

interface InputSectionProps {
  userText: string
  onTextChange: (text: string) => void
  t: (key: string, fallback?: string) => string
  loading: boolean
}

export function InputSection({ userText, onTextChange, t, loading }: InputSectionProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onTextChange('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger translation
    console.log('Submit text for translation:', userText)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {t('input.label', 'Your Content')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={userText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={t('input.placeholder', 'Enter your text here...')}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            rows={8}
          />
          
          {/* Character count indicator */}
          {userText && (
            <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded">
              {userText.length} / 1000
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!userText.trim() || loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>{t('button.translate', 'Translate')}</span>
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={!userText.trim() || loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t('button.clear', 'Clear')}</span>
          </button>
        </div>
      </form>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          Quick examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Welcome to our app!',
            'Error: Invalid input',
            'Success: Saved successfully',
            'Loading, please wait...'
          ].map((example) => (
            <button
              key={example}
              onClick={() => onTextChange(example)}
              disabled={loading}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Pro tip:</p>
            <p>Try different types of content - UI text, error messages, form labels, or user notifications to see how they localize!</p>
          </div>
        </div>
      </div>
    </div>
  )
}