import { useState } from 'react'
import './App.css'

type UIState = 'initial' | 'loading' | 'success' | 'error'

interface GitHubUser {
  login: string
  avatar_url: string
  name: string
  bio: string
  public_repos: number
  followers: number
}

function App() {
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
    <div className="app-container">
      <h1>GitHub Profile Finder</h1>
      
      <div className="search-section">
        <div className="input-group">
          <label htmlFor="username-input">GitHub Username</label>
          <input
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter GitHub username"
            disabled={uiState === 'loading'}
          />
        </div>
        
        <button 
          onClick={fetchProfile}
          disabled={uiState === 'loading'}
          className="fetch-button"
        >
          {uiState === 'loading' ? 'Loading...' : 'Fetch Profile'}
        </button>
      </div>

      {uiState === 'loading' && (
        <div className="status-message loading">
          Loading profile for "{username}"...
        </div>
      )}

      {uiState === 'error' && (
        <div className="status-message error">
          {errorMessage}
        </div>
      )}

      {uiState === 'success' && userData && (
        <div className="profile-card">
          <img 
            src={userData.avatar_url} 
            alt={`${userData.login}'s avatar`}
            className="avatar"
          />
          <h2>{userData.name || userData.login}</h2>
          <p className="username">@{userData.login}</p>
          {userData.bio && <p className="bio">{userData.bio}</p>}
          <div className="stats">
            <div className="stat">
              <strong>{userData.public_repos}</strong>
              <span>Repositories</span>
            </div>
            <div className="stat">
              <strong>{userData.followers}</strong>
              <span>Followers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
