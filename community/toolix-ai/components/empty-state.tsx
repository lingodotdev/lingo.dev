import {
  Bot,
  MapPin,
  Calculator,
  Code,
  Sparkles,
  Image,
  Search,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  { icon: MapPin, text: "What's the weather in Mumbai?" },
  { icon: Calculator, text: "Calculate 903 + 834/4566 - 344 × 2" },
  { icon: Code, text: "Write a Python function to sort a list" },
  { icon: Video, text: "Get the transcript of a YouTube video" },
  { icon: Image, text: "Generate an image of a beautiful sunset" },
  { icon: Search, text: "Search the web for latest AI news" },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-100 text-center gap-6">
      <div className="p-4 rounded-2xl bg-linear-to-br from-primary/10 to-muted/50 border border-primary/10">
        <Bot className="size-10 text-primary/70" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">
          Welcome to Toolix AI
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your intelligent assistant for weather, calculations, coding, and more
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 px-4 justify-start text-left hover:bg-primary/5 hover:border-primary/30 transition-all group"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            <suggestion.icon className="size-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm">{suggestion.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
