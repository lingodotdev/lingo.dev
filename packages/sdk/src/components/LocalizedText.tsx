import React from 'react';
import { useScriptStyle } from '../hooks/useScriptStyle';

interface LocalizedTextProps {
  locale: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function LocalizedText({ locale, children, className = '', style = {} }: LocalizedTextProps) {
  const { style: scriptStyle } = useScriptStyle(locale);

  return (
    <div className={className} style={{ ...scriptStyle, ...style }}>
      {children}
    </div>
  );
}

interface LocalizedContentProps {
  locale: string;
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

export function LocalizedContent({ locale, html, className = '', style = {} }: LocalizedContentProps) {
  const { style: scriptStyle } = useScriptStyle(locale);

  return (
    <div 
      className={className} 
      style={{ ...scriptStyle, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}