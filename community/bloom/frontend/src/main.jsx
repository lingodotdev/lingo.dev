import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { LingoProvider } from "@lingo.dev/compiler/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LingoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LingoProvider>
  </StrictMode>,
)
