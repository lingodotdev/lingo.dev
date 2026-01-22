'use client'

import { useState } from 'react'
import { LanguageSelector } from '@/components/LanguageSelector'
import { LivePreview } from '@/components/LivePreview'
import { InputSection } from '@/components/InputSection'
import { HeroSection } from '@/components/HeroSection'
import { useTranslation } from '@/lib/lingo'
import { SUPPORTED_LANGUAGES } from '@/lib/lingo'

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [userText, setUserText] = useState('')
  const { t, loading, error } = useTranslation(selectedLanguage)

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
  }

  const handleTextChange = (text: string) => {
    setUserText(text)
  }

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LL</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {t('app.title', 'LingoLive')}
              </h1>
            </div>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              disabled={loading}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection t={t} loading={loading} currentLanguage={currentLanguage} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <InputSection
            userText={userText}
            onTextChange={handleTextChange}
            t={t}
            loading={loading}
          />
          
          {/* Live Preview Section */}
          <LivePreview
            userText={userText}
            selectedLanguage={selectedLanguage}
            t={t}
            loading={loading}
            error={error}
          />
        </div>

        {/* Demo Form Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('form.title', 'Interactive Form Demo')}
          </h2>
          <DemoForm t={t} loading={loading} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Powered by{' '}
              <a 
                href="https://lingo.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Lingo.dev
              </a>
              {' '}- Real-time localization for modern applications
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Demo Form Component
function DemoForm({ t, loading }: { t: (key: string, fallback?: string) => string, loading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = t('form.required', 'This field is required')
    }
    if (!formData.email.trim()) {
      newErrors.email = t('form.required', 'This field is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('form.invalid_email', 'Please enter a valid email address')
    }
    if (!formData.message.trim()) {
      newErrors.message = t('form.required', 'This field is required')
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Simulate form submission
      alert(t('success.copied', 'Form submitted successfully!'))
      setFormData({ name: '', email: '', message: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.name', 'Name')}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.email', 'Email')}
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.message', 'Message')}
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t('preview.loading', 'Loading...') : t('form.submit', 'Send Message')}
      </button>
    </form>
  )
}