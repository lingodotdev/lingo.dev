"use client";

import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  disabled,
  compact = false,
}: LanguageSelectorProps) {
  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === value);

  return (
    <div className={compact ? "" : "space-y-1.5"}>
      {!compact && (
        <label className="text-sm font-medium text-muted-foreground">
          Translate to
        </label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={`${
            compact ? "w-[180px]" : "w-full sm:w-[280px]"
          } bg-background`}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <SelectValue>
              {selectedLang
                ? `${selectedLang.name} (${selectedLang.nativeName})`
                : "Select language"}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="font-medium">{lang.name}</span>
              <span className="ml-2 text-muted-foreground">
                ({lang.nativeName})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
