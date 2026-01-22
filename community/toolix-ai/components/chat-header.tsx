import { Bot, Sparkles } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";

export function ChatHeader() {
  return (
    <CardHeader className="border-b bg-card/80 backdrop-blur-sm shrink-0 relative z-20">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Bot className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Toolix AI</span>
            <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
              <Sparkles className="size-3" /> Tool-Enabled AI Agent
            </span>
          </div>
        </CardTitle>
        <LanguageSwitcher />
      </div>
    </CardHeader>
  );
}
