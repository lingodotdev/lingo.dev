import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "md", text, className }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-8", className)}
    >
      <Loader2
        className={cn("animate-spin text-blue-600", sizeClasses[size])}
      />
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 mb-2"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/2"></div>
    </div>
  );
}

export function SchemeCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6 w-20"></div>
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-6 mb-4"></div>
      <div className="space-y-2 mb-6">
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"></div>
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-10"></div>
    </div>
  );
}
