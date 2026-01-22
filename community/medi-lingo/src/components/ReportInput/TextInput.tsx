"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedText = e.clipboardData.getData("text");
      if (pastedText) {
        onChange(pastedText);
      }
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="report-text"
          className="text-sm font-medium text-foreground"
        >
          Paste your medical report
        </label>
        {value.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {value.length.toLocaleString()} characters
          </span>
        )}
      </div>
      <div
        className={`relative rounded-xl transition-all ${
          isFocused ? "ring-2 ring-primary/20" : ""
        }`}
      >
        <Textarea
          id="report-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder="Paste your medical report here...

Example:
Hemoglobin: 11.2 g/dL (Normal: 13-17)
WBC: 6,500 cells/mcL
Platelets: 240,000/mcL
Diagnosis: Mild anemia"
          className="min-h-[200px] resize-none rounded-xl border-muted bg-muted/30 font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Tip: You can copy text from PDF viewers or photo apps
      </p>
    </div>
  );
}
