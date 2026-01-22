import { useState, useRef } from 'react'
import './App.css'
import Card from './components/Card'
import LanguageSelector from './components/LanguageSelector'
import Button from './components/Button'
import { WORD_DATA, DEFAULT_WORDS } from './data/words'
import { LuTrophy, LuCircleX, LuArrowUpDown } from 'react-icons/lu'

function App() {
  const [knownLang, setKnownLang] = useState('English')
  const [practiceLang, setPracticeLang] = useState('Japanese')
  const [gameStatus, setGameStatus] = useState<'idle' | 'starting' | 'playing' | 'shuffling' | 'solving' | 'result'>('idle')
  const [knownWord, setKnownWord] = useState('')
  const [targetWord, setTargetWord] = useState('')
  const [cards, setCards] = useState<{ id: number; char: string }[]>([
    { id: 1, char: 'A' },
    { id: 2, char: 'あ' },
    { id: 3, char: 'हि' },
  ])
  const [selectedCards, setSelectedCards] = useState<{ id: number; char: string }[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const swapLanguages = () => {
    setKnownLang(practiceLang)
    setPracticeLang(knownLang)
  }

  const generateNewWord = () => {
    const wordList = WORD_DATA[knownLang] || DEFAULT_WORDS
    const randomEntry = wordList[Math.floor(Math.random() * wordList.length)]
    setKnownWord(randomEntry.word)
    
    const chars = Array.from(randomEntry.word)
    const newCards = chars.map((char, index) => ({
      id: Date.now() + index,
      char: char
    }))
    
    const shuffledCards = [...newCards].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }

  const translateToPracticeLang = async (word: string): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word,
          sourceLang: knownLang,
          targetLang: practiceLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translated;
    } catch (error) {
      console.error("API Error:", error);
      // Fallback to local data if API fails
      for (const lang in WORD_DATA) {
        const entry = WORD_DATA[lang].find(e => e.translation === word || e.word === word);
        if (entry) {
          return lang === practiceLang ? entry.word : entry.translation;
        }
      }
      return word;
    }
  }

  const handleButtonClick = async () => {
    if (gameStatus === 'idle' || gameStatus === 'result') {
      setGameStatus('starting')
      setIsCorrect(null)
      setSelectedCards([])
      setTimeout(() => {
        generateNewWord()
        setGameStatus('playing')
      }, 1500)
    } else if (gameStatus === 'playing') {
      setGameStatus('shuffling')
      
      const translated = await translateToPracticeLang(knownWord)
      setTargetWord(translated)
      
      const chars = Array.from(translated)
      const newCards = chars.map((char, index) => ({
        id: Date.now() + index,
        char: char
      }))
      
      setTimeout(() => {
        setCards([...newCards].sort(() => Math.random() - 0.5))
        setGameStatus('solving')
        gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 1000)
    }
  }

  const handleCardClick = (clickedCard: { id: number; char: string }) => {
    if (gameStatus !== 'solving') return
    
    setCards(prev => prev.filter(c => c.id !== clickedCard.id))
    setSelectedCards(prev => [...prev, clickedCard])
  }

  const handleRemoveCard = (removedCard: { id: number; char: string }) => {
    if (gameStatus !== 'solving') return

    setSelectedCards(prev => prev.filter(c => c.id !== removedCard.id))
    setCards(prev => [...prev, removedCard])
  }

  const handleSubmit = () => {
    const userWord = selectedCards.map(c => c.char).join('')
    const correct = userWord === targetWord
    setIsCorrect(correct)
    setGameStatus('result')
  }

  const getButtonText = () => {
    switch (gameStatus) {
      case 'idle': return 'Get a word'
      case 'starting': return 'Getting a word...'
      case 'shuffling': return 'Starting the game...'
      case 'playing': return 'Start the game'
      case 'solving': return 'Solve the word'
      case 'result': return 'Get another word'
      default: return 'Get a word'
    }
  }

  return (
    <div className="app-container">
      <nav className="app-nav">
        <div className="logo-text">Word Flip</div>
        <a href="https://lingo.dev" target="_blank" rel="noopener noreferrer" className="powered-by">
          powered by <span>lingo.dev</span>
        </a>
      </nav>

      <header className="app-header">
        <div className="header-top">
          <div className="header-spacer"></div>
          <h1>Practice a word daily</h1>
          <div className="header-side">
            <div className="lang-selector">
              <LanguageSelector 
                label="Known" 
                selectedLanguage={knownLang} 
                onSelect={setKnownLang} 
                exclude={practiceLang}
              />
              
              <button className="swap-button" onClick={swapLanguages} title="Swap Languages">
                <LuArrowUpDown size={20} />
              </button>

              <LanguageSelector 
                label="Practice" 
                selectedLanguage={practiceLang} 
                onSelect={setPracticeLang} 
                align="right"
                exclude={knownLang}
              />
            </div>
          </div>
        </div>
        <p className="header-desc">The known word will be shuffled. Arrange it in the correct order and translate to {practiceLang}.</p>
        
        <div className="action-container">
          <Button 
            onClick={handleButtonClick}
            loading={gameStatus === 'starting' || gameStatus === 'shuffling'}
            disabled={gameStatus === 'starting' || gameStatus === 'shuffling'}
          >
            {getButtonText()}
          </Button>
        </div>
      </header>
      
      <main className="card-display">
        {gameStatus === 'solving' || gameStatus === 'result' ? (
          <div className="game-area" ref={gameAreaRef}>
            <div className="selection-zone">
              <p className="zone-label">Your Answer</p>
              <p className="scroll-hint">Characters are below, scroll down</p>
              <div className="word-cards selected-cards">
                {selectedCards.map(card => (
                  <div key={card.id} onClick={() => handleRemoveCard(card)}>
                    <Card char={card.char} />
                  </div>
                ))}
                {selectedCards.length === 0 && <div className="card-placeholder">Select cards below...</div>}
              </div>
            </div>

            <div className="available-zone">
              <p className="zone-label">Available Characters</p>
              <div className="word-cards">
                {cards.map(card => (
                  <div key={card.id} onClick={() => handleCardClick(card)}>
                    <Card char={card.char} />
                  </div>
                ))}
              </div>
            </div>

            {gameStatus === 'solving' && selectedCards.length > 0 && (
              <div className="submit-container">
                <Button onClick={handleSubmit}>Submit Answer</Button>
              </div>
            )}

            {gameStatus === 'result' && (
              <div className={`result-message ${isCorrect ? 'success' : 'error'}`}>
                {isCorrect ? (
                  <>
                    <span className="result-icon"><LuTrophy size={48} /></span>
                    <p>Correct! You've mastered this word.</p>
                  </>
                ) : (
                  <>
                    <span className="result-icon"><LuCircleX size={48} /></span>
                    <p>Not quite. The correct word was: <strong>{targetWord}</strong></p>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="word-cards">
            {cards.map(card => (
              <Card key={card.id} char={card.char} />
            ))}
          </div>
        )}
        
        {gameStatus === 'idle' && (
          <div className="welcome-hint">
            Ready to learn? Press "Get a word" to begin!
          </div>
        )}
      </main>
    </div>
  )
}

export default App
