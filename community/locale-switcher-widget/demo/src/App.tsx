import { useLocale } from '@lingo.dev/compiler/react';
import { LocaleSwitcher, buildLocaleOptions } from '../src';
import '../src/styles.css';
import './App.css';

function App() {
  const { locale, setLocale, config } = useLocale();
  
  const allLocales = [config.sourceLocale, ...config.targetLocales];
  const locales = buildLocaleOptions(allLocales);

  return (
    <div className="app">
      <header className="header">
        <h1>🌍 Locale Switcher Widget</h1>
        <p className="subtitle">Drop-in component for Lingo.dev Compiler</p>
      </header>

      <main className="main">
        <section className="demo-section">
          <h2>Dropdown Variant</h2>
          <p>Perfect for header navigation with many locales</p>
          <div className="demo-box">
            <LocaleSwitcher
              currentLocale={locale}
              locales={locales}
              onLocaleChange={setLocale}
              variant="dropdown"
              showLabels={true}
            />
          </div>
          <pre className="code">
{`<LocaleSwitcher
  variant="dropdown"
  currentLocale={locale}
  locales={locales}
  onLocaleChange={setLocale}
  showLabels={true}
/>`}
          </pre>
        </section>

        <section className="demo-section">
          <h2>Flags Variant</h2>
          <p>Visual flag selector for prominent placement</p>
          <div className="demo-box">
            <LocaleSwitcher
              currentLocale={locale}
              locales={locales}
              onLocaleChange={setLocale}
              variant="flags"
              showLabels={false}
            />
          </div>
          <pre className="code">
{`<LocaleSwitcher
  variant="flags"
  currentLocale={locale}
  locales={locales}
  onLocaleChange={setLocale}
/>`}
          </pre>
        </section>

        <section className="demo-section">
          <h2>Minimal Variant</h2>
          <p>Compact button that cycles through locales</p>
          <div className="demo-box">
            <LocaleSwitcher
              currentLocale={locale}
              locales={locales}
              onLocaleChange={setLocale}
              variant="minimal"
            />
          </div>
          <pre className="code">
{`<LocaleSwitcher
  variant="minimal"
  currentLocale={locale}
  locales={locales}
  onLocaleChange={setLocale}
/>`}
          </pre>
        </section>

        <section className="demo-section">
          <h2>Translation Demo</h2>
          <div className="translation-demo">
            <h3>Welcome to our application!</h3>
            <p>
              This text is automatically translated by Lingo.dev Compiler.
              Try switching locales above to see the magic happen.
            </p>
            <p>Current locale: <strong>{locale}</strong></p>
            <ul>
              <li>Fast and automatic translation</li>
              <li>No manual translation files needed</li>
              <li>Works at build time</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Built with <a href="https://lingo.dev">Lingo.dev</a> •{' '}
          <a href="https://github.com/lingodotdev/lingo.dev">GitHub</a> •{' '}
          <a href="https://lingo.dev/go/discord">Discord</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
