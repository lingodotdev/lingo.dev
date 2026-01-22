import React from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "@/components/code-block";

export const markdownComponents = {
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
    const child = (children as React.ReactElement)?.props as {
      className?: string;
      children?: string;
    };
    const className = child?.className || "";
    const code = child?.children || "";

    return <CodeBlock className={className}>{code}</CodeBlock>;
  },
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div>{children}</div>
  ),
  code: ({
    inline,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 text-xs font-mono">
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto -mx-4 px-4 my-4">
      <table {...props}>{children}</table>
    </div>
  ),
};

export const markdownPlugins = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [rehypeKatex],
};
