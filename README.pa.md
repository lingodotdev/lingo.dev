packages/cli/README.md

import React from "react";

export default function ReadmePa() {
  return (
    <div className="prose max-w-4xl mx-auto p-6">
      <div className="text-center">
        <a href="https://lingo.dev">
          <img
            src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
            alt="Lingo.dev"
            style={{ width: "100%" }}
          />
        </a>

        <p className="mt-4 font-semibold text-lg">
          ⚡ Lingo.dev - ਖੁੱਲ੍ਹਾ ਸਰੋਤ, AI-ਚਲਿਤ i18n ਟੂਲਕਿਟ ਜੋ LLMs ਨਾਲ ਤੁਰੰਤ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਲਈ।
        </p>

        <p className="mt-2">
          <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
          <a href="https://lingo.dev/cli"> Lingo.dev CLI</a> •
          <a href="https://lingo.dev/ci"> Lingo.dev CI/CD</a> •
          <a href="https://lingo.dev/sdk"> Lingo.dev SDK</a>
        </p>
      </div>

      <hr />

      <h2>ਕੰਪਾਈਲਰ ਨਾਲ ਮਿਲੋ 🆕</h2>
      <p>
        <strong>Lingo.dev Compiler</strong> ਇੱਕ ਮੁਫ਼ਤ, ਖੁੱਲ੍ਹਾ ਸਰੋਤ ਕੰਪਾਈਲਰ ਮਿਡਲਵੇਅਰ ਹੈ, ਜੋ ਕਿਸੇ ਵੀ React ਐਪ ਨੂੰ ਬਿਨਾਂ ਮੌਜੂਦਾ React ਕੰਪੋਨੈਂਟਸ ਵਿੱਚ ਕੋਈ ਬਦਲਾਅ ਕੀਤੇ ਬਿਲਡ ਸਮੇਂ 'ਤੇ ਬਹੁਭਾਸ਼ੀ ਬਣਾਉਣ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਗਿਆ ਹੈ।
      </p>

      <h3>ਇੱਕ ਵਾਰੀ ਇੰਸਟਾਲ ਕਰੋ:</h3>
      <pre>
        <code>npm install lingo.dev</code>
      </pre>

      <h3>ਆਪਣੀ ਬਿਲਡ ਕਾਨਫਿਗ ਵਿੱਚ ਸੋਚ ਕਰੋ:</h3>
      <pre>
        <code>
{`import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);`}
        </code>
      </pre>

      <p>ਕਿਰਿਆ ਕਰੋ <code>next build</code> ਅਤੇ ਵੇਖੋ ਕਿ ਸਪੇਨੀ ਅਤੇ ਫਰਾਂਸੀਸੀ ਬੰਡਲ ਕਿਸੇ ਜਾਦੂ ਵਾਂਗ ਨਿਕਲਦੇ ਹਨ ✨</p>

      <p>
        ਪੂਰੀ ਮਾਰਗਦਰਸ਼ਕ ਲਈ <a href="https://lingo.dev/compiler">ਡੌਕਸ ਪੜੋ →</a> ਅਤੇ ਆਪਣੀ ਸੈਟਅਪ ਵਿੱਚ ਮਦਦ ਲਈ <a href="https://lingo.dev/go/discord">ਸਾਡੀ Discord</a> ਵਿੱਚ ਸ਼ਾਮਿਲ ਹੋਵੋ।
      </p>

      <hr />

      <h3>ਇਸ ਰਿਪੋ ਵਿੱਚ ਕੀ ਹੈ?</h3>
      <table>
        <thead>
          <tr>
            <th>ਟੂਲ</th>
            <th>ਸੰਖੇਪ</th>
            <th>ਡੌਕ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Compiler</strong></td>
            <td>ਬਿਲਡ-ਟਾਈਮ React ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ</td>
            <td><a href="https://lingo.dev/compiler">/compiler</a></td>
          </tr>
          <tr>
            <td><strong>CLI</strong></td>
            <td>ਇੱਕ ਕਮਾਂਡ ਨਾਲ ਵੈਬ ਅਤੇ ਮੋਬਾਈਲ ਐਪ, JSON, YAML, markdown ਆਦਿ ਦੀ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ</td>
            <td><a href="https://lingo.dev/cli">/cli</a></td>
          </tr>
          <tr>
            <td><strong>CI/CD</strong></td>
            <td>ਹਰ ਪুশ 'ਤੇ ਆਟੋ-ਕਮਿੱਟ ਅਨੁਵਾਦ ਅਤੇ ਲੋੜ ਹੋਣ 'ਤੇ ਪુલ-ਰਿਕਵੈਸਟ ਬਣਾਓ</td>
            <td><a href="https://lingo.dev/ci">/ci</a></td>
          </tr>
          <tr>
            <td><strong>SDK</strong></td>
            <td>ਯੂਜ਼ਰ-ਤਿਆਰ ਕੀਤੇ ਸਮੱਗਰੀ ਲਈ ਰੀਅਲਟਾਈਮ ਅਨੁਵਾਦ</td>
            <td><a href="https://lingo.dev/sdk">/sdk</a></td>
          </tr>
        </tbody>
      </table>

      <p>ਹੇਠਾਂ ਹਰ ਇਕ ਲਈ ਤੁਰੰਤ ਸਰਲ ਨੁਕਤੇ ਦਿੱਤੇ ਗਏ ਹਨ 👇</p>

      <hr />

      <h3>⚡️ Lingo.dev CLI</h3>
      <p>ਸਿੱਧਾ ਆਪਣੇ ਟਰਮੀਨਲ ਤੋਂ ਕੋਡ ਅਤੇ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰੋ।</p>
      <pre>
        <code>npx lingo.dev@latest run</code>
      </pre>
      <p>
        ਇਹ ਹਰ ਸਤਰ (string) ਦਾ ਫਿੰਗਰਪ੍ਰਿੰਟ ਬਣਾਉਂਦਾ ਹੈ, ਨਤੀਜਿਆਂ ਨੂੰ ਕੈਸ਼ ਕਰਦਾ ਹੈ, ਅਤੇ ਕੇਵਲ ਉਹੀ ਦੁਬਾਰਾ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ ਜੋ ਬਦਲਿਆ ਹੈ।
      </p>

      <p>
        ਸੈਟਅਪ ਸਿੱਖਣ ਲਈ <a href="https://lingo.dev/cli">ਡੌਕਸ ਪੜੋ →</a>
      </p>

      <hr />

      <h3>🔄 Lingo.dev CI/CD</h3>
      <p>ਆਟੋਮੈਟਿਕ ਤੌਰ 'ਤੇ ਠੀਕ ਅਨੁਵਾਦ ਜਾਣਦਾ-ਪਹੁੰਚ ਕਰੋ।</p>

      <pre>
        <code>
{`# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}`}
        </code>
      </pre>

      <p>
        ਇਹ ਤੁਹਾਡੇ ਰਿਪੋ ਨੂੰ ਹਰਾ ਰੱਖਦਾ ਹੈ ਅਤੇ ਤੁਹਾਡੇ ਪ੍ਰੋਡਕਟ ਨੂੰ ਮੈਨੂਅਲ ਕਦਮਾਂ ਤੋਂ ਬਿਨਾਂ ਬਹੁਭਾਸ਼ੀ ਬਣਾਉਂਦਾ ਹੈ।
      </p>

      <p>
        <a href="https://lingo.dev/ci">ਡੌਕਸ ਪੜੋ →</a>
      </p>

      <hr />

      <h3>🧩 Lingo.dev SDK</h3>
      <p>ਡਾਇਨਾਮਿਕ ਸਮੱਗਰੀ ਲਈ ਪ੍ਰਤੀ-ਰਿਕਵੈਸਟ ਤਤਕਾਲ ਅਨੁਵਾਦ।</p>

      <pre>
        <code>
{`import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }`}
        </code>
      </pre>

      <p>ਚੈਟ, ਯੂਜ਼ਰ ਕਮੈਂਟ ਅਤੇ ਹੋਰ ਰੀਅਲ-ਟਾਈਮ ਫਲੋਜ਼ ਲਈ ਬਹੁਤ ਵਧੀਆ।</p>

      <p>
        <a href="https://lingo.dev/sdk">ਡੌਕਸ ਪੜੋ →</a>
      </p>

      <hr />

      <h3>🤝 ਕਮਿਊਨਿਟੀ</h3>
      <p>ਅਸੀਂ ਕਮਿਊਨਿਟੀ-ਚਲਿਤ ਹਾਂ ਅਤੇ ਯੋਗਦਾਨ ਪਸੰਦ ਕਰਦੇ ਹਾਂ!</p>
      <ul>
        <li>ਕੋਈ ਵਿਚਾਰ ਹੈ? <a href="https://github.com/lingodotdev/lingo.dev/issues">ਇਸ਼ੂ ਖੋਲ੍ਹੋ</a></li>
        <li>ਕੁਝ ਠੀਕ ਕਰਨਾ ਹੈ? <a href="https://github.com/lingodotdev/lingo.dev/pulls">PR ਭੇਜੋ</a></li>
        <li>ਮਦਦ ਚਾਹੀਦੀ ਹੈ? <a href="https://lingo.dev/go/discord">ਸਾਡੀ Discord ਵਿੱਚ ਸ਼ਾਮਿਲ ਹੋਵੋ</a></li>
      </ul>

      <h3>⭐ ਸਟਾਰ ਇਤਿਹਾਸ</h3>
      <p>
        ਜੇ ਤੁਹਾਨੂੰ ਸਾਡਾ ਕੰਮ ਪਸੰਦ ਆਇਆ, ਤਾਂ ਸਾਨੂੰ ਇੱਕ ⭐ ਦਿਓ ਅਤੇ ਸਾਨੂੰ 4,000 ਸਟਾਰਾਂ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਮਦਦ ਕਰੋ! 🌟
      </p>

      <div>
        <a href="https://www.star-history.com/#lingodotdev/lingo.dev&Date">
          <img src="https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date" alt="Star History Chart" />
        </a>
      </div>

      <h3>🌐 ਹੋਰ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਰੀਡਮੀ</h3>
      <p>
        English • 中文 • 日本語 • 한국어 • Español • Français • Русский • Українська • Deutsch • Italiano • العربية • עברית • हिन्दी • বাংলা • فارسی
      </p>

      <p>
        ਆਪਣੀ ਭਾਸ਼ਾ ਨਹੀਂ ਦੇਖੀ? <code>i18n.json</code> ਵਿੱਚ ਉਹ ਸ਼ਾਮਿਲ ਕਰੋ ਅਤੇ ਇੱਕ PR ਖੋਲ੍ਹੋ!
      </p>
    </div>
  );
}
