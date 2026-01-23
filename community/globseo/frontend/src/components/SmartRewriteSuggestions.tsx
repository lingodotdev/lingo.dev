import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import type { SmartRewrites } from "../services/api";

interface SmartRewriteSuggestionsProps {
  originalTitle: string;
  originalDescription: string;
  smartRewrites?: SmartRewrites | null;
}

export function SmartRewriteSuggestions({ smartRewrites }: SmartRewriteSuggestionsProps) {
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);
  const hasSuggestions = smartRewrites && (smartRewrites.title_variations.length > 0 || smartRewrites.description_variations.length > 0);
  const titleSuggestions = smartRewrites?.title_variations || [];
  const descriptionSuggestions = smartRewrites?.description_variations || [];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuggestion(id);
    setTimeout(() => setCopiedSuggestion(null), 2000);
  };

  if (!hasSuggestions) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-white/20" />
        </div>
        <p className="text-white/40 text-sm">AI-powered rewrites will appear here</p>
        <p className="text-white/30 text-xs mt-1">Analyze a URL to get smart suggestions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {titleSuggestions.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-white/50">Title Variations</label>
          <br />
          <div className="space-y-2">
            {titleSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 bg-[#0a0a0a] rounded-lg p-3 border border-white/5 hover:border-[#a3ff12]/30 transition-colors group">
                <div className="flex-1">
                  <p className="text-sm text-white/80 leading-relaxed">{suggestion}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/40">{suggestion.length} chars</span>
                    {suggestion.length >= 50 && suggestion.length <= 60 && (<span className="text-xs text-[#a3ff12]">✓ Optimal length</span>)}
                  </div>
                </div>
                <button onClick={() => handleCopy(suggestion, `title-${index}`)} className="p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                  {copiedSuggestion === `title-${index}` ? (<Check className="w-3.5 h-3.5 text-[#a3ff12]" />) : (<Copy className="w-3.5 h-3.5 text-white/40" />)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {descriptionSuggestions.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-white/50">Description Variations</label>
          <br />
          <div className="space-y-2">
            {descriptionSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 bg-[#0a0a0a] rounded-lg p-3 border border-white/5 hover:border-[#a3ff12]/30 transition-colors group">
                <div className="flex-1">
                  <p className="text-sm text-white/70 leading-relaxed">{suggestion}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/40">{suggestion.length} chars</span>
                    {suggestion.length >= 120 && suggestion.length <= 155 && (<span className="text-xs text-[#a3ff12]">✓ Optimal length</span>)}
                  </div>
                </div>
                <button onClick={() => handleCopy(suggestion, `desc-${index}`)} className="p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                  {copiedSuggestion === `desc-${index}` ? (<Check className="w-3.5 h-3.5 text-[#a3ff12]" />) : (<Copy className="w-3.5 h-3.5 text-white/40" />)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
