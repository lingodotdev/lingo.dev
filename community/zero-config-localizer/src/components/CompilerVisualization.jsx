import { useState } from 'react';
import { Play, CheckCircle, Loader } from 'lucide-react';

export default function CompilerVisualization() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Parse JSX to AST',
      description: 'Babel parses your React code into an Abstract Syntax Tree',
      code: '<h1>Welcome</h1>',
      output: '{ type: "JSXElement", children: [{ type: "JSXText", value: "Welcome" }] }'
    },
    {
      id: 2,
      title: 'Detect Translatable Content',
      description: 'AI analyzes AST nodes and filters out technical identifiers',
      code: 'JSXText: "Welcome"',
      output: '✓ Translatable: "Welcome" (user-facing text)'
    },
    {
      id: 3,
      title: 'Generate Fingerprint',
      description: 'Creates unique hash for caching and version tracking',
      code: '"Welcome"',
      output: 'fingerprint: "a1b2c3d4e5f6"'
    },
    {
      id: 4,
      title: 'Call Translation API',
      description: 'Sends content to AI with context for accurate translation',
      code: '{ text: "Welcome", context: "h1 heading" }',
      output: '{ es: "Bienvenido", fr: "Bienvenue", de: "Willkommen" }'
    },
    {
      id: 5,
      title: 'Inject Translation Lookup',
      description: 'Transforms JSX to use optimized translation function',
      code: '<h1>Welcome</h1>',
      output: '<h1>{t("a1b2c3d4e5f6")}</h1>'
    },
    {
      id: 6,
      title: 'Build Optimized Bundles',
      description: 'Creates separate bundles for each language',
      code: 'Building...',
      output: '✓ en.bundle.js (12kb)\n✓ es.bundle.js (13kb)\n✓ fr.bundle.js (13kb)'
    }
  ];

  const runAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ fontSize: 32, margin: 0 }}>Compiler Process Visualization</h2>
        <button
          onClick={runAnimation}
          disabled={isAnimating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: isAnimating ? '#334155' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: 8,
            color: 'white',
            fontSize: 16,
            fontWeight: 600,
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            opacity: isAnimating ? 0.6 : 1
          }}
        >
          {isAnimating ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={18} />}
          {isAnimating ? 'Running...' : 'Run Build Process'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          
          return (
            <div
              key={step.id}
              style={{
                background: isActive ? '#1e293b' : '#0f172a',
                border: `2px solid ${isActive ? '#667eea' : isComplete ? '#10b981' : '#334155'}`,
                borderRadius: 12,
                padding: 24,
                opacity: index > currentStep ? 0.5 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isComplete ? '#10b981' : isActive ? '#667eea' : '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  {isComplete ? <CheckCircle size={20} /> : step.id}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 16 }}>{step.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>INPUT</div>
                      <pre style={{
                        background: '#0f172a',
                        padding: 12,
                        borderRadius: 6,
                        fontSize: 13,
                        color: '#94a3b8',
                        margin: 0,
                        overflow: 'auto'
                      }}>
                        {step.code}
                      </pre>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>OUTPUT</div>
                      <pre style={{
                        background: '#0f172a',
                        padding: 12,
                        borderRadius: 6,
                        fontSize: 13,
                        color: '#10b981',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto'
                      }}>
                        {step.output}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
