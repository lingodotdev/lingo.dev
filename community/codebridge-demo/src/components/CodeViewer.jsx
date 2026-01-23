import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Import language support
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";

import { Copy, Check, FileCode } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import TranslationPanel from "./TranslationPanel";
import { extractComments } from "../utils/codeParser";
import { translateComments, translateReadme } from "../services/translator";

function CodeViewer({ file, content }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const { t, language } = useTranslation();

  // Reset translation when file or language changes
  useEffect(() => {
    setTranslatedContent(null);
    setShowOriginal(false);
  }, [file?.path, language]);

  useEffect(() => {
    const displayContent = showOriginal
      ? content
      : translatedContent || content;
    if (codeRef.current && displayContent) {
      try {
        Prism.highlightElement(codeRef.current);
      } catch (error) {
        console.warn("Prism highlighting failed:", error);
      }
    }
  }, [content, translatedContent, showOriginal]);

  const handleCopy = () => {
    const contentToCopy = showOriginal ? content : translatedContent || content;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageFromPath = (path) => {
    if (!path) return "text";
    const ext = path.split(".").pop().toLowerCase();
    const map = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      css: "css",
      html: "html",
      json: "json",
      md: "markdown",
      sh: "bash",
      c: "c",
      cpp: "cpp",
    };
    return map[ext] || "text";
  };

  const fileLanguage = getLanguageFromPath(file?.path);

  const handleTranslate = async () => {
    if (!file || !content || language === "en") {
      alert("Translation is only available for non-English languages");
      return;
    }

    setIsTranslating(true);

    try {
      if (fileLanguage === "markdown") {
        const translated = await translateReadme(content, language);
        setTranslatedContent(translated);
      } else {
        const comments = extractComments(content, fileLanguage);

        if (comments.length === 0) {
          alert("No comments found in this file to translate");
          setIsTranslating(false);
          return;
        }

        const translatedComments = await translateComments(comments, language);
        const { injectTranslations } = await import("../utils/codeParser");
        const translatedCode = injectTranslations(
          content,
          translatedComments,
          fileLanguage,
        );

        setTranslatedContent(translatedCode);
      }
    } catch (error) {
      console.error("Translation failed:", error);
      alert(`Translation failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSummarize = async () => {
    if (!file || !content) {
      alert("No file selected");
      return;
    }

    setIsSummarizing(true);
    setAiSummary(null);

    try {
      const summary = await summarizeCode(
        content,
        fileLanguage,
        language,
        file.path,
      );
      setAiSummary(summary);
    } catch (error) {
      console.error("Summarization failed:", error);
      alert(`Summarization failed: ${error.message}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const displayContent = showOriginal ? content : translatedContent || content;

  // Show placeholder when no file is selected
  if (!file) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4 max-w-md animate-fade-in">
          <div className="flex justify-center">
            <div className="rounded-full bg-orange-500/10 p-6">
              <FileCode className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white">Select a file to view</h2>
          <p className="text-muted-foreground">
            Choose a file from the explorer to see its contents with syntax
            highlighting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* File Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border bg-card/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-auto pr-2 pl-2 items-center justify-center rounded-md bg-orange-500/10 border border-orange-500/20 shrink-0">
            <span className="text-xs font-bold text-orange-500 uppercase">
              {file.path.split(".").pop()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium truncate text-foreground">
              {file.path}
            </h3>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)}KB
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
          title={t("app.viewer.actions.copy")}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {copied
              ? t("app.viewer.actions.copied")
              : t("app.viewer.actions.copy")}
          </span>
        </button>
      </div>

      {/* Translation Panel */}
      <TranslationPanel
        originalContent={content}
        translatedContent={translatedContent}
        onTranslate={handleTranslate}
        isTranslating={isTranslating}
        showOriginal={showOriginal}
        onToggleView={() => setShowOriginal(!showOriginal)}
      />

      {/* Code Content */}
      <div className="flex-1 overflow-auto bg-card/30">
        <pre className="h-full m-0 p-6 text-sm leading-relaxed">
          <code ref={codeRef} className={`language-${fileLanguage}`}>
            {displayContent}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeViewer;
