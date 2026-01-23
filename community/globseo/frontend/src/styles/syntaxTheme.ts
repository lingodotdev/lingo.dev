import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Custom syntax highlighting theme that matches the GlobSEO website's color scheme
 * Primary colors: #a3ff12 (brand green), #0a0a0a (background), white/XX (opacity variants)
 */
export const customSyntaxTheme = {
  ...vscDarkPlus,
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: '#0a0a0a',
    color: 'rgba(255, 255, 255, 0.8)', // white/80
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: '#0a0a0a',
    padding: '0',
    margin: '0',
    overflow: 'auto',
  },
  
  // Comments - muted white
  comment: { color: 'rgba(255, 255, 255, 0.4)' }, // white/40
  prolog: { color: 'rgba(255, 255, 255, 0.4)' },
  doctype: { color: 'rgba(255, 255, 255, 0.4)' },
  cdata: { color: 'rgba(255, 255, 255, 0.4)' },
  
  // Base syntax - bright white
  punctuation: { color: 'rgba(255, 255, 255, 0.7)' }, // white/70
  
  // Properties - brand green!
  property: { color: '#a3ff12' },
  
  // Tags - brand green for HTML tags like <meta>, <link>
  tag: { color: '#a3ff12', fontWeight: '500' },
  selector: { color: '#92e610' },
  
  // Booleans and numbers - brand green
  boolean: { color: '#a3ff12' },
  number: { color: '#a3ff12' },
  constant: { color: '#a3ff12' },
  symbol: { color: '#a3ff12' },
  
  // Deletion - subtle red
  deleted: { color: 'rgba(255, 123, 114, 0.8)' },
  
  // Attribute names - BRAND GREEN (name, property, content, etc.)
  'attr-name': { color: '#a3ff12', fontWeight: '600' },
  
  // Strings - bright white for attribute values
  string: { color: 'rgba(255, 255, 255, 0.95)' }, // white/95 - brighter for better contrast
  char: { color: 'rgba(255, 255, 255, 0.95)' },
  
  // Built-in - muted white
  builtin: { color: 'rgba(255, 255, 255, 0.7)' },
  inserted: { color: '#92e610' },
  
  // Operators - subtle white
  operator: { color: 'rgba(255, 255, 255, 0.6)' },
  entity: { color: 'rgba(255, 255, 255, 0.8)' },
  url: { color: '#a3ff12' },
  
  // Variables and functions - white with slight opacity
  variable: { color: 'rgba(255, 255, 255, 0.85)' },
  atrule: { color: '#a3ff12' },
  'attr-value': { color: 'rgba(255, 255, 255, 0.95)' }, // Bright white for meta tag values
  function: { color: 'rgba(255, 255, 255, 0.85)' },
  'class-name': { color: '#92e610' },
  
  // Keywords - brand green
  keyword: { color: '#a3ff12', fontWeight: '500' },
  regex: { color: 'rgba(255, 255, 255, 0.8)' },
  important: { color: '#a3ff12', fontWeight: 'bold' },
  
  // Additional HTML/XML specific tokens
  namespace: { color: '#a3ff12' },
  'tag.punctuation': { color: 'rgba(255, 255, 255, 0.6)' }, // < > brackets
};

/**
 * Default custom styles for SyntaxHighlighter component
 */
export const defaultCustomStyle = {
  background: 'transparent',
  padding: 0,
  margin: 0,
  fontSize: '0.75rem',
  lineHeight: '1.5',
};
