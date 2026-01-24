import React from 'react';
import ReactDOM from 'react-dom/client';
import { LingoProviderWrapper, loadDictionary } from 'lingo.dev/react/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
      <App />
    </LingoProviderWrapper>
  </React.StrictMode>
);