

import { Code } from 'lucide-react';

export default function OriginalCode() {
  const codeExample = `// Your original React component
function Welcome() {
  return (
    <div>
      <h1>Welcome to our platform</h1>
      <p>Get started with zero configuration</p>
      <button>Sign Up Now</button>
    </div>
  );
}`;

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: 12,
      padding: 24,
      border: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Code size={24} color="#667eea" />
        <h3 style={{ margin: 0, fontSize: 18 }}>Original Source Code</h3>
      </div>
      
      <pre style={{
        background: '#0f172a',
        padding: 20,
        borderRadius: 8,
        overflow: 'auto',
        fontSize: 14,
        lineHeight: 1.6,
        color: '#94a3b8'
      }}>
        <code>{codeExample}</code>
      </pre>

      <div style={{
        marginTop: 16,
        padding: 16,
        background: '#0f172a',
        borderRadius: 8,
        borderLeft: '4px solid #10b981'
      }}>
        <p style={{ margin: 0, fontSize: 14, color: '#10b981' }}>
          ✓ No translation keys • ✓ No wrapper components • ✓ Just plain React
        </p>
      </div>
    </div>
  );
}