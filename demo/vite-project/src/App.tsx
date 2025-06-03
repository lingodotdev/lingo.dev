import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { LingoDotDev } from "./lingo-dot-dev";
import "./App.css";
import { TestComponent } from "./components/test";

import { LocaleSwitcher } from "lingo.dev/react/client";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="logo-container">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://lingo.dev" target="_blank">
          <LingoDotDev />
        </a>
      </div>
      <h1>Lingo.dev loves Vite and React</h1>
      <p className="welcome-text">
        Welcome to your new Vite &amp; React application! This starter template
        includes everything you need to get started with Vite &amp; React and
        Lingo.dev for internationalization.
      </p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the logos above to learn more</p>
      <TestComponent />
      <div className="locale-switcher">
        <LocaleSwitcher
          locales={["en", "es", "fr", "ru", "de", "ja", "zh", "ar", "ko"]}
        />
      </div>
    </>
  );
}

export default App;
