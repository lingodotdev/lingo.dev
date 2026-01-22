"use client";

import { useState, useCallback, useRef } from "react";
import { Image, Loader2, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onTextExtracted, disabled }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromImage = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      setFileName(file.name);

      try {
        const Tesseract = await import("tesseract.js");

        const result = await Tesseract.recognize(file, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        const extractedText = result.data.text.trim();

        if (extractedText.length === 0) {
          throw new Error(
            "No text could be extracted. Please ensure the image is clear and contains readable text."
          );
        }

        onTextExtracted(extractedText);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to extract text from image";
        setError(errorMessage);
        setFileName(null);
      } finally {
        setIsLoading(false);
        setProgress(0);
      }
    },
    [onTextExtracted]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      extractTextFromImage(file);
    },
    [extractTextFromImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      extractTextFromImage(file);
    },
    [extractTextFromImage]
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
        Upload an image
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
          accept="image/*"
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
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Extracting text with OCR...
              </p>
              <p className="text-xs text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10">
              <Camera className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{fileName}</p>
              <p className="text-sm text-emerald-600">Text extracted successfully</p>
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
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10">
              <Image className="h-7 w-7 text-violet-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                Drop your image here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, or HEIC, max 10MB
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

      <p className="text-xs text-muted-foreground">
        OCR processing happens locally in your browser. Your images are not
        uploaded to any server.
      </p>
    </div>
  );
}
