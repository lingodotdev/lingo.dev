import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface Props {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  selectedLanguages,
  onChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggleLanguage = (code: string) => {
    onChange(
      selectedLanguages.includes(code)
        ? selectedLanguages.filter((l) => l !== code)
        : [...selectedLanguages, code],
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedLanguages.map((code) => {
          const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
          return (
            <Badge key={code} variant="secondary" className="gap-1 pr-1">
              {lang?.name ?? code}
              <button onClick={() => toggleLanguage(code)} disabled={disabled}>
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          );
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}
          >
            Select languages
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <CommandItem
                    key={lang.code}
                    value={lang.name}
                    onSelect={() => toggleLanguage(lang.code)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedLanguages.includes(lang.code)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {lang.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({lang.code})
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
