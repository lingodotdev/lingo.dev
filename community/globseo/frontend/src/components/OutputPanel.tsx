import { LanguageResultsCard } from '../components/LanguageResultsCard';
import { MetadataQualityScore } from '../components/MetadataQualityScore';
import { SmartRewriteSuggestions } from '../components/SmartRewriteSuggestions';
import { CombinedDataDownload } from '../components/CombinedDataDownload';
import { Sparkles } from 'lucide-react';
import type { Metadata, SEOAnalysis, TranslationResult } from '../services/api';

interface OutputPanelProps {
  showResults: boolean;
  selectedLanguages: string[];
  metadata: Metadata | null;
  seoScore: SEOAnalysis | null;
  translations: TranslationResult;
}

export function OutputPanel({ showResults, selectedLanguages, metadata, seoScore, translations }: OutputPanelProps) {
  if (!showResults) {
    return (
      <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,255,18,0.05),transparent_50%)]"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-white/30 mb-2">
            Generated metadata will appear here
          </p>
          <p className="text-white/20 text-sm">
            Start by entering your content above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl text-white/90 mb-2">
          Generated <span className="text-[#a3ff12]">Results</span>
        </h3>
        <p className="text-white/40 text-base">
          SEO metadata optimized for {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Quality Score and Smart Rewrites Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Quality Score */}
        <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
          <h4 className="text-white/90 tracking-tight text-lg mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3ff12]"></span>
            SEO Quality Analysis
          </h4>
          {metadata && (
            <MetadataQualityScore
              title={metadata.title || ''}
              description={metadata.description || ''}
              keywords={metadata.keywords ? metadata.keywords.split(',').map(k => k.trim()).filter(Boolean) : []}
              seoScore={seoScore}
            />
          )}
        </div>

        {/* Smart Rewrites */}
        <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
          <h4 className="text-white/90 tracking-tight text-lg mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3ff12]"></span>
            Smart Rewrites
          </h4>
          {metadata && (
            <SmartRewriteSuggestions
              originalTitle={metadata.title || ''}
              originalDescription={metadata.description || ''}
              smartRewrites={seoScore?.smart_rewrites}
            />
          )}
        </div>
      </div>

      {/* Combined Data Download - Full Width */}
      <CombinedDataDownload
        selectedLanguages={selectedLanguages}
        metadata={metadata}
        translations={translations}
      />

      {/* Language Translation Cards */}
      <div>
        <div className="mb-4">
          <h4 className="text-white/80 text-sm uppercase tracking-wider">
            Translations ({selectedLanguages.length})
          </h4>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedLanguages.map((language) => (
            <LanguageResultsCard 
              key={language} 
              language={language}
              metadata={metadata}
              seoScore={seoScore}
              translations={translations}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
