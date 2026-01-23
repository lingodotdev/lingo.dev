import { useState } from 'react';
import { Code2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customSyntaxTheme, defaultCustomStyle } from '../styles/syntaxTheme';

interface SchemaGeneratorProps {
  language: string;
  title: string;
  description: string;
  url: string;
}

interface SchemaGeneratorProps {
  language: string;
  title: string;
  description: string;
  url: string;
}

export function SchemaGenerator({ language, title, description, url }: SchemaGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract domain from URL for organization name
  const getDomain = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'example.com';
    }
  };

  const domain = getDomain(url);
  const organizationName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organizationName,
    "url": url,
    "description": description
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "inLanguage": language.toLowerCase().substring(0, 2),
    "publisher": {
      "@type": "Organization",
      "name": organizationName
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": url
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title.split('|')[0].trim(),
        "item": url
      }
    ]
  };

  const allSchemas = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, webPageSchema, breadcrumbSchema]
  };

  const schemaJSON = JSON.stringify(allSchemas, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded-lg transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#a3ff12]/10 rounded">
            <Code2 className="w-4 h-4 text-[#a3ff12]" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">Schema Markup</span>
            <p className="text-xs text-white/40">Structured data for search engines</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#a3ff12]/10 text-[#a3ff12] border-0 text-xs font-medium">
            JSON-LD
          </Badge>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-1.5 hover:bg-white/10 rounded transition-colors group cursor-pointer"
            title="Copy schema markup"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
            )}
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Schema Preview */}
          <div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-4 overflow-x-auto shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 font-medium">JSON-LD Schema</span>
              <span className="text-xs text-white/30">{schemaJSON.split('\n').length} lines</span>
            </div>
            <SyntaxHighlighter
              language="json"
              style={customSyntaxTheme}
              customStyle={defaultCustomStyle}
              wrapLongLines={false}
            >
              {schemaJSON}
            </SyntaxHighlighter>
          </div>

          {/* Implementation Instructions */}
          <div className="bg-gradient-to-r from-[#a3ff12]/10 via-[#a3ff12]/5 to-transparent border border-[#a3ff12]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="px-2 py-1 bg-[#a3ff12]/20 rounded-lg">
                <Code2 className="w-4 h-4 text-[#a3ff12]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#a3ff12] mb-2">How to implement</p>
                <p className="text-xs text-white/80 leading-relaxed">
                  Copy this JSON-LD schema and place it in the <code className="px-1.5 py-0.5 bg-[#a3ff12]/20 rounded text-[#a3ff12]">&lt;head&gt;</code> section of your HTML document. This structured data helps search engines better understand your page content and can enhance your search results with rich snippets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
