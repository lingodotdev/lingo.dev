'use client'

import { Language } from '@/lib/lingo'
import { Globe, Zap, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  t: (key: string, fallback?: string) => string
  loading: boolean
  currentLanguage?: Language
}

export function HeroSection({ t, loading, currentLanguage }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Main Title */}
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Globe className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {t('app.title', 'LingoLive')}
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {t('app.subtitle', 'Real-Time Multilingual App Preview')}
          </p>
          
          {/* Hero Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              {t('hero.title', 'Type Once, Translate Everywhere')}
            </h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              {t('hero.description', 'Experience how Lingo.dev transforms your content into multiple languages instantly. See your UI text, error messages, and dynamic content localize in real-time.')}
            </p>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: Zap, text: 'Real-time Translation' },
              { icon: Globe, text: '10+ Languages' },
              { icon: ArrowRight, text: 'Live Preview' }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <feature.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* Current Language Indicator */}
          {currentLanguage && !loading && (
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-2xl">{currentLanguage.flag}</span>
              <span className="font-medium">
                Currently viewing in {currentLanguage.name}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 text-blue-50 fill-current" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0,48 C480,32 960,16 1440,0 L1440,48 L0,48 Z"></path>
        </svg>
      </div>
    </section>
  )
}