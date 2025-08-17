import { Head } from '@inertiajs/react'
import { LocaleSwitcher } from 'lingo.dev/react/client'

export default function Home() {
  return (
    <>
      <Head title="Homepage" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-sm text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Hello, world!</h1>
          <p className="text-gray-700 mb-4 leading-relaxed">
            This is an example app that demonstrates how{' '}
            <strong className="text-gray-900">Lingo.dev Compiler</strong> can be used to localize{' '}
            apps built with{' '}
            <a href="https://adonisjs.com/" className="text-blue-600 hover:text-blue-800 underline">
              AdonisJS
            </a>
            .
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            To switch between locales, use the following dropdown:
          </p>
          <div className="flex justify-center">
            <LocaleSwitcher locales={['en', 'es']} />
          </div>
        </div>
      </div>
    </>
  )
}
