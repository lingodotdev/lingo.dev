import { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { safeJsonParse, formatToolPayload, clampText } from "@/lib/chat-utils";

type ToolPart = {
  toolName?: string;
  name?: string;
  tool?: string;
  type?: string;
  status?: string;
  state?: string;
  phase?: string;
  output?: unknown;
  result?: unknown;
};

interface ToolCardProps {
  part: ToolPart;
  key: string;
  options?: { sources?: ReactNode };
}

export function ToolCard({ part, key, options }: ToolCardProps) {
  const toolName =
    part.toolName || part.name || part.tool || part.type || "tool";
  const status = part.status || part.state || part.phase || "";
  const outputValue = safeJsonParse(part.output ?? part.result);
  const outputText = clampText(formatToolPayload(outputValue), 8000);

  return (
    <div key={key} className="space-y-2">
      <Collapsible defaultOpen={false}>
        <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs text-foreground/90">
          <CollapsibleTrigger className="flex flex-wrap items-center gap-2 w-full justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Tool
              </span>
              <span className="font-medium text-foreground/90">{toolName}</span>
              {status && (
                <span className="rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {status}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Expand
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {outputText && !options?.sources && (
              <div className="mt-2">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                  Output
                </div>
                <CodeBlock className="language-json">{outputText}</CodeBlock>
              </div>
            )}
          </CollapsibleContent>
        </div>
        {options?.sources && (
          <CollapsibleContent>{options.sources}</CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
