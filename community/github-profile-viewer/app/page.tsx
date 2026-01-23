'use client'

import { useState } from 'react'
import Image from 'next/image'

type UIState = 'initial' | 'loading' | 'success' | 'error'

interface GitHubUser {
  login: string
  avatar_url: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  html_url: string
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [uiState, setUiState] = useState<UIState>('initial')
  const [userData, setUserData] = useState<GitHubUser | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchProfile = async () => {
    if (!username.trim()) {
      setErrorMessage('Please enter a username')
      setUiState('error')
      return
    }

    setUiState('loading')
    setErrorMessage('')

    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage(`User "${username}" not found`)
        } else {
          setErrorMessage('API error occurred. Please try again.')
        }
        setUiState('error')
        return
      }

      const data = await response.json()
      setUserData(data)
      setUiState('success')
    } catch (error) {
      setErrorMessage('Network error. Please check your connection.')
      setUiState('error')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchProfile()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-slate-900 dark:to-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <svg className="w-10 h-10 text-zinc-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              GitHub Profile Finder
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
            Search for any GitHub user and view their profile information
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 mb-8 transition-all hover:shadow-2xl">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                GitHub Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., prateek-wayne"
                disabled={uiState === 'loading'}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <button
              onClick={fetchProfile}
              disabled={uiState === 'loading'}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {uiState === 'loading' ? (
                <>
                
                  Loading...
                </>
              ) : (
                <>
              
                  Fetch Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {uiState === 'loading' && (
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {uiState === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error</h3>
              <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success State - Profile Card */}
        {uiState === 'success' && userData && (
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Image
                src={userData.avatar_url}
                alt={`${userData.login}'s avatar`}
                width={128}
                height={128}
                className="rounded-full border-4 border-zinc-200 dark:border-zinc-800 shadow-lg"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                  {userData.name || userData.login}
                </h2>
                <a
                  href={userData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium mb-3 inline-block"
                >
                  @{userData.login}
                </a>
                {userData.bio && (
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
                    {userData.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {userData.public_repos}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  Repositories
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {userData.followers}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {userData.following}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  Following
                </div>
              </div>
            </div>

            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-center"
            >
              View on GitHub →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
