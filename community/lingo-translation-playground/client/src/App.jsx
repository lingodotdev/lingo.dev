import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [inputType, setInputType] = useState('text')
  const [translations, setTranslations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Example JSON for quick testing
  const exampleJSON = `{
  "welcome": "Welcome to our application",
  "login": "Please login to continue",
  "logout": "Logout",
  "save": "Save changes",
  "cancel": "Cancel"
}`

  // Example plain text
  const exampleText = "Hello, welcome to our amazing application. Please enjoy your stay!"

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate')
      return
    }

    setLoading(true)
    setError('')
    setCopied(false)

    try {
      const response = await axios.post('http://localhost:5000/translate', {
        text: inputText,
        inputType
      })

      setTranslations(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Translation failed. Please try again.')
      console.error('Translation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExample = () => {
    if (inputType === 'json') {
      setInputText(exampleJSON)
    } else {
      setInputText(exampleText)
    }
    setTranslations(null)
    setError('')
  }

  const handleCopy = () => {
    if (translations) {
      navigator.clipboard.writeText(JSON.stringify(translations.translations, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const languageNames = {
    'hi': 'Hindi',
    'es': 'Spanish',
    'fr': 'French'
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>
            <span className="logo">🌐</span>
            Lingo.dev Localization Playground
          </h1>
          <p className="subtitle">
            Translate plain text or JSON UI strings instantly using Lingo.dev API
          </p>
        </header>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-header">
            <div className="type-selector">
              <button
                className={`type-btn ${inputType === 'text' ? 'active' : ''}`}
                onClick={() => setInputType('text')}
              >
                📝 Plain Text
              </button>
              <button
                className={`type-btn ${inputType === 'json' ? 'active' : ''}`}
                onClick={() => setInputType('json')}
              >
                🗂️ JSON Object
              </button>
            </div>
            <button className="example-btn" onClick={handleExample}>
              💡 Load Example
            </button>
          </div>

          <textarea
            className="input-area"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              inputType === 'json' 
                ? 'Paste your JSON object here...\nExample: {\n  "key": "value"\n}'
                : 'Paste your text here...\nExample: Hello, welcome to our application!'
            }
            rows={10}
            spellCheck="false"
          />

          <div className="language-info">
            <span className="language-tag">🇮🇳 Hindi</span>
            <span className="language-tag">🇪🇸 Spanish</span>
            <span className="language-tag">🇫🇷 French</span>
            <span className="info-text">Translating to 3 languages...</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="translate-btn" 
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
          >
            {loading ? '🔄 Translating...' : '🚀 Translate with Lingo.dev'}
          </button>
          
          {translations && (
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? '✅ Copied!' : '📋 Copy All Translations'}
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Results Section */}
        {translations && (
          <div className="results-section">
            <div className="results-header">
              <h2>📦 Translation Results</h2>
              <span className="input-type-badge">
                {translations.inputType === 'json' ? 'JSON Mode' : 'Text Mode'}
              </span>
            </div>
            
            <div className="translations-grid">
              {Object.entries(translations.translations).map(([lang, translation]) => (
                <div key={lang} className="translation-card">
                  <div className="card-header">
                    <span className="flag">
                      {lang === 'hi' ? '🇮🇳' : lang === 'es' ? '🇪🇸' : '🇫🇷'}
                    </span>
                    <span className="language-name">{languageNames[lang] || lang}</span>
                    <span className="lang-code">{lang}</span>
                  </div>
                  <pre className="translation-output">
                    {translations.inputType === 'json'
                      ? JSON.stringify(translation, null, 2)
                      : translation}
                  </pre>
                </div>
              ))}
            </div>

            {/* Raw JSON Output */}
            <div className="raw-output">
              <h3>📋 Complete Output</h3>
              <pre className="json-output">
                {JSON.stringify(translations.translations, null, 2)}
              </pre>
            </div>
          </div>
        )}

  
      </div>
    </div>
  )
}

export default App