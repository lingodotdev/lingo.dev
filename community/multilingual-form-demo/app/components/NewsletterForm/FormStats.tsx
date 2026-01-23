"use client";

interface FormStatsProps {
  errorCount: number;
  isDirty: boolean;
  isValid: boolean;
  labels: {
    errors: string;
    dirty: string;
    valid: string;
  };
}

export function FormStats({
  errorCount,
  isDirty,
  isValid,
  labels,
}: FormStatsProps) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {errorCount === 0 && isDirty ? "✓" : errorCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {labels.errors}
          </div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {isDirty ? "✓" : "−"}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {labels.dirty}
          </div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {isValid ? "✓" : "✗"}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {labels.valid}
          </div>
        </div>
      </div>
    </div>
  );
}
