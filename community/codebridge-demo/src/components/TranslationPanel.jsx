import { Languages, Download, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";

function TranslationPanel({
  originalContent,
  translatedContent,
  onTranslate,
  isTranslating,
  showOriginal,
  onToggleView,
}) {
  const { language } = useTranslation();

  return (
    <div className="border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm">
          <Languages className="h-4 w-4 text-orange-500" />
          <span className="font-medium text-muted-foreground">
            {translatedContent
              ? `Translated to ${language.toUpperCase()}`
              : "Translation Available"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {translatedContent && (
            <button
              onClick={onToggleView}
              className=" text-white cursor-pointer inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all hover:bg-accent"
              title={showOriginal ? "Show Translation" : "Show Original"}
            >
              {showOriginal ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
              <span>{showOriginal ? "Show Translation" : "Show Original"}</span>
            </button>
          )}

          <button
            onClick={onTranslate}
            disabled={isTranslating}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTranslating ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Languages className="h-3.5 w-3.5" />
                <span>Translate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {translatedContent && showOriginal && (
        <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 text-xs text-orange-500 border-t border-orange-500/20">
          <Languages className="h-3.5 w-3.5" />
          <span>
            Viewing original content. Click "Show Translation" to see translated
            version.
          </span>
        </div>
      )}
    </div>
  );
}

export default TranslationPanel;
