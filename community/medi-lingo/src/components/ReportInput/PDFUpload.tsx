"use client";

import { useState, useCallback, useRef } from "react";
import { FileUp, FileText, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PDFUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

export function PDFUpload({ onTextExtracted, disabled }: PDFUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      setFileName(file.name);
      setProgress(10);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        setProgress(20);

        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        setProgress(30);

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setProgress(50);

        let fullText = "";
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += pageText + "\n\n";
          setProgress(50 + Math.round((i / totalPages) * 40));
        }

        setProgress(95);

        if (fullText.trim().length === 0) {
          throw new Error(
            "No text could be extracted. This may be an image-based PDF. Try the Image tab instead."
          );
        }

        setProgress(100);
        onTextExtracted(fullText.trim());
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to extract text from PDF";
        setError(errorMessage);
        setFileName(null);
      } finally {
        setIsLoading(false);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [onTextExtracted]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      extractTextFromPDF(file);
    },
    [extractTextFromPDF]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      extractTextFromPDF(file);
    },
    [extractTextFromPDF]
  );

  const clearFile = useCallback(() => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Upload a PDF file
      </label>

      <div
        onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={`
          relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center 
          rounded-xl border-2 border-dashed p-8 text-center transition-all
          ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
          }
          ${disabled || isLoading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={disabled || isLoading}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div className="w-48">
              <Progress value={progress} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Extracting text from PDF...
            </p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10">
              <FileText className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{fileName}</p>
              <p className="text-sm text-emerald-600">Successfully extracted</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <FileUp className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                Drop your PDF here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                PDF files only, max 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
