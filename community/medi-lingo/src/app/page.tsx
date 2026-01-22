"use client";

import { useState, useCallback } from "react";
import { Loader2, Sparkles, RotateCcw, FileText, FileUp, Image } from "lucide-react";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { AnalysisSkeleton } from "@/components/AnalysisSkeleton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ResultsDisplay } from "@/components/Results/ResultsDisplay";
import { TextInput } from "@/components/ReportInput/TextInput";
import { PDFUpload } from "@/components/ReportInput/PDFUpload";
import { ImageUpload } from "@/components/ReportInput/ImageUpload";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import type { MedicalReportAnalysis, InputMethod, AnalyzeResponse } from "@/lib/types";

export default function Home() {
  const [inputMethod, setInputMethod] = useState<InputMethod>("text");
  const [reportText, setReportText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MedicalReportAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (overrideLanguage?: string) => {
    if (!reportText.trim()) {
      setError("Please enter or upload a medical report first.");
      return;
    }

    const languageToUse = overrideLanguage ?? targetLanguage;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportText: reportText.trim(),
          targetLanguage: languageToUse,
        }),
      });

      const data: AnalyzeResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to analyze report");
      }

      setResult(data.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, [reportText, targetLanguage]);

  const handleReset = useCallback(() => {
    setReportText("");
    setResult(null);
    setError(null);
    setInputMethod("text");
  }, []);

  const handleTextExtracted = useCallback((text: string) => {
    setReportText(text);
    setError(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />

      <main className="flex-1">
        {/* Show Hero only when no results */}
        {!result && !isAnalyzing && <Hero />}

        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Input Section */}
          {!result && !isAnalyzing && (
            <Card className="animate-fade-in border-0 shadow-2xl shadow-primary/5">
              <CardContent className="p-6 sm:p-8">
                {/* Tabs for input method */}
                <Tabs
                  value={inputMethod}
                  onValueChange={(v) => setInputMethod(v as InputMethod)}
                  className="w-full"
                >
                  <TabsList className="mb-6 grid w-full grid-cols-3 bg-muted/50">
                    <TabsTrigger
                      value="text"
                      className="flex items-center gap-2 data-[state=active]:bg-background"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Text</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="pdf"
                      className="flex items-center gap-2 data-[state=active]:bg-background"
                    >
                      <FileUp className="h-4 w-4" />
                      <span className="hidden sm:inline">PDF</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="image"
                      className="flex items-center gap-2 data-[state=active]:bg-background"
                    >
                      <Image className="h-4 w-4" />
                      <span className="hidden sm:inline">Image</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-0">
                    <TextInput
                      value={reportText}
                      onChange={setReportText}
                      disabled={isAnalyzing}
                    />
                  </TabsContent>

                  <TabsContent value="pdf" className="mt-0">
                    <PDFUpload
                      onTextExtracted={handleTextExtracted}
                      disabled={isAnalyzing}
                    />
                  </TabsContent>

                  <TabsContent value="image" className="mt-0">
                    <ImageUpload
                      onTextExtracted={handleTextExtracted}
                      disabled={isAnalyzing}
                    />
                  </TabsContent>
                </Tabs>

                {/* Show extracted text preview for PDF/Image */}
                {inputMethod !== "text" && reportText && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">
                        Extracted Text Preview
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReportText("")}
                        className="h-auto py-1 text-xs text-destructive hover:text-destructive"
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto rounded-lg bg-muted/50 p-4">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                        {reportText.slice(0, 500)}
                        {reportText.length > 500 && "..."}
                      </pre>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Language selector and analyze button */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <LanguageSelector
                    value={targetLanguage}
                    onChange={setTargetLanguage}
                    disabled={isAnalyzing}
                  />

                  <Button
                    onClick={() => handleAnalyze()}
                    disabled={isAnalyzing || !reportText.trim()}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-sky-600 font-semibold shadow-lg shadow-primary/25 transition-all hover:from-primary/90 hover:to-sky-600/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Report
                  </Button>
                </div>

                {/* Error message */}
                {error && (
                  <Alert variant="destructive" className="mt-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Loading Skeleton */}
          {isAnalyzing && (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">
                  Analyzing your report and translating...
                </span>
              </div>
              <AnalysisSkeleton />
            </div>
          )}

          {/* Results Section */}
          {result && !isAnalyzing && (
            <div className="space-y-6 animate-fade-in">
              {/* Results header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                  Analysis Results
                </h2>
                <div className="flex items-center gap-3">
                  <LanguageSelector
                    value={targetLanguage}
                    onChange={(lang) => {
                      setTargetLanguage(lang);
                      handleAnalyze(lang);
                    }}
                    disabled={isAnalyzing}
                    compact
                  />
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="shrink-0"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    New Report
                  </Button>
                </div>
              </div>

              {/* Error on re-translation */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Results display */}
              <ResultsDisplay analysis={result} language={targetLanguage} />
            </div>
          )}
        </div>

        {/* Feature highlights - show when no results */}
        {!result && !isAnalyzing && <FeatureHighlights />}
      </main>

      <Footer />
    </div>
  );
}
