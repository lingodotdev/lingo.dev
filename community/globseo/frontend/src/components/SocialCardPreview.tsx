import { useState } from "react";
import {
  Monitor,
  Share2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customSyntaxTheme, defaultCustomStyle } from '../styles/syntaxTheme';

interface SocialCardPreviewProps {
  language: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export function SocialCardPreview({
  language,
  title,
  description,
  url,
  imageUrl,
}: SocialCardPreviewProps) {
  const [previewType, setPreviewType] = useState<
    "twitter" | "facebook" | "linkedin"
  >("twitter");
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const getLanguageFlag = (lang: string) => {
    const flags: Record<string, string> = {
      English: '🇬🇧',
      Spanish: '🇪🇸',
      French: '🇫🇷',
      German: '🇩🇪',
      Japanese: '🇯🇵',
      Chinese: '🇨🇳',
      Portuguese: '🇵🇹',
      Italian: '🇮🇹',
      Russian: '🇷🇺',
      Ukrainian: '🇺🇦',
      Belarusian: '🇧🇾',
      Hindi: '🇮🇳',
      Arabic: '🇸🇦',
      Bulgarian: '🇧🇬',
      Czech: '🇨🇿',
      Welsh: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      Dutch: '🇳🇱',
      Polish: '🇵🇱',
      Indonesian: '🇮🇩',
      Icelandic: '🇮🇸',
      Malay: '🇲🇾',
      Finnish: '🇫🇮',
      Basque: '🏴',
      Croatian: '🇭🇷',
      Hebrew: '🇮🇱',
      Khmer: '🇰🇭',
      Latvian: '🇱🇻',
      Lithuanian: '🇱🇹',
      Norwegian: '🇳🇴',
      Korean: '🇰🇷',
      Urdu: '🇵🇰',
      Vietnamese: '🇻🇳',
      Turkish: '🇹🇷',
      Tamil: '🇮🇳',
      Serbian: '🇷🇸',
      Hungarian: '🇭🇺',
      Estonian: '🇪🇪',
      Greek: '🇬🇷',
      Danish: '🇩🇰',
      Azerbaijani: '🇦🇿',
      Thai: '🇹🇭',
      Swedish: '🇸🇪',
      Catalan: '🏴',
      Kazakh: '🇰🇿',
      Romanian: '🇷🇴',
      Slovak: '🇸🇰',
      Swahili: '🇰🇪',
      Persian: '🇮🇷',
      Punjabi: '🇮🇳',
      Bengali: '🇧🇩',
      Irish: '🇮🇪',
      Galician: '�',
      Maltese: '🇲�🇹',
      Slovenian: '🇸🇮',
      Albanian: '🇦🇱',
      Afrikaans: '🇿🇦',
      Uzbek: '🇺🇿',
      Somali: '🇸🇴',
      Tigrinya: '🇪🇷',
      Tagalog: '🇵🇭',
      Telugu: '🇮🇳',
      Kinyarwanda: '🇷🇼',
      Georgian: '🇬🇪',
      Malayalam: '🇮🇳',
      Armenian: '🇦🇲',
      Macedonian: '🇲🇰',
    };
    return flags[lang] || "🌐";
  };

  // Extract domain and username from URL
  const getDomain = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return "example.com";
    }
  };

  const domain = getDomain(url);
  const twitterHandle = `@${domain.split(".")[0]}`;

  // Generate platform-specific meta tags
  const getMetaTags = () => {
    const finalImageUrl = imageUrl || `${url}/og-image.jpg`;

    switch (previewType) {
      case "twitter":
        return `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="${twitterHandle}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${finalImageUrl}">`;

      case "facebook":
        return `<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${finalImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`;

      case "linkedin":
        return `<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${finalImageUrl}">`;

      default:
        return "";
    }
  };

  const handleCopyMetaTags = () => {
    navigator.clipboard.writeText(getMetaTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Platform-specific character limits
  const getPlatformLimits = () => {
    switch (previewType) {
      case "twitter":
        return { title: 70, description: 200 };
      case "facebook":
        return { title: 95, description: 300 };
      case "linkedin":
        return { title: 200, description: 300 };
      default:
        return { title: 70, description: 200 };
    }
  };

  const limits = getPlatformLimits();
  const truncatedTitle =
    title.length > limits.title
      ? title.substring(0, limits.title) + "..."
      : title;
  const truncatedDescription =
    description.length > limits.description
      ? description.substring(0, limits.description) + "..."
      : description;

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded-lg transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 rounded">
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">
              Social Preview
            </span>
            <p className="text-xs text-white/40">
              Platform-specific card previews
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/10 text-purple-400 border-0 text-xs font-medium">
            {previewType.charAt(0).toUpperCase() + previewType.slice(1)}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4"></div>
          {/* Platform Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewType("twitter")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                previewType === "twitter"
                  ? "scale-105 shadow-lg"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 hover:scale-[1.02]"
              }`}
              style={previewType === "twitter" ? { backgroundColor: '#000000', color: '#ffffff' } : {}}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </button>
            <button
              onClick={() => setPreviewType("facebook")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                previewType === "facebook"
                  ? "scale-105 shadow-lg"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 hover:scale-[1.02]"
              }`}
              style={previewType === "facebook" ? { backgroundColor: '#1877F2', color: '#ffffff' } : {}}
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </button>
            <button
              onClick={() => setPreviewType("linkedin")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                previewType === "linkedin"
                  ? "scale-105 shadow-lg"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 hover:scale-[1.02]"
              }`}
              style={previewType === "linkedin" ? { backgroundColor: '#0A66C2', color: '#ffffff' } : {}}
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </button>
          </div>

          {/* Preview Card */}
          <div className="bg-[#0a0a0a] rounded-lg border border-white/10 overflow-hidden shadow-lg">
            {/* Image Preview - Reduced size */}
            <div className="aspect-[2.5/1] bg-gradient-to-br from-white/5 to-white/[0.02] relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
              {!imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center mx-auto mb-3 border border-purple-500/20">
                      <Monitor className="w-8 h-8 text-purple-400/60" />
                    </div>
                    <div className="text-lg font-semibold text-white/30 mb-1">
                      {domain}
                    </div>
                    {previewType === "twitter" && (
                      <div className="text-sm text-white/20">
                        {twitterHandle}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Platform-specific badge */}
              <div className="absolute top-3 right-3">
                <Badge
                  className={`text-xs font-medium ${
                    previewType === "twitter"
                      ? "bg-[#1DA1F2] text-white border-0"
                      : previewType === "facebook"
                      ? "bg-[#1877F2] text-white border-0"
                      : "bg-[#0A66C2] text-white border-0"
                  } shadow-lg`}
                >
                  {previewType === "twitter"
                    ? "𝕏"
                    : previewType === "facebook"
                    ? "f"
                    : "in"}
                </Badge>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-2.5">
              <div className="text-xs text-white/40 font-medium uppercase tracking-wide">
                {domain}
              </div>
              <div className="text-base font-semibold text-white/90 line-clamp-2 leading-snug">
                {truncatedTitle}
              </div>
              <div className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                {truncatedDescription}
              </div>

              {/* Platform-specific metadata */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="text-xs text-white/30">
                  {previewType === "twitter" &&
                    `${truncatedTitle.length}/${limits.title} • ${truncatedDescription.length}/${limits.description}`}
                  {previewType === "facebook" && "Link Preview"}
                  {previewType === "linkedin" && "Article Preview"}
                </div>
                <div className="text-xs text-white/20">
                  {getLanguageFlag(language)}
                </div>
              </div>
            </div>
          </div>

          {/* Social Meta Tags */}
          <div className="bg-gradient-to-r from-white/5 via-white/[0.02] to-transparent rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-transparent">
                  {previewType === "twitter" && (
                    <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {previewType === "facebook" && <Facebook className="w-5 h-5 text-white/80" />}
                  {previewType === "linkedin" && <Linkedin className="w-5 h-5 text-white/80" />}
                </div>
                <div className="text-sm font-medium text-white">
                  Meta Tags for{" "}
                  {previewType.charAt(0).toUpperCase() + previewType.slice(1)}
                </div>
              </div>
              <button
                onClick={handleCopyMetaTags}
                className="p-1.5 rounded transition-colors group cursor-pointer hover:bg-white/10"
                title="Copy meta tags"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#a3ff12]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
                )}
              </button>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg p-3 overflow-x-auto border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 font-medium">
                  Generated Tags
                </span>
                <span className="text-xs text-white/30">
                  {getMetaTags().split("\n").length} tags
                </span>
              </div>
              <SyntaxHighlighter
                language="html"
                style={customSyntaxTheme}
                customStyle={defaultCustomStyle}
                wrapLongLines={false}
              >
                {getMetaTags()}
              </SyntaxHighlighter>
            </div>
            <div className="space-y-5 p-1.5"></div>
            {/* Character count warnings */}
            <div className="mt-3 space-y-1.5">
              {title.length > limits.title && (
                <div className="text-xs text-orange-400 flex items-center gap-1.5 bg-orange-500/10 rounded px-2 py-1.5 border border-orange-500/20">
                  <span>⚠</span>
                  <span>
                    Title exceeds {previewType} limit ({title.length}/
                    {limits.title} chars)
                  </span>
                </div>
              )}
              {description.length > limits.description && (
                <div className="text-xs text-orange-400 flex items-center gap-1.5 bg-orange-500/10 rounded px-2 py-2 border border-orange-500/20">
                  <span>⚠</span>
                  <span>
                    Description exceeds {previewType} limit (
                    {description.length}/{limits.description} chars)
                  </span>
                </div>
              )}
              {title.length <= limits.title &&
                description.length <= limits.description && (
                  <div className="text-xs text-[#a3ff12] flex items-center gap-1.5 bg-[#a3ff12]/10 rounded px-2 py-2 border border-[#a3ff12]/20">
                    <span>✓</span>
                    <span>
                      All content within {previewType} character limits
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
