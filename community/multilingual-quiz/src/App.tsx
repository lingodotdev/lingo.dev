import React from 'react';
import Quiz from './components/Quiz';
import { TranslationProvider } from './context/TranslationContext';
import './App.css';

function App() {
  // Get API key from environment variable (optional)
  // If no API key is provided, the app will work in English only
  const apiKey = import.meta.env.VITE_LINGO_API_KEY;

  return (
    <TranslationProvider apiKey={apiKey}>
      <div className="App">
        <Quiz />
      </div>
    </TranslationProvider>
  );
}

export default App;
