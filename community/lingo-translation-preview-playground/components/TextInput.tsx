import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled }: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="source-text">Source Text (English)</Label>
      <Textarea
        id="source-text"
        rows={14}
        className="resize-none text-base flex-1 min-h-[300px]"
        placeholder="Enter marketing copy, UI strings, or any text to preview..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className="text-xs text-muted-foreground text-right">
        {value.length} characters
      </div>
    </div>
  );
}
