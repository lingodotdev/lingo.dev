import { useState } from 'react';
import { Code, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';

import { useLingoLocale, setLingoLocale } from 'lingo.dev/react/client';

import CompilerVisualization from './components/CompilerVisualization';
import BundleComparison from './components/BundleComparison';
import CodeInspector from './components/CodeInspector';
import OriginalCode from './components/OriginalCode';

/**
 * App
 *
 * Root demo application showcasing zero-config localization
 * using lingo.dev in a React environment.
 */
function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const currentLocale = useLingoLocale();

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: 20,
            marginBottom: 20
          }}>
            <Zap size={16} />
            {/* No t() function - text is auto-translated! */}
            <span>Zero-Config Translation</span>
          </div>
          
          <h1 style={{ fontSize: 48, fontWeight: 700, margin: '0 0 16px 0' }}>
            Lingo.dev Compiler Demo
          </h1>
          
          <p style={{ fontSize: 20, opacity: 0.9, maxWidth: 600, margin: '0 auto 24px' }}>
            Translate React apps without changing a single line of code
          </p>

          {/* Language Switcher - Using setLingoLocale */}
          <select
             value={currentLocale ?? ''}
            onChange={(e) => setLingoLocale(e.target.value)}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              background: 'white',
              color: '#0f172a'
            }}
          >
            {!currentLocale && <option value="" disabled>Loading locale…</option>}
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
        </div>
      </header>

      {/* Navigation - NO translation functions needed! */}
      <nav style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '0 24px'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'compiler', label: 'Compiler Process', icon: Code },
            { id: 'comparison', label: 'Bundle Size', icon: ArrowRight },
            { id: 'inspector', label: 'Code Transform', icon: CheckCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 24px',
                background: activeTab === tab.id ? '#334155' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #667eea' : '2px solid transparent',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 500
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}>
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'compiler' && <CompilerVisualization />}
        {activeTab === 'comparison' && <BundleComparison />}
        {activeTab === 'inspector' && <CodeInspector />}
      </main>
    </div>
  );
}

function OverviewSection() {
  return (
    <div>
      <h2 style={{ fontSize: 32, marginBottom: 24 }}>
        How Lingo.dev Compiler Works
      </h2>

      <div style={{ display: 'grid', gap: 24, marginBottom: 40 }}>
        <FeatureCard
          number="1"
          title="Write Normal React Code"
          description="No i18n libraries, no translation keys, no wrapper components. Just write React like you always do."
        />
        <FeatureCard
          number="2"
          title="Configure Once"
          description="Add Lingo.dev to your build config. Specify source and target languages. That's it."
        />
        <FeatureCard
          number="3"
          title="Build & Deploy"
          description="Run your build command. Lingo.dev automatically detects, translates, and bundles all text. No code changes needed."
        />
      </div>

      <h3 style={{ fontSize: 24, marginBottom: 16 }}>
        Live Example: This Entire Page
      </h3>
      
      <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 24 }}>
        Everything you're reading right now will be translated automatically by Lingo.dev Compiler. 
        The source code contains only English text. Try switching languages above!
      </p>

      <OriginalCode />
    </div>
  );
}

function FeatureCard({ number, title, description }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: 12,
      padding: 24,
      border: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 700,
          flexShrink: 0
        }}>
          {number}
        </div>
        <div>
          <h4 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h4>
          <p style={{ opacity: 0.8, margin: 0 }}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default App;