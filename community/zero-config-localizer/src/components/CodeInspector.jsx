import { useState } from 'react';
import { Code, ArrowRight } from 'lucide-react';

export default function CodeInspector() {
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    {
      title: 'Simple Component',
      before: `function Welcome() {
  return <h1>Welcome to our app</h1>;
}`,
      after: `function Welcome() {
  return <h1>{t('a1b2c3d4e5f6')}</h1>;
}

// Translation dictionary auto-generated:
// { a1b2c3d4e5f6: {
//   en: "Welcome to our app",
//   es: "Bienvenido a nuestra aplicación",
//   fr: "Bienvenue dans notre application"
// }}`
    },
    {
      title: 'Dynamic Content',
      before: `function Greeting({ name }) {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>You have 5 new messages</p>
    </div>
  );
}`,
      after: `function Greeting({ name }) {
  return (
    <div>
      <h2>{t('x1y2z3w4', { name })}</h2>
      <p>{t('a5b6c7d8')}</p>
    </div>
  );
}

// x1y2z3w4: "Hello, {name}!"
// a5b6c7d8: "You have 5 new messages"
// Variables {name} preserved in all languages`
    },
    {
      title: 'Complex Nesting',
      before: `function ProductCard({ product }) {
  return (
    <article>
      <h3>{product.name}</h3>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <button>Add to Cart</button>
    </article>
  );
}`,
      after: `function ProductCard({ product }) {
  return (
    <article>
      <h3>{product.name}</h3>
      <p>
        <strong>{t('m1n2o3p4')}</strong> ${product.price}
      </p>
      <button>{t('q5r6s7t8')}</button>
    </article>
  );
}

// Semantic grouping maintained
// Technical data (name, price) unchanged`
    }
  ];

  return (
    <div>
      <h2 style={{ fontSize: 32, marginBottom: 24 }}>Code Transformation Inspector</h2>
      
      <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 32 }}>
        See how Lingo.dev Compiler transforms your React components during the build process. 
        Your source code remains unchanged—transformations happen transparently.
      </p>

      {/* Example Selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setSelectedExample(index)}
            style={{
              padding: '12px 20px',
              background: selectedExample === index ? '#667eea' : '#1e293b',
              border: `1px solid ${selectedExample === index ? '#667eea' : '#334155'}`,
              borderRadius: 8,
              color: 'white',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Code Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center' }}>
        {/* Before */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12
          }}>
            <Code size={18} />
            <h3 style={{ margin: 0, fontSize: 16 }}>Your Source Code</h3>
          </div>
          <pre style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 12,
            padding: 20,
            fontSize: 13,
            lineHeight: 1.6,
            color: '#94a3b8',
            overflow: 'auto',
            margin: 0
          }}>
            <code>{examples[selectedExample].before}</code>
          </pre>
        </div>

        {/* Arrow */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ArrowRight size={24} />
        </div>

        {/* After */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12
          }}>
            <Code size={18} />
            <h3 style={{ margin: 0, fontSize: 16 }}>Compiled Output</h3>
          </div>
          <pre style={{
            background: '#1e293b',
            border: '1px solid #10b981',
            borderRadius: 12,
            padding: 20,
            fontSize: 13,
            lineHeight: 1.6,
            color: '#10b981',
            overflow: 'auto',
            margin: 0
          }}>
            <code>{examples[selectedExample].after}</code>
          </pre>
        </div>
      </div>

      {/* Key Points */}
      <div style={{
        marginTop: 32,
        background: '#1e293b',
        borderRadius: 12,
        padding: 24,
        border: '1px solid #334155'
      }}>
        <h4 style={{ fontSize: 18, marginBottom: 16 }}>Key Transformation Points</h4>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>User-facing text replaced with <code>t()</code> function calls</li>
          <li>Unique fingerprints generated for each translatable string</li>
          <li>Dynamic variables like <code>{'{name}'}</code> preserved in all languages</li>
          <li>Technical identifiers (props, variables) remain unchanged</li>
          <li>Component structure and logic completely preserved</li>
        </ul>
      </div>
    </div>
  );
}