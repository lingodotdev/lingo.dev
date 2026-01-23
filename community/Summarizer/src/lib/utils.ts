import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToolUrl(toolId: string) {
    if (toolId === 'documentation-generator' || toolId === 'topic-summarizer') {
        return `/${toolId}`;
    }
    return `/tools/${toolId}`;
}
